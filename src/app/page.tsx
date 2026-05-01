'use client';

import { useMemo, useState } from 'react';
import COBOLViewer from '@/components/COBOLViewer/COBOLViewer';
import ExecutionLog from '@/components/ExecutionLog/ExecutionLog';
import Header from '@/components/Header/Header';
import PayslipModal from '@/components/PayslipModal/PayslipModal';
import PayrollTable from '@/components/PayrollTable/PayrollTable';
import RunPayrollButton from '@/components/RunPayrollButton/RunPayrollButton';
import SummaryCards from '@/components/SummaryCards/SummaryCards';
import TaxCalculator from '@/components/TaxCalculator/TaxCalculator';
import type { PayrollBatchResult, PayslipData } from '@/types/payroll';
import styles from './page.module.css';

export default function DashboardPage() {
  const [payrollResult, setPayrollResult] = useState<PayrollBatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(null);
  const [showCobolViewer, setShowCobolViewer] = useState(false);
  const [activeProgram, setActiveProgram] = useState('payroll');
  const [allLogs, setAllLogs] = useState<string[]>([]);

  const payPeriod = useMemo(() => getCurrentPeriod(), []);

  async function handleRunPayroll() {
    setLoading(true);
    setAllLogs(['[SYSTEM] Initiating payroll batch run...']);

    try {
      const response = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = (await response.json()) as PayrollBatchResult | { error: string };
      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Payroll run failed');
      }

      setPayrollResult(data);

      const stagedLogs = data.lineItems.flatMap((line) => line.executionLog);
      stagedLogs.push(
        `[SYSTEM] Batch complete. ${data.totalEmployees} records processed in ${data.cobolExecutionStats.totalExecutionMs}ms.`
      );
      stagedLogs.push(`[SYSTEM] Total COBOL calls: ${data.cobolExecutionStats.totalCallsToCobol}`);

      setAllLogs((prev) => [...prev]);
      for (let i = 0; i < stagedLogs.length; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 35));
        setAllLogs((prev) => [...prev, stagedLogs[i]]);
      }
    } catch (error: any) {
      setAllLogs((prev) => [...prev, `[ERROR] ${error?.message || 'Unexpected error'}`]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <Header payPeriod={payPeriod} lastRun={payrollResult?.processedAt} />

      <main className={styles.main}>
        <div className={styles.topRow}>
          <div className={styles.titleBlock}>
            <h1>Payroll Processing</h1>
            <p className={styles.periodLabel}>Fortnightly Pay Run · {payPeriod}</p>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.viewSource}
              onClick={() => {
                setActiveProgram('payroll');
                setShowCobolViewer(true);
              }}
            >
              {'</'} View COBOL Source
            </button>
            <RunPayrollButton loading={loading} onRun={handleRunPayroll} />
          </div>
        </div>

        {payrollResult && <SummaryCards result={payrollResult} />}

        <div className={styles.contentGrid}>
          <section className={styles.tableSection}>
            <PayrollTable
              result={payrollResult}
              loading={loading}
              onViewPayslip={(lineItem) => setSelectedPayslip({ ...lineItem, payPeriod: payrollResult?.payPeriod || payPeriod })}
            />
          </section>

          <aside className={styles.sideSection}>
            <TaxCalculator />
          </aside>
        </div>

        <ExecutionLog logs={allLogs} loading={loading} />
      </main>

      {selectedPayslip && (
        <PayslipModal
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          onViewSource={(program) => {
            setActiveProgram(program);
            setShowCobolViewer(true);
          }}
        />
      )}

      {showCobolViewer && (
        <COBOLViewer
          program={activeProgram}
          onProgramChange={setActiveProgram}
          onClose={() => setShowCobolViewer(false)}
        />
      )}
    </div>
  );
}

function getCurrentPeriod(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 13);

  return `${start.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
  })} – ${now.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`;
}
