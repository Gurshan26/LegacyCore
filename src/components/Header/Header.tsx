import { formatDate } from '@/lib/formatters';
import styles from './Header.module.css';

interface HeaderProps {
  payPeriod: string;
  lastRun?: string;
}

export default function Header({ payPeriod, lastRun }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.title}>LegacyCore</span>
        <span className={styles.subtitle}>COBOL Payroll Engine</span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.label}>Current Period</span>
          <span className={styles.value}>{payPeriod}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.label}>Last Run</span>
          <span className={styles.value}>{lastRun ? formatDate(lastRun) : 'Not run yet'}</span>
        </div>
      </div>

      <div className={styles.status}>
        <span className={styles.dot} />
        <span>MAINFRAME CONNECTED</span>
      </div>
    </header>
  );
}
