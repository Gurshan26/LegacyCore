'use client';

import { formatCurrency, formatHours } from '@/lib/formatters';
import type { PayslipData } from '@/types/payroll';
import styles from './PayslipModal.module.css';

interface PayslipModalProps {
  payslip: PayslipData;
  onClose: () => void;
  onViewSource: (program: string) => void;
}

export default function PayslipModal({ payslip, onClose, onViewSource }: PayslipModalProps) {
  const employmentType = {
    F: 'Full-time',
    P: 'Part-time',
    C: 'Casual',
  }[payslip.employmentType];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.payslipHeader}>
          <div className={styles.companyBlock}>
            <span className={styles.companyName}>LEGACYCORE PTY LTD</span>
            <span className={styles.abn}>ABN 12 345 678 901</span>
          </div>

          <div className={styles.titleBlock}>
            <span className={styles.payslipTitle}>STATEMENT OF EARNINGS</span>
            <span className={styles.payPeriod}>Pay Period: {payslip.payPeriod}</span>
          </div>
        </div>

        <div className={styles.empSection}>
          <Field label="EMPLOYEE ID" value={payslip.empId} mono />
          <Field label="NAME" value={payslip.name} />
          <Field label="POSITION" value={payslip.role} />
          <Field label="EMPLOYMENT TYPE" value={employmentType || payslip.employmentType} />
          <Field label="HOURLY RATE" value={formatCurrency(payslip.hourlyRate)} mono />
        </div>

        <table className={styles.ledger}>
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th className={styles.right}>HOURS</th>
              <th className={styles.right}>RATE</th>
              <th className={styles.right}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ordinary Time</td>
              <td className={`${styles.right} data`}>{formatHours(payslip.hoursWorked - payslip.overtimeHours)}</td>
              <td className={`${styles.right} data`}>{formatCurrency(payslip.hourlyRate)}</td>
              <td className={`${styles.right} data`}>{formatCurrency(payslip.basePay)}</td>
            </tr>
            {payslip.overtimeHours > 0 && (
              <tr>
                <td>Overtime (penalty rates)</td>
                <td className={`${styles.right} data`}>{formatHours(payslip.overtimeHours)}</td>
                <td className={`${styles.right} data`}>1.5× / 2.0×</td>
                <td className={`${styles.right} data`}>{formatCurrency(payslip.overtimePay)}</td>
              </tr>
            )}
            <tr className={styles.subtotal}>
              <td colSpan={3}>GROSS EARNINGS</td>
              <td className={`${styles.right} data`}>{formatCurrency(payslip.grossPay)}</td>
            </tr>
          </tbody>
        </table>

        <table className={styles.ledger}>
          <thead>
            <tr>
              <th>DEDUCTIONS</th>
              <th className={styles.right}>AMOUNT</th>
              <th className={styles.right}>SOURCE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Income Tax Withheld (PAYG)</td>
              <td className={`${styles.right} data`}>{formatCurrency(payslip.taxWithheld)}</td>
              <td className={styles.right}>
                <button className={styles.sourceLink} onClick={() => onViewSource('tax')}>
                  tax.cbl
                </button>
              </td>
            </tr>
            <tr>
              <td>Medicare Levy (2.0%)</td>
              <td className={`${styles.right} data`}>{formatCurrency(payslip.medicareLevy)}</td>
              <td className={styles.right}>
                <button className={styles.sourceLink} onClick={() => onViewSource('tax')}>
                  tax.cbl
                </button>
              </td>
            </tr>
            <tr className={styles.subtotal}>
              <td>TOTAL DEDUCTIONS</td>
              <td className={`${styles.right} data`}>
                {formatCurrency(payslip.taxWithheld + payslip.medicareLevy)}
              </td>
              <td />
            </tr>
          </tbody>
        </table>

        <div className={styles.netSection}>
          <div className={styles.superLine}>
            <span>Superannuation (11.5% SGC)</span>
            <span className="data">{formatCurrency(payslip.superAmount)}</span>
          </div>
          <div className={styles.netLine}>
            <span>NET PAY</span>
            <span className={`${styles.netAmount} data`}>{formatCurrency(payslip.netPay)}</span>
          </div>
        </div>

        <div className={styles.leaveSection}>
          <div className={styles.leaveTitle}>
            LEAVE BALANCES
            <button className={styles.sourceLink} onClick={() => onViewSource('leave')}>
              leave.cbl
            </button>
          </div>
          <div className={styles.leaveRow}>
            <span>Annual Leave</span>
            <span className="data">
              {formatHours(payslip.alBalance)} (+{formatHours(payslip.alAccrued)} this period)
            </span>
          </div>
          <div className={styles.leaveRow}>
            <span>Sick / Carer's Leave</span>
            <span className="data">
              {formatHours(payslip.slBalance)} (+{formatHours(payslip.slAccrued)} this period)
            </span>
          </div>
        </div>

        <div className={styles.stamp}>
          COMPUTED BY LEGACYCORE COBOL ENGINE v1.0
          <br />
          GnuCOBOL 3.2 · ISO/IEC 1989:2014 · ATO 2024-25 Tax Schedule
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={`${styles.fieldValue} ${mono ? 'data' : ''}`}>{value}</span>
    </div>
  );
}
