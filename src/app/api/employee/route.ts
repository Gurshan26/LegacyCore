import { NextResponse } from 'next/server';
import { EMPLOYEES } from '@/lib/employees';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    total: EMPLOYEES.length,
    employees: EMPLOYEES,
  });
}
