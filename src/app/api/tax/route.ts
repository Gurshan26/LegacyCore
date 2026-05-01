import { NextRequest, NextResponse } from 'next/server';
import { parseTaxOutput, runCobol } from '@/lib/cobol-runner';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { annualGross, payPeriods = 26 } = body;

    if (typeof annualGross !== 'number' || annualGross < 0) {
      return NextResponse.json(
        { error: 'annualGross must be a non-negative number' },
        { status: 400 }
      );
    }

    if (![12, 26, 52].includes(payPeriods)) {
      return NextResponse.json({ error: 'payPeriods must be 12, 26, or 52' }, { status: 400 });
    }

    const result = await runCobol('tax', [annualGross.toFixed(2), payPeriods]);
    const parsed = parseTaxOutput(result.stdout);

    return NextResponse.json({ ...parsed, executionTimeMs: result.executionTimeMs });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Tax calculation failed' }, { status: 500 });
  }
}
