import { NextRequest, NextResponse } from 'next/server';
import { EMPLOYEES } from '@/lib/employees';
import {
  parseLeaveOutput,
  parseOvertimeOutput,
  parsePayrollOutput,
  parseValidateOutput,
  runCobol,
} from '@/lib/cobol-runner';
import type { PayrollBatchResult, PayrollLineItem } from '@/types/payroll';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const employeeIds: string[] = body.employeeIds || EMPLOYEES.map((e) => e.id);
    const employees = EMPLOYEES.filter((e) => employeeIds.includes(e.id));

    if (employees.length === 0) {
      return NextResponse.json({ error: 'No valid employees found' }, { status: 400 });
    }

    const lineItems: PayrollLineItem[] = [];
    let totalCobolCalls = 0;
    let totalCobolMs = 0;

    const programStats: Record<string, { calls: number; totalMs: number }> = {
      validate: { calls: 0, totalMs: 0 },
      overtime: { calls: 0, totalMs: 0 },
      payroll: { calls: 0, totalMs: 0 },
      leave: { calls: 0, totalMs: 0 },
    };

    for (const emp of employees) {
      const log: string[] = [];

      log.push(`[VALIDATE] Processing ${emp.id} — ${emp.hoursThisPeriod}h @ $${emp.hourlyRate}/hr`);
      const validateResult = await runCobol('validate', [
        emp.hoursThisPeriod,
        emp.hourlyRate,
        emp.employmentType,
        emp.id,
      ]);
      addStats('validate', validateResult.executionTimeMs);

      const validation = parseValidateOutput(validateResult.stdout);
      if (!validation.isValid) {
        log.push(`[VALIDATE] FAILED: ${validation.errorMessage} (code: ${validation.errorCode})`);
        continue;
      }
      log.push('[VALIDATE] OK — inputs valid');

      log.push(`[OVERTIME] Computing overtime for ${emp.employmentType}-type employee`);
      const overtimeResult = await runCobol('overtime', [
        emp.hoursThisPeriod,
        emp.hourlyRate,
        emp.employmentType,
      ]);
      addStats('overtime', overtimeResult.executionTimeMs);

      const overtime = parseOvertimeOutput(overtimeResult.stdout);
      log.push(
        `[OVERTIME] Base: $${overtime.basePay.toFixed(2)} | OT: $${overtime.overtimePay.toFixed(2)} (${overtime.overtimeHours.toFixed(2)}h)`
      );

      log.push('[PAYROLL] Running COBOL payroll engine...');
      const payrollResult = await runCobol('payroll', [
        emp.id,
        emp.hoursThisPeriod,
        emp.hourlyRate,
        emp.employmentType,
        emp.annualLeaveBalance,
        emp.sickLeaveBalance,
        emp.ytdGross,
      ]);
      addStats('payroll', payrollResult.executionTimeMs);

      const payroll = parsePayrollOutput(payrollResult.stdout);
      const grossPay = overtime.totalPay;
      const netPay = grossPay - payroll.taxWithheld - payroll.medicareLevy;
      log.push(
        `[PAYROLL] Gross: $${grossPay.toFixed(2)} | Tax: $${payroll.taxWithheld.toFixed(2)} | Super: $${payroll.superAmount.toFixed(2)} | Net: $${netPay.toFixed(2)}`
      );

      log.push('[LEAVE] Accruing leave balances...');
      const leaveResult = await runCobol('leave', [
        emp.hoursThisPeriod,
        emp.employmentType,
        emp.annualLeaveBalance,
        emp.sickLeaveBalance,
      ]);
      addStats('leave', leaveResult.executionTimeMs);

      const leave = parseLeaveOutput(leaveResult.stdout);
      log.push(`[LEAVE] AL accrued: ${leave.alAccrued.toFixed(2)}h | SL accrued: ${leave.slAccrued.toFixed(2)}h`);
      log.push(`[PAYROLL] ✓ Record complete for ${emp.id}`);

      lineItems.push({
        empId: emp.id,
        name: emp.name,
        role: emp.role,
        department: emp.department,
        employmentType: emp.employmentType,
        hoursWorked: emp.hoursThisPeriod,
        hourlyRate: emp.hourlyRate,
        basePay: overtime.basePay,
        overtimePay: overtime.overtimePay,
        overtimeHours: overtime.overtimeHours,
        grossPay,
        taxWithheld: payroll.taxWithheld,
        medicareLevy: payroll.medicareLevy,
        superAmount: payroll.superAmount,
        netPay,
        ytdGross: emp.ytdGross + grossPay,
        alAccrued: leave.alAccrued,
        slAccrued: leave.slAccrued,
        alBalance: leave.alNewBalance,
        slBalance: leave.slNewBalance,
        executionLog: log,
      });
    }

    const now = new Date();
    const result: PayrollBatchResult = {
      payPeriod: `${formatDate(getPeriodStart(now))} – ${formatDate(now)}`,
      processedAt: now.toISOString(),
      totalEmployees: lineItems.length,
      totalGross: sum(lineItems, 'grossPay'),
      totalTax: sum(lineItems, 'taxWithheld'),
      totalMedicare: sum(lineItems, 'medicareLevy'),
      totalSuper: sum(lineItems, 'superAmount'),
      totalNet: sum(lineItems, 'netPay'),
      lineItems,
      cobolExecutionStats: {
        totalCallsToCobol: totalCobolCalls,
        totalExecutionMs: totalCobolMs,
        programs: Object.entries(programStats).map(([name, s]) => ({
          name,
          callCount: s.calls,
          avgMs: s.calls > 0 ? Math.round(s.totalMs / s.calls) : 0,
        })),
      },
    };

    return NextResponse.json(result);

    function addStats(program: keyof typeof programStats, executionTimeMs: number) {
      programStats[program].calls += 1;
      programStats[program].totalMs += executionTimeMs;
      totalCobolCalls += 1;
      totalCobolMs += executionTimeMs;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Payroll run failed' }, { status: 500 });
  }
}

function sum(items: PayrollLineItem[], key: keyof PayrollLineItem): number {
  return items.reduce((acc, item) => acc + (item[key] as number), 0);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getPeriodStart(end: Date): Date {
  const start = new Date(end);
  start.setDate(start.getDate() - 13);
  return start;
}
