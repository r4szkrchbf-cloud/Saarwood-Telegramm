#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/saarwood_telepromter}"
cd "$APP_DIR"

printf 'Updating Saarwood Teleprompter in %s\n' "$APP_DIR"

git fetch --all --prune
git checkout main
git pull --ff-only origin main

npm ci
npm run build --workspace @saarwood/frontend
npm run build --workspace @saarwood/backend

if command -v pm2 >/dev/null 2>&1; then
  pm2 restart saarwood-teleprompter
  pm2 save
  printf 'Update complete via pm2 restart.\n'
elif command -v systemctl >/dev/null 2>&1; then
  sudo systemctl restart saarwood-teleprompter
  printf 'Update complete via systemd restart.\n'
else
  printf 'Update built, but no process manager restart command found.\n'
fi
