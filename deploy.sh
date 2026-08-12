#!/usr/bin/env bash
#
# weblaud-site deploy. Run from the site directory on the server:
#
#   cd /var/www/weblaud-site && ./deploy.sh
#
# This is the script .github/workflows/deploy.yml invokes over SSH, so it must
# stay executable and committed. It lives at the repo root (not scripts/)
# because that workflow calls `./deploy.sh` by that exact path.
#
# Two things here are load-bearing and easy to "clean up" into an outage:
#
#  1. .env is checked BEFORE the build, not after. VITE_* variables are inlined
#     into the client bundle at build time, so building without .env produces a
#     bundle that is permanently missing them — no runtime error, just a
#     silently dead Web3Forms notification until someone rebuilds.
#
#  2. .env is exported into this shell before `pm2 startOrReload`. Nothing loads
#     .env at runtime: there is no dotenv dependency and react-router-serve does
#     not read .env files. PM2 hands its own environment to the child process,
#     so exporting here is what actually delivers SESSION_SECRET and
#     API_BASE_URL to the server. Drop the export (or the --update-env flag) and
#     the app boots straight into "SESSION_SECRET environment variable must be
#     set" and crash-loops.
#
set -euo pipefail

SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SITE_DIR"

echo "==> site: $SITE_DIR"

if [ ! -f "$SITE_DIR/.env" ]; then
  echo "ERROR: $SITE_DIR/.env is missing. Copy .env.example and fill it in." >&2
  exit 1
fi

# Fail loudly now rather than crash-looping under PM2 later.
if ! grep -qE '^SESSION_SECRET=.+' "$SITE_DIR/.env"; then
  echo "ERROR: SESSION_SECRET is unset or empty in .env — the server cannot boot." >&2
  echo "       Generate one: node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\"" >&2
  exit 1
fi

# 1. Fetch the new code. The GitHub Action only opens an SSH session; it does
#    not copy files, so this is where the deploy actually picks up the commit.
echo "==> [1/5] Pulling main"
git fetch --prune origin
git reset --hard origin/main

# 2. Install exactly what the lockfile pins.
#    NOTE: this repo tracks both package-lock.json and bun.lock. npm reads only
#    the former; the two can drift and produce different dependency trees than
#    were tested. Delete whichever one you are not deploying with.
echo "==> [2/5] Installing dependencies"
npm ci

# 3. Build. Requires Node ^20.19.0 || >=22.12.0 (Vite 7). The workflow sources
#    nvm without an explicit `nvm use`, so this runs on whatever the default
#    alias points at — verify with `node -v` if the build fails oddly.
echo "==> [3/5] Building"
set -a
# shellcheck disable=SC1091
. "$SITE_DIR/.env"
set +a
npm run build

test -f "$SITE_DIR/build/server/index.js" || {
  echo "ERROR: build produced no build/server/index.js" >&2
  exit 1
}
test -d "$SITE_DIR/build/client" || {
  echo "ERROR: build produced no client assets" >&2
  exit 1
}

# 4. ecosystem.config.cjs writes to ./logs/*.log relative to cwd. PM2 creates
#    the log files but not a missing parent directory.
echo "==> [4/5] Ensuring log directory"
mkdir -p "$SITE_DIR/logs"

# 5. Restart. The .cjs extension is required: package.json sets "type":"module",
#    so a .js config is parsed as ESM, its `module.exports` assigns nothing, and
#    PM2 loads a config with no `apps` at all — silently, which is how this
#    stayed broken. Verify with:
#      node -e "console.log(require('./ecosystem.config.cjs').apps[0].name)"
#
#    --update-env is belt-and-braces now that the config reads .env itself; it
#    still matters for anything set in this shell but not in the file.
echo "==> [5/5] Reloading PM2 process"
pm2 startOrReload "$SITE_DIR/ecosystem.config.cjs" --update-env
pm2 save

echo "==> Done. Verify: curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/"
