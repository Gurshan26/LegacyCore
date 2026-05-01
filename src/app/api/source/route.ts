import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const VALID_PROGRAMS = ['payroll', 'tax', 'overtime', 'leave', 'validate'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const program = searchParams.get('program');

  if (!program || !VALID_PROGRAMS.includes(program)) {
    return NextResponse.json(
      { error: `Invalid program. Valid options: ${VALID_PROGRAMS.join(', ')}` },
      { status: 400 }
    );
  }

  const filePath = path.join(process.cwd(), 'cobol', `${program}.cbl`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: `Source file not found: ${program}.cbl` }, { status: 404 });
  }

  const source = fs.readFileSync(filePath, 'utf-8');

  return NextResponse.json({
    program,
    filename: `${program}.cbl`,
    lineCount: source.split('\n').length,
    source,
  });
}
