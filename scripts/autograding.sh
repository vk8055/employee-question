#!/usr/bin/env bash

# --------------- env ---------------
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

# --------------- tests ---------------
cd "$ROOT_DIR/server"
/usr/share/maven/bin/mvn test

cd "$ROOT_DIR/app"
/opt/hh/node-runtime/bin/npm install
/opt/hh/node-runtime/bin/npm run test
