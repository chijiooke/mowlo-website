#!/usr/bin/env bash
# Shoots product shots of our own merch from /dev/studio, for the business
# carousel. Needs the dev server on :3000.
#
#   scripts/studio/shoot.sh <out-dir> [item ...]      e.g. scripts/studio/shoot.sh /tmp/studio cap mugs
#   query overrides: scripts/studio/shoot.sh /tmp/studio "cap&angle=40&distance=6"
#
# Headless Chrome writes the screenshot but never exits on a page with a
# running WebGL loop, so each shot is killed as soon as its PNG is written.
set -euo pipefail

OUT=${1:?usage: shoot.sh <out-dir> [item ...]}
shift
mkdir -p "$OUT"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ $# -eq 0 ] && set -- tee cap bottle mugs cards stickers bag socks

for view in "$@"; do
  name=${view%%&*}
  png="$OUT/$name.png"
  rm -f "$png"
  "$CHROME" --headless=new --use-angle=metal --ignore-gpu-blocklist --hide-scrollbars --no-first-run \
    --window-size=1000,1000 --virtual-time-budget=25000 \
    --user-data-dir="$OUT/.profile-$name" --screenshot="$png" \
    "http://localhost:3000/dev/studio?item=$view" >/dev/null 2>&1 &
  pid=$!
  for _ in $(seq 1 180); do
    [ -s "$png" ] && break
    sleep 0.5
  done
  sleep 1
  kill "$pid" 2>/dev/null || true
  pkill -f -- "--user-data-dir=$OUT/.profile-$name" 2>/dev/null || true
  if [ -s "$png" ]; then echo "$name  $(du -h "$png" | cut -f1)"; else echo "$name  FAILED"; fi
done
