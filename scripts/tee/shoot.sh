#!/usr/bin/env bash
# Renders /dev/tee headlessly from several angles, for tuning the tee model.
#
#   scripts/tee/shoot.sh <out-dir> [name=query ...]
#   scripts/tee/shoot.sh /tmp/tee three-quarter="angle=25&tilt=6" front="angle=0"
#
# With no views given, shoots the standard five. Needs the dev server on :3000.
#
# Headless Chrome writes the screenshot but never exits on a page with a
# running WebGL loop, so each shot is killed as soon as its PNG is written.
set -euo pipefail

OUT=${1:?usage: shoot.sh <out-dir> [name=query ...]}
shift
mkdir -p "$OUT"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [ $# -eq 0 ]; then
  set -- \
    three-quarter="angle=28&tilt=4&bg=grey" \
    front="angle=0&tilt=2&bg=grey" \
    side="angle=80&tilt=4&bg=grey" \
    neck="angle=15&tilt=34&y=1.2&distance=6&bg=grey" \
    chest="angle=8&tilt=2&distance=3&y=0.5&fov=30&bg=grey" \
    dark="angle=20&tilt=6" \
    wind="angle=20&tilt=6&wind=0.28,0.12,-0.2"
fi

for view in "$@"; do
  name=${view%%=*}
  query=${view#*=}
  png="$OUT/$name.png"
  rm -f "$png"
  "$CHROME" --headless=new --use-angle=metal --ignore-gpu-blocklist --hide-scrollbars --no-first-run \
    --window-size=1100,1100 --virtual-time-budget=25000 \
    --user-data-dir="$OUT/.profile-$name" --screenshot="$png" \
    "http://localhost:3000/${PAGE:-dev/tee}?$query" >/dev/null 2>&1 &
  pid=$!
  # Up to 90s for the PNG to appear, then a moment for the write to finish.
  for _ in $(seq 1 180); do
    [ -s "$png" ] && break
    sleep 0.5
  done
  sleep 1
  kill "$pid" 2>/dev/null || true
  pkill -f -- "--user-data-dir=$OUT/.profile-$name" 2>/dev/null || true
  if [ -s "$png" ]; then echo "$name  $(du -h "$png" | cut -f1)  $png"; else echo "$name  FAILED"; fi
done
