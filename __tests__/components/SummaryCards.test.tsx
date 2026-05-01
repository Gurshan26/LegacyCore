import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SummaryCards from '@/components/SummaryCards/SummaryCards';

const MOCK_RESULT = {
  payPeriod: '01 Jun 2025 – 14 Jun 2025',
  processedAt: new Date().toISOString(),
  totalEmployees: 8,
  totalGross: 45000,
  totalTax: 10000,
  totalMedicare: 900,
  totalSuper: 5175,
  totalNet: 34100,
  lineItems: [],
  cobolExecutionStats: {
    totalCallsToCobol: 32,
    totalExecutionMs: 187,
    programs: [],
  },
};

describe('SummaryCards', () => {
  it('renders employee count', () => {
    render(<SummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders gross and net totals', () => {
    render(<SummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText(/45,000\.00/)).toBeInTheDocument();
    expect(screen.getByText(/34,100\.00/)).toBeInTheDocument();
  });

  it('shows cobol execution stats', () => {
    render(<SummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText(/32 COBOL calls/i)).toBeInTheDocument();
  });
});
