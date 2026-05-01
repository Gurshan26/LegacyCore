import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatEmploymentType,
  formatHours,
  formatPercent,
  formatTaxBracket,
} from '@/lib/formatters';

describe('formatCurrency', () => {
  it('formats positive amount in AUD', () => {
    expect(formatCurrency(1234.56)).toMatch(/1,234\.56/);
  });

  it('handles null and NaN', () => {
    expect(formatCurrency(null)).toBe('—');
    expect(formatCurrency(NaN)).toBe('—');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toMatch(/0\.00/);
  });
});

describe('formatHours', () => {
  it('formats two decimals', () => {
    expect(formatHours(5.8462)).toBe('5.85h');
  });

  it('handles null', () => {
    expect(formatHours(null)).toBe('—');
  });
});

describe('formatPercent', () => {
  it('formats with defaults and custom decimals', () => {
    expect(formatPercent(20.58)).toBe('20.6%');
    expect(formatPercent(20.584, 2)).toBe('20.58%');
  });
});

describe('formatDate', () => {
  it('formats iso date', () => {
    expect(formatDate('2025-06-14T12:00:00.000Z')).toMatch(/2025|25/);
  });

  it('handles empty input', () => {
    expect(formatDate(null)).toBe('—');
  });
});

describe('formatEmploymentType', () => {
  it('maps types', () => {
    expect(formatEmploymentType('F')).toBe('Full-time');
    expect(formatEmploymentType('P')).toBe('Part-time');
    expect(formatEmploymentType('C')).toBe('Casual');
    expect(formatEmploymentType('X')).toBe('X');
  });
});

describe('formatTaxBracket', () => {
  it('maps salary to bracket', () => {
    expect(formatTaxBracket(0)).toContain('0%');
    expect(formatTaxBracket(30000)).toContain('19c');
    expect(formatTaxBracket(80000)).toContain('32.5c');
    expect(formatTaxBracket(150000)).toContain('37c');
    expect(formatTaxBracket(250000)).toContain('45c');
  });
});
