#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${MBN_SMOKE_URL:-http://127.0.0.1:5174}"
BROWSER="${CHROME_BIN:-}"
if [[ -z "$BROWSER" ]]; then
  for candidate in chromium chromium-browser google-chrome google-chrome-stable; do
    if command -v "$candidate" >/dev/null 2>&1; then BROWSER="$(command -v "$candidate")"; break; fi
  done
fi
[[ -n "$BROWSER" ]] || { echo "Không tìm thấy Chromium/Chrome. Thiết lập CHROME_BIN." >&2; exit 2; }
curl -fsS "$BASE_URL" >/dev/null
routes=("/" "/ninja-school" "/avatar" "/ngoc-rong" "/topics" "/account/profile")
for route in "${routes[@]}"; do
  echo "Smoke $route"
  "$BROWSER" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --virtual-time-budget=2500 --dump-dom "$BASE_URL$route" >/tmp/mbn-smoke.html
  grep -q '<div id="root"' /tmp/mbn-smoke.html || { echo "Route $route không render root" >&2; exit 1; }
done
echo "Browser smoke PASS"
