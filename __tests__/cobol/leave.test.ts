import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { parseLeaveOutput, runCobol } from '@/lib/cobol-runner';

const BINARY_EXISTS =
  fs.existsSync(path.join(process.cwd(), 'cobol', 'bin', 'linux-x64', 'leave')) ||
  fs.existsSync(path.join(process.cwd(), 'cobol', 'bin', 'leave'));
const CAN_RUN_BINARY = process.platform === 'linux' && process.arch === 'x64';

describe.skipIf(!(BINARY_EXISTS && CAN_RUN_BINARY))('COBOL Leave Accrual (binary tests)', () => {
  it('full-time accrual values are non-zero', async () => {
    const result = await runCobol('leave', ['76.00', 'F', '0.00', '0.00']);
    const parsed = parseLeaveOutput(result.stdout);
    expect(parsed.alAccrued).toBeGreaterThan(0);
    expect(parsed.slAccrued).toBeGreaterThan(0);
  });

  it('casual accrues zero leave', async () => {
    const result = await runCobol('leave', ['40.00', 'C', '0.00', '0.00']);
    const parsed = parseLeaveOutput(result.stdout);
    expect(parsed.alAccrued).toBe(0);
    expect(parsed.slAccrued).toBe(0);
  });
});
