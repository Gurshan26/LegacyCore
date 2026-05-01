import type { TaxBracket } from '@/types/payroll';

export const AU_TAX_BRACKETS_2024_25: TaxBracket[] = [
  { threshold: 18200, base: 0, rate: 0 },
  { threshold: 45000, base: 0, rate: 0.19 },
  { threshold: 120000, base: 5092, rate: 0.325 },
  { threshold: 180000, base: 29467, rate: 0.37 },
  { threshold: Number.POSITIVE_INFINITY, base: 51667, rate: 0.45 },
];
