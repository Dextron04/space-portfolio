#!/bin/bash
# Runs on mac-agent from the Actions checkout: build, publish a release, flip `current`, health-check, roll back on failure.
set -euo pipefail
export PATH=/opt/homebrew/bin:$PATH
BASE="$HOME/Services/portfolio"
LABEL=in.dextron04.portfolio
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
UID_=$(id -u)
REL="$BASE/releases/$(date +%Y%m%d-%H%M%S)-${GITHUB_SHA:0:7}"

npm ci --no-audit --no-fund
npm run build

mkdir -p "$REL/.next" "$BASE"
cp -R .next/standalone/. "$REL/"
cp -R .next/static "$REL/.next/static"
cp -R public "$REL/public"
cp deploy/start.sh "$BASE/start.sh"
cp deploy/$LABEL.plist "$PLIST"

PREV=$(readlink "$BASE/current" || true)
ln -sfn "$REL" "$BASE/current"

if launchctl print "gui/$UID_/$LABEL" >/dev/null 2>&1; then
  launchctl kickstart -k "gui/$UID_/$LABEL"
else
  launchctl bootstrap "gui/$UID_" "$PLIST"
fi

ok=""
for _ in $(seq 1 30); do
  if curl -fs -o /dev/null http://127.0.0.1:3200/; then ok=1; break; fi
  sleep 1
done

if [ -z "$ok" ]; then
  echo "health check failed" >&2
  if [ -n "$PREV" ]; then ln -sfn "$PREV" "$BASE/current"; launchctl kickstart -k "gui/$UID_/$LABEL"; echo "rolled back to $PREV" >&2; fi
  exit 1
fi

# keep the 5 newest releases
ls -1dt "$BASE"/releases/* | tail -n +6 | xargs rm -rf
echo "deployed $REL"
