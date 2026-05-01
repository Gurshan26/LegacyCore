import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { parseValidateOutput, runCobol } from '@/lib/cobol-runner';

const BINARY_EXISTS =
  fs.existsSync(path.join(process.cwd(), 'cobol', 'bin', 'linux-x64', 'validate')) ||
  fs.existsSync(path.join(process.cwd(), 'cobol', 'bin', 'validate'));
const CAN_RUN_BINARY = process.platform === 'linux' && process.arch === 'x64';

describe.skipIf(!(BINARY_EXISTS && CAN_RUN_BINARY))('COBOL Validate (binary tests)', () => {
  it('accepts valid input', async () => {
    const result = await runCobol('validate', ['76.00', '85.00', 'F', 'EMP-001']);
    const parsed = parseValidateOutput(result.stdout);
    expect(parsed.isValid).toBe(true);
  });

  it('rejects invalid employment type', async () => {
    const result = await runCobol('validate', ['40.00', '50.00', 'X', 'EMP-001']);
    const parsed = parseValidateOutput(result.stdout);
    expect(parsed.isValid).toBe(false);
    expect(parsed.errorCode).toBe(3);
  });
});
