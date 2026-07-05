#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://beta.example.com/apps/teleprompter}"
ADMIN_API_KEY="${ADMIN_API_KEY:-}"

printf 'Smoke test base URL: %s\n' "$BASE_URL"

curl -fsS "$BASE_URL/api/health" >/dev/null
printf 'OK  /api/health\n'

curl -fsS "$BASE_URL/api/support/info" >/dev/null
printf 'OK  /api/support/info\n'

if [[ -n "$ADMIN_API_KEY" ]]; then
  curl -fsS "$BASE_URL/api/admin/license/revocations" -H "x-admin-api-key: $ADMIN_API_KEY" >/dev/null
  printf 'OK  /api/admin/license/revocations\n'
else
  printf 'SKIP admin endpoint test (ADMIN_API_KEY not provided)\n'
fi

printf 'Smoke tests passed.\n'
