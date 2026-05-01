import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/cobol-runner', async () => {
  const actual = await vi.importActual<typeof import('@/lib/cobol-runner')>('@/lib/cobol-runner');

  return {
    ...actual,
    runCobol: vi.fn(async (program: string) => {
      switch (program) {
        case 'validate':
          return { stdout: 'Y,00,', stderr: '', executionTimeMs: 2 };
        case 'overtime':
          return { stdout: '1900.00,100.00,2.00,2000.00', stderr: '', executionTimeMs: 3 };
        case 'payroll':
          return {
            stdout: 'EMP-001,2000.00,300.00,40.00,230.00,1660.00,120000.00',
            stderr: '',
            executionTimeMs: 4,
          };
        case 'leave':
          return { stdout: '5.8462,2.9231,50.00,20.00', stderr: '', executionTimeMs: 1 };
        default:
          throw new Error(`Unknown program ${program}`);
      }
    }),
  };
});

import { POST } from '@/app/api/payroll/route';

function makeRequest(body: object = {}) {
  return new NextRequest('http://localhost/api/payroll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/payroll', () => {
  it('returns full batch result', async () => {
    const response = await POST(makeRequest({}));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.totalEmployees).toBe(8);
    expect(body.lineItems.length).toBe(8);
    expect(body.cobolExecutionStats.totalCallsToCobol).toBe(32);
    expect(body.lineItems[0].executionLog.some((line: string) => line.includes('[PAYROLL]'))).toBe(true);
  });

  it('returns 400 if no valid employees are selected', async () => {
    const response = await POST(makeRequest({ employeeIds: ['EMP-999'] }));
    expect(response.status).toBe(400);
  });
});
