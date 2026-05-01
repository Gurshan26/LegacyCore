import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { parseOvertimeOutput, runCobol } from '@/lib/cobol-runner';

const BINARY_EXISTS =
  fs.existsSync(path.join(process.cwd(), 'cobol', 'bin', 'linux-x64', 'overtime')) ||
  fs.existsSync(path.join(process.cwd(), 'cobol', 'bin', 'overtime'));
const CAN_RUN_BINARY = process.platform === 'linux' && process.arch === 'x64';

describe.skipIf(!(BINARY_EXISTS && CAN_RUN_BINARY))('COBOL Overtime Calculator (binary tests)', () => {
  it('no overtime for 38 hours full-time', async () => {
    const result = await runCobol('overtime', ['38.00', '50.00', 'F']);
    const parsed = parseOvertimeOutput(result.stdout);
    expect(parsed.overtimePay).toBe(0);
    expect(parsed.basePay).toBeCloseTo(1900, 0);
  });

  it('applies 1.5x for first overtime band', async () => {
    const result = await runCobol('overtime', ['40.00', '50.00', 'F']);
    const parsed = parseOvertimeOutput(result.stdout);
    expect(parsed.overtimePay).toBeCloseTo(150, 0);
  });
});
