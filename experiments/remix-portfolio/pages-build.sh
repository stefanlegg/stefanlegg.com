#!/bin/sh
set -eu

# Cloudflare's existing Git integration publishes the root dist directory.
if [ "${CF_PAGES_BRANCH:-}" != "explore/remix-portfolio" ]; then
  exec npx astro build
fi

cd experiments/remix-portfolio
npm ci --no-audit --no-fund
npm run build
rm -rf ../../dist
cp -R dist ../../dist
