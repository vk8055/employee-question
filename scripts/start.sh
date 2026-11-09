#!/usr/bin/env bash
set -euo pipefail

concurrently 'scripts/start-server.sh' 'scripts/start-app.sh' -n 'server,app'