export type EmploymentType = 'F' | 'P' | 'C';

export interface TaxBracket {
  threshold: number;
  base: number;
  rate: number;
}

export interface TaxResult {
  taxAnnual: number;
  taxPeriod: number;
  medicareAnnual: number;
  medicarePeriod: number;
  effectiveRate: number;
  executionTimeMs?: number;
}

export interface OvertimeResult {
  basePay: number;
  overtimePay: number;
  overtimeHours: number;
  totalPay: number;
}

export interface LeaveResult {
  alAccrued: number;
  slAccrued: number;
  alNewBalance: number;
  slNewBalance: number;
}

export interface ValidationResult {
  isValid: boolean;
  errorCode: number;
  errorMessage: string;
}

export interface PayrollLineItem {
  empId: string;
  name: string;
  role: string;
  department: string;
  employmentType: EmploymentType;
  hoursWorked: number;
  hourlyRate: number;
  basePay: number;
  overtimePay: number;
  overtimeHours: number;
  grossPay: number;
  taxWithheld: number;
  medicareLevy: number;
  superAmount: number;
  netPay: number;
  ytdGross: number;
  alAccrued: number;
  slAccrued: number;
  alBalance: number;
  slBalance: number;
  executionLog: string[];
}

export interface COBOLExecutionStats {
  totalCallsToCobol: number;
  totalExecutionMs: number;
  programs: Array<{
    name: string;
    callCount: number;
    avgMs: number;
  }>;
}

export interface PayrollBatchResult {
  payPeriod: string;
  processedAt: string;
  totalEmployees: number;
  totalGross: number;
  totalTax: number;
  totalMedicare: number;
  totalSuper: number;
  totalNet: number;
  lineItems: PayrollLineItem[];
  cobolExecutionStats: COBOLExecutionStats;
}

export interface PayslipData extends PayrollLineItem {
  payPeriod: string;
}
