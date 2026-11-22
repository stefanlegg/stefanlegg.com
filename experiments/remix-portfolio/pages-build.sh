#!/bin/sh
set -eu

# Cloudflare's existing Git integration publishes the root dist directory.
if [ "${CF_PAGES_BRANCH:-}" != "explore/portfolio-solar-system" ]; then
  exec npx astro build
fi

# Retire this preview while keeping shared project and article URLs useful.
target=https://explore-remix-portfolio.stefanlegg-com.pages.dev
mkdir -p dist
cat > dist/_redirects <<EOF
/work/orbit/* ${target}/#work-title 302
/work/ ${target}/#work-title 302
/work ${target}/#work-title 302
/work/* ${target}/work/:splat 302
/posts/orbit/* ${target}/posts/ 302
/posts/* ${target}/posts/:splat 302
/bookmarks/orbit/* ${target}/bookmarks/ 302
/bookmarks/* ${target}/bookmarks/:splat 302
/* ${target}/ 302
EOF
cat > dist/index.html <<EOF
<!doctype html><html lang="en"><meta charset="utf-8"><title>Portfolio preview</title><a href="${target}/">Open the current portfolio preview</a></html>
EOF
