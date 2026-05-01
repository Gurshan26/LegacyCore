'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/formatters';
import styles from './TaxCalculator.module.css';

interface TaxApiResult {
  taxAnnual: number;
  taxPeriod: number;
  medicareAnnual: number;
  medicarePeriod: number;
  effectiveRate: number;
  executionTimeMs: number;
  error?: string;
}

export default function TaxCalculator() {
  const [gross, setGross] = useState(80000);
  const [result, setResult] = useState<TaxApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    try {
      const response = await fetch('/api/tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ annualGross: gross, payPeriods: 26 }),
      });
      const data = (await response.json()) as TaxApiResult;
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.title}>Tax Calculator</span>
        <span className={styles.badge}>Powered by tax.cbl</span>
      </div>

      <div className={styles.inputRow}>
        <label className={styles.label} htmlFor="annual-gross">
          Annual gross salary (AUD)
        </label>
        <div className={styles.inputWrap}>
          <span className={styles.prefix}>$</span>
          <input
            id="annual-gross"
            type="number"
            className={`${styles.input} data`}
            value={gross}
            onChange={(event) => setGross(Number(event.target.value))}
            min={0}
            max={10000000}
            step={1000}
          />
        </div>
        <button className={styles.calcBtn} onClick={calculate} disabled={loading}>
          {loading ? 'Running COBOL...' : 'Calculate'}
        </button>
      </div>

      {result && !result.error && (
        <div className={styles.results}>
          <div className={styles.resultRow}>
            <span>Annual gross</span>
            <span className="data">{formatCurrency(gross)}</span>
          </div>
          <div className={styles.resultRow}>
            <span>Income tax (annual)</span>
            <span className={`data ${styles.deduction}`}>{formatCurrency(result.taxAnnual)}</span>
          </div>
          <div className={styles.resultRow}>
            <span>Medicare levy (annual)</span>
            <span className={`data ${styles.deduction}`}>{formatCurrency(result.medicareAnnual)}</span>
          </div>
          <div className={`${styles.resultRow} ${styles.resultHighlight}`}>
            <span>Net annual (est.)</span>
            <span className="data">{formatCurrency(gross - result.taxAnnual - result.medicareAnnual)}</span>
          </div>
          <div className={styles.resultRow}>
            <span>Fortnightly tax withheld</span>
            <span className={`data ${styles.deduction}`}>{formatCurrency(result.taxPeriod)}</span>
          </div>
          <div className={styles.resultRow}>
            <span>Effective rate</span>
            <span className="data">{result.effectiveRate.toFixed(2)}%</span>
          </div>
          <div className={styles.execTime}>COBOL executed in {result.executionTimeMs}ms</div>
        </div>
      )}

      {result?.error && <p className={styles.error}>{result.error}</p>}
    </section>
  );
}
