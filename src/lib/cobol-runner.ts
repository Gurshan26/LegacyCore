import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const BIN_DIR = path.join(process.cwd(), 'cobol', 'bin');

export interface CobolResult {
  stdout: string;
  stderr: string;
  executionTimeMs: number;
}

export async function runCobol(
  program: string,
  args: (string | number)[],
  timeoutMs = 5000
): Promise<CobolResult> {
  const binaryPath = resolveBinaryPath(program);
  const argString = args.join(',');
  const started = Date.now();

  try {
    const { stdout, stderr } = await execFileAsync(binaryPath, [argString], {
      timeout: timeoutMs,
    });

    return {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      executionTimeMs: Date.now() - started,
    };
  } catch (error: any) {
    if (error?.killed) {
      throw new Error(`COBOL program '${program}' timed out after ${timeoutMs}ms`);
    }

    if (error?.code === 'ENOEXEC') {
      throw new Error(
        `COBOL binary '${program}' exists but is not executable on ${platformKey()}. ` +
          `Build local binaries with: npm run build:cobol:local`
      );
    }

    if (error?.code === 'ENOENT') {
      throw new Error(buildMissingBinaryMessage(program));
    }

    throw new Error(`COBOL execution failed: ${error?.message || 'unknown error'}`);
  }
}

function resolveBinaryPath(program: string): string {
  const key = platformKey();
  const platformPath = path.join(BIN_DIR, key, program);

  if (fs.existsSync(platformPath)) {
    return platformPath;
  }

  // Backward compatibility: existing repos may still have linux binaries at cobol/bin/<program>
  if (process.platform === 'linux' && process.arch === 'x64') {
    const legacyLinuxPath = path.join(BIN_DIR, program);
    if (fs.existsSync(legacyLinuxPath)) {
      return legacyLinuxPath;
    }
  }

  throw Object.assign(new Error(buildMissingBinaryMessage(program)), { code: 'ENOENT' });
}

function buildMissingBinaryMessage(program: string): string {
  const key = platformKey();
  const targetPath = path.join(BIN_DIR, key, program);

  if (process.platform === 'linux' && process.arch === 'x64') {
    return (
      `COBOL binary '${program}' not found at ${targetPath}. ` +
      `Run: npm run build:cobol`
    );
  }

  return (
    `COBOL binary '${program}' not found for ${key} at ${targetPath}. ` +
    `Run: npm run build:cobol:local (requires 'brew install gnu-cobol' on macOS).`
  );
}

function platformKey(): string {
  return `${process.platform}-${process.arch}`;
}

export function parseTaxOutput(stdout: string) {
  const parts = stdout.split(',').map((s) => Number.parseFloat(s.trim()));
  if (parts.length < 5 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid tax output: "${stdout}"`);
  }
  return {
    taxAnnual: parts[0],
    taxPeriod: parts[1],
    medicareAnnual: parts[2],
    medicarePeriod: parts[3],
    effectiveRate: parts[4],
  };
}

export function parseOvertimeOutput(stdout: string) {
  const parts = stdout.split(',').map((s) => Number.parseFloat(s.trim()));
  if (parts.length < 4 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid overtime output: "${stdout}"`);
  }
  return {
    basePay: parts[0],
    overtimePay: parts[1],
    overtimeHours: parts[2],
    totalPay: parts[3],
  };
}

export function parseLeaveOutput(stdout: string) {
  const parts = stdout.split(',').map((s) => Number.parseFloat(s.trim()));
  if (parts.length < 4 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid leave output: "${stdout}"`);
  }
  return {
    alAccrued: parts[0],
    slAccrued: parts[1],
    alNewBalance: parts[2],
    slNewBalance: parts[3],
  };
}

export function parseValidateOutput(stdout: string) {
  const firstComma = stdout.indexOf(',');
  const secondComma = stdout.indexOf(',', firstComma + 1);

  if (firstComma === -1 || secondComma === -1) {
    throw new Error(`Invalid validate output: "${stdout}"`);
  }

  const validFlag = stdout.slice(0, firstComma).trim();
  const errorCode = Number.parseInt(stdout.slice(firstComma + 1, secondComma).trim(), 10);
  const errorMessage = stdout.slice(secondComma + 1).trim();

  return {
    isValid: validFlag === 'Y',
    errorCode: Number.isNaN(errorCode) ? -1 : errorCode,
    errorMessage,
  };
}

export function parsePayrollOutput(stdout: string) {
  const parts = stdout.split(',').map((part) => part.trim());
  if (parts.length < 7) {
    throw new Error(`Invalid payroll output: "${stdout}"`);
  }

  const numeric = parts.slice(1).map((p) => Number.parseFloat(p));
  if (numeric.some(Number.isNaN)) {
    throw new Error(`Invalid payroll output: "${stdout}"`);
  }

  return {
    empId: parts[0],
    grossPay: numeric[0],
    taxWithheld: numeric[1],
    medicareLevy: numeric[2],
    superAmount: numeric[3],
    netPay: numeric[4],
    ytdGross: numeric[5],
  };
}
