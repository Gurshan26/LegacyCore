'use client';

import { useEffect, useRef } from 'react';
import styles from './ExecutionLog.module.css';

interface ExecutionLogProps {
  logs: string[];
  loading: boolean;
}

export default function ExecutionLog({ logs, loading }: ExecutionLogProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (logs.length === 0 && !loading) {
    return (
      <section className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.statusDot} data-status="idle" />
          <span className={styles.title}>COBOL Execution Log</span>
          <span className={styles.hint}>Click "Run Payroll" to start</span>
        </div>
        <div className={styles.empty}>Awaiting payroll batch execution...</div>
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.statusDot} data-status={loading ? 'running' : 'done'} />
        <span className={styles.title}>COBOL Execution Log</span>
        <span className={styles.count}>{logs.length} entries</span>
      </div>

      <div className={styles.logBody}>
        {logs.map((line, index) => {
          const isError = line.includes('[ERROR]');
          const isSystem = line.includes('[SYSTEM]');
          return (
            <div
              key={`${line}-${index}`}
              className={`${styles.logLine} ${isError ? styles.error : ''} ${isSystem ? styles.system : ''}`}
            >
              <span className={styles.lineNum}>{String(index + 1).padStart(3, '0')}</span>
              <span className={styles.lineText}>{line}</span>
            </div>
          );
        })}

        {loading && (
          <div className={`${styles.logLine} ${styles.cursor}`}>
            <span className={styles.lineNum}>...</span>
            <span className={styles.lineText}>▌</span>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </section>
  );
}
