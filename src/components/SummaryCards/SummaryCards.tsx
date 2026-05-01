import { formatCurrency, formatDate } from '@/lib/formatters';
import type { PayrollBatchResult } from '@/types/payroll';
import styles from './SummaryCards.module.css';

interface SummaryCardsProps {
  result: PayrollBatchResult;
}

export default function SummaryCards({ result }: SummaryCardsProps) {
  const cards = [
    { label: 'Employees', value: String(result.totalEmployees) },
    { label: 'Gross Pay', value: formatCurrency(result.totalGross) },
    { label: 'Tax + Medicare', value: formatCurrency(result.totalTax + result.totalMedicare) },
    { label: 'Superannuation', value: formatCurrency(result.totalSuper) },
    { label: 'Net Pay', value: formatCurrency(result.totalNet), strong: true },
  ];

  return (
    <section className={styles.wrap}>
      <div className={styles.grid}>
        {cards.map((card) => (
          <article className={styles.card} key={card.label}>
            <span className={styles.label}>{card.label}</span>
            <span className={`${styles.value} ${card.strong ? styles.strong : ''}`}>{card.value}</span>
          </article>
        ))}
      </div>

      <div className={styles.foot}>
        <span>{result.cobolExecutionStats.totalCallsToCobol} COBOL calls</span>
        <span>{result.cobolExecutionStats.totalExecutionMs}ms total execution</span>
        <span>Processed {formatDate(result.processedAt)}</span>
      </div>
    </section>
  );
}
