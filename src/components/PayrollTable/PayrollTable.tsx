import { formatCurrency, formatEmploymentType, formatHours } from '@/lib/formatters';
import type { PayrollBatchResult, PayrollLineItem } from '@/types/payroll';
import styles from './PayrollTable.module.css';

interface PayrollTableProps {
  result: PayrollBatchResult | null;
  loading: boolean;
  onViewPayslip: (item: PayrollLineItem) => void;
}

export default function PayrollTable({ result, loading, onViewPayslip }: PayrollTableProps) {
  if (!result && !loading) {
    return (
      <div className={styles.placeholder}>
        Run payroll to generate the ledger. This table displays one row per employee with COBOL-computed outputs.
      </div>
    );
  }

  if (loading && !result) {
    return <div className={styles.placeholder}>Running COBOL payroll batch...</div>;
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee</th>
            <th className={styles.right}>Type</th>
            <th className={styles.right}>Hours</th>
            <th className={styles.right}>Rate</th>
            <th className={styles.right}>Gross</th>
            <th className={styles.right}>Tax</th>
            <th className={styles.right}>Medicare</th>
            <th className={styles.right}>Super</th>
            <th className={styles.right}>Net</th>
            <th className={styles.right}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {result?.lineItems.map((row) => (
            <tr key={row.empId}>
              <td>
                <div className={styles.employeeCell}>
                  <span className={styles.name}>{row.name}</span>
                  <span className={styles.meta}>{row.empId} · {row.department}</span>
                </div>
              </td>
              <td className={styles.right}>{formatEmploymentType(row.employmentType)}</td>
              <td className={`${styles.right} data`}>{formatHours(row.hoursWorked)}</td>
              <td className={`${styles.right} data`}>{formatCurrency(row.hourlyRate)}</td>
              <td className={`${styles.right} data`}>{formatCurrency(row.grossPay)}</td>
              <td className={`${styles.right} data`}>{formatCurrency(row.taxWithheld)}</td>
              <td className={`${styles.right} data`}>{formatCurrency(row.medicareLevy)}</td>
              <td className={`${styles.right} data`}>{formatCurrency(row.superAmount)}</td>
              <td className={`${styles.right} data ${styles.net}`}>{formatCurrency(row.netPay)}</td>
              <td className={styles.right}>
                <button className={styles.payslipBtn} onClick={() => onViewPayslip(row)}>
                  View Payslip
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
