#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${MBN_SMOKE_URL:-http://127.0.0.1:5174}"
OUT="${MBN_SCREENSHOT_DIR:-artifacts/visual-smoke}"
BROWSER="${CHROME_BIN:-}"
if [[ -z "$BROWSER" ]]; then
  for candidate in chromium chromium-browser google-chrome google-chrome-stable; do
    if command -v "$candidate" >/dev/null 2>&1; then BROWSER="$(command -v "$candidate")"; break; fi
  done
fi
[[ -n "$BROWSER" ]] || { echo "Không tìm thấy Chromium/Chrome." >&2; exit 2; }
mkdir -p "$OUT"
curl -fsS "$BASE_URL" >/dev/null
routes=("home:/" "catalog:/ninja-school" "detail:/ninja-school/1" "profile:/account/profile")
viewports=("390,844:mobile" "768,1024:tablet" "1440,1000:desktop")
for routeSpec in "${routes[@]}"; do
  name="${routeSpec%%:*}"; route="${routeSpec#*:}"
  for vpSpec in "${viewports[@]}"; do
    size="${vpSpec%%:*}"; label="${vpSpec#*:}"
    "$BROWSER" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --hide-scrollbars --window-size="$size" --virtual-time-budget=3000 --screenshot="$OUT/${name}-${label}.png" "$BASE_URL$route" >/dev/null 2>&1
  done
done
echo "Visual smoke written to $OUT"
