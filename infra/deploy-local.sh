#!/usr/bin/env bash
# One-command local deploy: builds and runs backend + frontend via docker compose.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env.local ]; then
  echo "Missing infra/.env.local" >&2
  echo "Copy .env.local.example to .env.local and fill in real values first." >&2
  exit 1
fi

docker compose \
  -f docker-compose.yml \
  -f docker-compose.local.yml \
  --env-file .env.local \
  up -d --build

echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:4000/api/health"
