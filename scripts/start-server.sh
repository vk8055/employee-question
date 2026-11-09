#!/usr/bin/env bash
set -euo pipefail

# --------------- env ---------------
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

# --------------- back-end ---------------
cd "$ROOT_DIR/server"
mvn spring-boot:run