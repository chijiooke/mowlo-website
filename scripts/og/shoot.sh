#!/usr/bin/env bash
# Shoots the share images from /dev/og into public/. Needs the dev server on :3000.
#
#   scripts/og/shoot.sh
#
# Rendered with reduced motion so every entrance is already settled, then
# re-encoded as JPEG (social sites cap image size, and photos compress well).
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for pair in "creators:og-image" "artists:og-artists"; do
  v=${pair%%:*}
  out=${pair##*:}
  curl -s -o /dev/null "http://localhost:3000/dev/og?v=$v"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion \
    --window-size=1200,630 --virtual-time-budget=8000 --user-data-dir="$TMP/profile-$v" \
    --screenshot="$TMP/$v.png" "http://localhost:3000/dev/og?v=$v" >/dev/null 2>&1 &
  pid=$!
  for _ in $(seq 1 80); do [ -s "$TMP/$v.png" ] && break; sleep 0.5; done
  sleep 1
  kill "$pid" 2>/dev/null || true
  (cd "$ROOT" && node -e "require('sharp')(process.argv[1]).jpeg({ quality: 88, mozjpeg: true }).toFile(process.argv[2]).then(i => console.log(process.argv[2], i.width + 'x' + i.height, i.size + ' bytes'))" "$TMP/$v.png" "public/$out.jpg")
done
