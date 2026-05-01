#!/usr/bin/env bash
# =============================================================
# LegacyCore COBOL Build Script (Host target for local dev)
# Compiles COBOL programs for current OS/architecture
# =============================================================

set -euo pipefail

COBOL_DIR="$(cd "$(dirname "$0")/../cobol" && pwd)"
BIN_ROOT="$COBOL_DIR/bin"
PLATFORM_KEY="$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m | sed 's/x86_64/x64/' | sed 's/aarch64/arm64/')"
TARGET_DIR="$BIN_ROOT/$PLATFORM_KEY"

PROGRAMS=("tax" "overtime" "leave" "validate" "payroll")

echo "LegacyCore COBOL Compiler (Local target)"
echo "========================================"
echo "Source: $COBOL_DIR"
echo "Output: $TARGET_DIR"
echo ""

if ! command -v cobc >/dev/null 2>&1; then
  echo "ERROR: GnuCOBOL compiler (cobc) not found."
  echo ""
  echo "Install on macOS:" 
  echo "  brew install gnu-cobol"
  exit 1
fi

mkdir -p "$TARGET_DIR"

for PROG in "${PROGRAMS[@]}"; do
  echo -n "Compiling $PROG.cbl ... "
  cobc -x -free "$COBOL_DIR/${PROG}.cbl" -o "$TARGET_DIR/${PROG}"
  echo "OK"
done

echo ""
echo "Compiled local binaries:"
ls -lh "$TARGET_DIR/"
