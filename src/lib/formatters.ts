export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatHours(hours: number | null | undefined): string {
  if (hours === null || hours === undefined || Number.isNaN(hours)) return '—';
  return `${hours.toFixed(2)}h`;
}

export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatEmploymentType(type: string): string {
  const map: Record<string, string> = { F: 'Full-time', P: 'Part-time', C: 'Casual' };
  return map[type] || type;
}

export function formatTaxBracket(annualGross: number): string {
  if (annualGross <= 18200) return '$0 – $18,200 (0%)';
  if (annualGross <= 45000) return '$18,201 – $45,000 (19c)';
  if (annualGross <= 120000) return '$45,001 – $120,000 (32.5c)';
  if (annualGross <= 180000) return '$120,001 – $180,000 (37c)';
  return '$180,001+ (45c)';
}
