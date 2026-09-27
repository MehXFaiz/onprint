#!/bin/sh
# Run this in the GoDaddy app root (cPanel Terminal).
# Discards server-only build files, pulls GitHub main, reinstalls, rebuilds.
set -e
git checkout -- dist/index.html 2>/dev/null || true
git fetch origin
git reset --hard origin/main
npm install
npm run build
echo "ONPRINT update complete."
