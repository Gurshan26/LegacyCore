'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './RunPayrollButton.module.css';

interface RunPayrollButtonProps {
  loading: boolean;
  onRun: () => Promise<void>;
}

const STEPS = [
  'Validating inputs',
  'Computing overtime',
  'Calculating tax',
  'Accruing leave',
  'Finalising payroll',
];

export default function RunPayrollButton({ loading, onRun }: RunPayrollButtonProps) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 4, 100);
        const index = Math.min(STEPS.length - 1, Math.floor((next / 100) * STEPS.length));
        setStepIndex(index);
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [loading]);

  const stage = useMemo(() => STEPS[Math.min(stepIndex, STEPS.length - 1)], [stepIndex]);

  return (
    <div className={styles.wrap}>
      <button className={styles.button} disabled={loading} onClick={onRun}>
        {loading ? 'Running Payroll...' : 'Run Payroll'}
      </button>

      <div className={styles.progressShell} aria-hidden={!loading}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      <span className={styles.stageText}>{loading ? `${stage}...` : 'Ready for next batch'}</span>
    </div>
  );
}
