import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { parseTaxOutput, runCobol } from '@/lib/cobol-runner';

const BINARY_EXISTS =
  fs.existsSync(path.join(process.cwd(), 'cobol', 'bin', 'linux-x64', 'tax')) ||
  fs.existsSync(path.join(process.cwd(), 'cobol', 'bin', 'tax'));
const CAN_RUN_BINARY = process.platform === 'linux' && process.arch === 'x64';

describe.skipIf(!(BINARY_EXISTS && CAN_RUN_BINARY))('COBOL Tax Calculator (binary tests)', () => {
  it('returns zero tax at threshold 18,200', async () => {
    const result = await runCobol('tax', ['18200.00', '26']);
    const parsed = parseTaxOutput(result.stdout);
    expect(parsed.taxAnnual).toBe(0);
  });

  it('calculates 80,000 bracket correctly', async () => {
    const result = await runCobol('tax', ['80000.00', '26']);
    const parsed = parseTaxOutput(result.stdout);
    expect(parsed.taxAnnual).toBeCloseTo(16467, 0);
  });

  it('medicare is 2 percent over threshold', async () => {
    const result = await runCobol('tax', ['80000.00', '26']);
    const parsed = parseTaxOutput(result.stdout);
    expect(parsed.medicareAnnual).toBeCloseTo(1600, 0);
  });
});

describe('parseTaxOutput', () => {
  it('throws on invalid output', () => {
    expect(() => parseTaxOutput('not,valid,output')).toThrow();
  });
});
