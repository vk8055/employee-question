#!/usr/bin/env bash
set -euo pipefail

# --------------- env ---------------
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

# --------------- front-end ---------------
cd "$ROOT_DIR/app"
npm run dev