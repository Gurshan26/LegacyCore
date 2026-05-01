'use client';

import { useEffect, useState } from 'react';
import styles from './COBOLViewer.module.css';

const PROGRAMS = ['payroll', 'tax', 'overtime', 'leave', 'validate'];

const PROGRAM_DESCRIPTIONS: Record<string, string> = {
  payroll: 'Master orchestrator that produces the final payroll record.',
  tax: 'Australian income tax calculator using ATO 2024-25 tax brackets + Medicare levy.',
  overtime: 'Overtime engine applying 1.5x and 2.0x rates.',
  leave: 'Leave accrual under Fair Work Act logic.',
  validate: 'Input validation and error code mapping.',
};

interface COBOLViewerProps {
  program: string;
  onProgramChange: (program: string) => void;
  onClose: () => void;
}

export default function COBOLViewer({ program, onProgramChange, onClose }: COBOLViewerProps) {
  const [source, setSource] = useState('');
  const [lineCount, setLineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/source?program=${program}`)
      .then((response) => response.json())
      .then((data) => {
        setSource(data.source || '');
        setLineCount(data.lineCount || 0);
        setError('');
      })
      .catch(() => setError('Could not load source'))
      .finally(() => setLoading(false));
  }, [program]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.filename}>{program}.cbl</span>
            <span className={styles.lines}>{lineCount} lines of COBOL</span>
          </div>

          <div className={styles.tabs}>
            {PROGRAMS.map((item) => (
              <button
                key={item}
                className={`${styles.tab} ${program === item ? styles.tabActive : ''}`}
                onClick={() => onProgramChange(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <button className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className={styles.description}>{PROGRAM_DESCRIPTIONS[program]}</div>

        <div className={styles.codeWrap}>
          {loading && <div className={styles.loading}>Loading COBOL source...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {!loading && !error && (
            <div className={styles.codeContainer}>
              <div className={styles.lineNumbers}>
                {source.split('\n').map((_, index) => (
                  <span key={index} className={styles.lineNum}>
                    {index + 1}
                  </span>
                ))}
              </div>
              <pre className={styles.code} dangerouslySetInnerHTML={{ __html: highlightCOBOL(source) }} />
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span>GnuCOBOL · Linux x86-64</span>
          <span>ISO/IEC 1989:2014</span>
          <span>Executed via Node.js child_process</span>
        </div>
      </div>
    </div>
  );
}

function highlightCOBOL(source: string): string {
  const keywordPattern =
    /\b(IDENTIFICATION|ENVIRONMENT|DATA|PROCEDURE|DIVISION|SECTION|PROGRAM-ID|AUTHOR|ACCEPT|DISPLAY|COMPUTE|MOVE|PERFORM|EVALUATE|WHEN|OTHER|END-EVALUATE|IF|ELSE|END-IF|STOP RUN|VALUE|PIC|ROUNDED|ZEROS|SPACES|UNSTRING|DELIMITED BY|INTO|AND|OR|NOT|TRUE|FALSE)\b/gi;

  return source
    .split('\n')
    .map((line) => {
      const escaped = escapeHtml(line);

      if (line.trim().startsWith('*') || (line.length > 6 && line[6] === '*')) {
        return `<span class=\"cobol-comment\">${escaped}</span>`;
      }

      return escaped
        .replace(/'([^']*)'/g, `<span class=\"cobol-string\">'$1'</span>`)
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="cobol-number">$1</span>')
        .replace(keywordPattern, '<span class="cobol-keyword">$1</span>');
    })
    .join('\n');
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
