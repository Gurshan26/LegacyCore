#!/usr/bin/env bash
# =============================================================
# LegacyCore COBOL Build Script (Linux target for deployment)
# Compiles COBOL programs to Linux x86-64 binaries in cobol/bin/linux-x64
# =============================================================

set -euo pipefail

COBOL_DIR="$(cd "$(dirname "$0")/../cobol" && pwd)"
BIN_ROOT="$COBOL_DIR/bin"
LINUX_BIN_DIR="$BIN_ROOT/linux-x64"

PROGRAMS=("tax" "overtime" "leave" "validate" "payroll")

echo "LegacyCore COBOL Compiler (Linux x86-64 target)"
echo "================================================"
echo "Source: $COBOL_DIR"
echo "Output: $LINUX_BIN_DIR"
echo ""

mkdir -p "$LINUX_BIN_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: Docker is required for Linux x86-64 cross-compilation."
  echo ""
  echo "Install/start Docker Desktop, then re-run: npm run build:cobol"
  exit 1
fi

echo "Using Docker for Linux x86-64 cross-compilation..."
echo ""

for PROG in "${PROGRAMS[@]}"; do
  echo -n "Compiling $PROG.cbl ... "
  docker run --rm \
    -v "$COBOL_DIR":/cobol \
    --platform linux/amd64 \
    ubuntu:22.04 \
    bash -lc "
      apt-get update -qq >/dev/null 2>&1
      apt-get install -y gnucobol >/dev/null 2>&1
      cobc -x -free /cobol/${PROG}.cbl -o /cobol/bin/linux-x64/${PROG}
    "
  echo "OK"
done

echo ""
echo "Compiled Linux binaries:"
ls -lh "$LINUX_BIN_DIR/"
echo ""
echo "Done."
echo ""
echo "Optional for local macOS execution:"
echo "  npm run build:cobol:local"
echo ""
echo "Commit Linux binaries for Vercel deployment:"
echo "  git add cobol/bin/linux-x64/"
echo "  git commit -m 'chore: compile COBOL linux binaries for deployment'"
