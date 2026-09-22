#!/usr/bin/env bash
# One-command cloud deploy: run this on the target Docker host (VM/droplet).
# Builds and runs backend + frontend via docker compose using production config.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env.prod ]; then
  echo "Missing infra/.env.prod" >&2
  echo "Copy .env.prod.example to .env.prod and fill in real values first." >&2
  exit 1
fi

docker compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  --env-file .env.prod \
  up -d --build

echo ""
echo "Frontend: http://<server-ip>"
echo "Backend:  http://<server-ip>:4000/api/health"
