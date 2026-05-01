import { describe, expect, it } from 'vitest';
import {
  parseLeaveOutput,
  parseOvertimeOutput,
  parsePayrollOutput,
  parseTaxOutput,
  parseValidateOutput,
} from '@/lib/cobol-runner';

describe('parseTaxOutput', () => {
  it('parses all 5 fields', () => {
    const output = parseTaxOutput('16467.00,633.35,1600.00,61.54,20.58');
    expect(output.taxAnnual).toBe(16467);
    expect(output.taxPeriod).toBeCloseTo(633.35, 2);
    expect(output.medicareAnnual).toBe(1600);
    expect(output.medicarePeriod).toBeCloseTo(61.54, 2);
    expect(output.effectiveRate).toBeCloseTo(20.58, 2);
  });

  it('throws for invalid payloads', () => {
    expect(() => parseTaxOutput('1,2,3')).toThrow();
    expect(() => parseTaxOutput('a,b,c,d,e')).toThrow();
  });
});

describe('parseOvertimeOutput', () => {
  it('parses all 4 fields', () => {
    const output = parseOvertimeOutput('1900.00,150.00,2.00,2050.00');
    expect(output.basePay).toBe(1900);
    expect(output.overtimePay).toBe(150);
    expect(output.overtimeHours).toBe(2);
    expect(output.totalPay).toBe(2050);
  });

  it('throws for invalid payload', () => {
    expect(() => parseOvertimeOutput('1900,0')).toThrow();
  });
});

describe('parseLeaveOutput', () => {
  it('parses all 4 fields', () => {
    const output = parseLeaveOutput('5.8462,2.9231,45.8462,20.9231');
    expect(output.alAccrued).toBeCloseTo(5.8462, 4);
    expect(output.slAccrued).toBeCloseTo(2.9231, 4);
    expect(output.alNewBalance).toBeCloseTo(45.8462, 4);
    expect(output.slNewBalance).toBeCloseTo(20.9231, 4);
  });

  it('throws for invalid payload', () => {
    expect(() => parseLeaveOutput('5,2')).toThrow();
  });
});

describe('parseValidateOutput', () => {
  it('parses valid flag', () => {
    const output = parseValidateOutput('Y,00,');
    expect(output.isValid).toBe(true);
    expect(output.errorCode).toBe(0);
  });

  it('parses invalid flag and message', () => {
    const output = parseValidateOutput('N,01,Hours must be between 0 and 168');
    expect(output.isValid).toBe(false);
    expect(output.errorCode).toBe(1);
    expect(output.errorMessage).toContain('Hours');
  });
});

describe('parsePayrollOutput', () => {
  it('parses all fields', () => {
    const output = parsePayrollOutput('EMP-001,3800.00,800.00,76.00,437.00,2924.00,110500.00');
    expect(output.empId).toBe('EMP-001');
    expect(output.grossPay).toBe(3800);
    expect(output.taxWithheld).toBe(800);
    expect(output.netPay).toBe(2924);
  });

  it('throws for invalid payload', () => {
    expect(() => parsePayrollOutput('EMP-001,100,200')).toThrow();
  });
});
