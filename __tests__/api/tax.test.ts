import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/cobol-runner', () => ({
  runCobol: vi.fn().mockResolvedValue({
    stdout: '16467.00,633.35,1600.00,61.54,20.58',
    stderr: '',
    executionTimeMs: 12,
  }),
  parseTaxOutput: vi.fn().mockReturnValue({
    taxAnnual: 16467,
    taxPeriod: 633.35,
    medicareAnnual: 1600,
    medicarePeriod: 61.54,
    effectiveRate: 20.58,
  }),
}));

import { POST } from '@/app/api/tax/route';

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/tax', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/tax', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 for valid input', async () => {
    const res = await POST(makeRequest({ annualGross: 80000 }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.taxAnnual).toBe(16467);
  });

  it('rejects negative annual gross', async () => {
    const res = await POST(makeRequest({ annualGross: -100 }));
    expect(res.status).toBe(400);
  });

  it('rejects invalid pay periods', async () => {
    const res = await POST(makeRequest({ annualGross: 80000, payPeriods: 10 }));
    expect(res.status).toBe(400);
  });

  it('accepts 12, 26, 52 pay periods', async () => {
    for (const pp of [12, 26, 52]) {
      const res = await POST(makeRequest({ annualGross: 80000, payPeriods: pp }));
      expect(res.status).toBe(200);
    }
  });
});
