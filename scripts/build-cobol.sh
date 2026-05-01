#!/usr/bin/env bash
# =============================================================
# LegacyCore COBOL Build Script (Linux target for deployment)
# Compiles COBOL programs to Linux x86-64 binaries in cobol/bin/linux-x64
# Also vendors required shared libraries in cobol/lib/linux-x64
# =============================================================

set -euo pipefail

COBOL_DIR="$(cd "$(dirname "$0")/../cobol" && pwd)"
BIN_DIR="$COBOL_DIR/bin/linux-x64"
LIB_DIR="$COBOL_DIR/lib/linux-x64"

echo "LegacyCore COBOL Compiler (Linux x86-64 target)"
echo "================================================"
echo "Source: $COBOL_DIR"
echo "Binaries: $BIN_DIR"
echo "Libraries: $LIB_DIR"
echo ""

mkdir -p "$BIN_DIR" "$LIB_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: Docker is required for Linux x86-64 cross-compilation."
  echo "Install/start Docker Desktop, then re-run: npm run build:cobol"
  exit 1
fi

echo "Using Docker for Linux x86-64 cross-compilation..."
echo ""

docker run --rm \
  -v "$COBOL_DIR":/cobol \
  --platform linux/amd64 \
  ubuntu:22.04 \
  bash -lc '
    set -euo pipefail

    apt-get update -qq >/dev/null 2>&1
    apt-get install -y gnucobol >/dev/null 2>&1

    for PROG in tax overtime leave validate payroll; do
      echo -n "Compiling ${PROG}.cbl ... "
      cobc -x -free "/cobol/${PROG}.cbl" -o "/cobol/bin/linux-x64/${PROG}"
      echo "OK"
    done

    # Vendor runtime shared libs required by compiled binaries.
    # Keep glibc / loader from the host runtime; bundle non-core libs.
    ldd /cobol/bin/linux-x64/tax \
      | while read -r _ ARROW LIB _; do
          [ "$ARROW" = "=>" ] || continue
          [ -n "$LIB" ] || continue

          BASE="$(basename "$LIB")"
          case "$BASE" in
            libc.so.*|libm.so.*|ld-linux*.so.*) continue ;;
          esac

          cp -Lv "$LIB" "/cobol/lib/linux-x64/$BASE" >/dev/null 2>&1 || true
        done
  '

echo ""
echo "Compiled Linux binaries:"
ls -lh "$BIN_DIR/"
echo ""
echo "Vendored Linux shared libraries:"
ls -lh "$LIB_DIR/"
echo ""
echo "Done."
echo ""
echo "Optional for local macOS execution:"
echo "  npm run build:cobol:local"
echo ""
echo "Commit for deployment:"
echo "  git add cobol/bin/linux-x64/ cobol/lib/linux-x64/"
echo "  git commit -m 'chore: compile COBOL linux binaries and runtime libs'"
