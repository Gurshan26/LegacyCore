# LegacyCore — COBOL Payroll Engine

> 1959 meets 2025. The same language processing your bank transfer, now with a Next.js dashboard.

LegacyCore is a payroll processing system where core financial logic (tax, overtime, superannuation, leave accrual) is written in real COBOL. COBOL binaries are executed from Node.js API routes and results are surfaced in a modern dashboard.

## Build COBOL artifacts

Linux deployment binaries and shared libs (for Vercel):

```bash
npm run build:cobol
```

This writes:
- `cobol/bin/linux-x64/*` (executables)
- `cobol/lib/linux-x64/*` (vendored shared libs like `libcob.so.4`)

Local host binaries (for macOS/Linux local execution):

```bash
npm run build:cobol:local
```

On macOS, install GnuCOBOL first:

```bash
brew install gnu-cobol
```

## Run locally

```bash
npm install
npm run build:cobol:local
npm run dev
```

Open `http://localhost:3000`.

## Test

```bash
npm test
```

Binary integration tests auto-skip when runnable platform binaries are unavailable.
