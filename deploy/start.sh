#!/bin/bash
# Launched by launchd. Loads secrets from ~/Services/portfolio/.env (not in git), runs the current release.
set -a
[ -f "$HOME/Services/portfolio/.env" ] && . "$HOME/Services/portfolio/.env"
set +a
export PORT=3200 HOSTNAME=127.0.0.1 NODE_ENV=production
cd "$HOME/Services/portfolio/current"
exec /opt/homebrew/bin/node server.js
