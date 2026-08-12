# weblaud-site deployment

React Router v7 in SSR mode, served by `react-router-serve` under PM2 behind
nginx, on the same VPS as `weblaud-backend`.

```
/var/www/
├── weblaud-site/        ← this repo        → PM2 "weblaud-site"   :3000
└── weblaud-backend/     ← the API         → PM2 "weblaund-backend" :4000
```

## The one thing that breaks every first deploy

**Nothing loads `.env` at runtime.** There is no `dotenv` dependency, and
`react-router-serve` does not read `.env` files — Vite only injects them during
`dev` and `build`. So `process.env.SESSION_SECRET` is undefined in production
unless the *process environment* carries it.

That matters more than it sounds, because `app/lib/session.server.ts` throws when
the secret is missing, and that check sits at the top level of the bundled
`build/server/index.js`. It fires on **startup**, not on the first admin request:

```
Error: SESSION_SECRET environment variable must be set
```

PM2 then restarts it, it throws again, and you get a crash loop on a server whose
`.env` file looks perfectly correct.

`deploy.sh` solves this by exporting `.env` into its own shell before
`pm2 startOrReload ... --update-env`, since PM2 passes its environment to the
child. If you start the app any other way, set the variables yourself.

## Environment

Copy `.env.example` to `.env` on the server and fill it in. `.env` is gitignored
and never deployed — it must be created on the box by hand, once.

Two kinds of variable live in there, and the difference decides *when* the value
must exist:

| Kind | Read | Missing value does |
|---|---|---|
| `VITE_*` | Inlined into the client bundle at **build** time | Nothing visible — silently absent until the next build |
| everything else | `process.env` at **runtime** | Crash on boot (`SESSION_SECRET`) or silent fallback (`API_BASE_URL`) |

Required before the first deploy:

- **`SESSION_SECRET`** — signs the admin session cookie. Generate with
  `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
  Rotating it signs out every admin.
- **`API_BASE_URL`** — must include the `/api/v1` suffix. Unset falls back to
  `http://127.0.0.1:4000/api/v1`, which is right *only* while the API is on this
  host. When it is wrong the site does not error: every `fetchOptional()` call
  serves placeholder content, so the site looks live but empty. Set it
  explicitly rather than relying on the default.
- **`NODE_ENV=production`** — gates the `Secure` flag on the admin session
  cookie. PM2 sets it via `ecosystem.config.cjs`; keep it in `.env` too so a bare
  `npm start` or `docker run` cannot ship that cookie unprotected.
- **`VITE_CONTACT_FORM_ACCESS_KEY`** — must be present *before* `npm run build`.
  The lead is already saved through the backend, so an empty key only drops the
  Web3Forms courtesy email — with no error anywhere.

## First-time server setup

```bash
# As the deployer user
sudo mkdir -p /var/www/weblaud-site && sudo chown -R deployer:deployer /var/www
cd /var/www
git clone https://github.com/weblaud-us/weblaud-site.git weblaud-site
cd weblaud-site

# Node: Vite 7 requires ^20.19.0 || >=22.12.0. The GitHub Action sources nvm
# without an explicit `nvm use`, so make the default alias satisfy that.
nvm install 20 && nvm alias default 20
node -v

cp .env.example .env
nano .env                 # fill in SESSION_SECRET, API_BASE_URL, the VITE_ key

npm install -g pm2
chmod +x deploy.sh
./deploy.sh

pm2 startup               # print the systemd command, then run what it prints
pm2 save
```

## Routine deploys

Push to `main`. `.github/workflows/deploy.yml` SSHes in and runs `./deploy.sh` —
it does not copy any files, so the script's own `git fetch` + `git reset --hard
origin/main` is what picks up the commit.

> `deploy.sh` runs `git reset --hard`. Never point it at a checkout holding work
> you have not pushed; it discards local changes without asking.

Repo secrets the workflow needs: `VPS_HOST`, `VPS_USER`, `VPS_KEY`.

Manual deploy, identical path:

```bash
cd /var/www/weblaud-site && ./deploy.sh
```

`deploy.sh` refuses to start when `.env` is missing or `SESSION_SECRET` is empty,
and fails if the build produces no `build/server/index.js` — a failed deploy
means read the output, not retry it.

## nginx

The app speaks plain HTTP on `127.0.0.1:3000` and sets no security headers of its
own, so nginx is the only place they exist. Hashed assets under `/assets/` are
already served `immutable` with a one-year max-age by the app; HTML is
`max-age=300`.

```nginx
server {
    listen 443 ssl http2;
    server_name weblaud.com www.weblaud.com;

    # certbot fills these in
    ssl_certificate     /etc/letsencrypt/live/weblaud.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/weblaud.com/privkey.pem;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name weblaud.com www.weblaud.com;
    return 301 https://$host$request_uri;
}
```

`X-Forwarded-Proto` is not decorative — `robots.txt` and `sitemap.xml` build
their absolute URLs from the request, so without it they advertise `http://`
links from an HTTPS site.

Then:

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d weblaud.com -d www.weblaud.com
```

## Verifying a deploy

```bash
pm2 status weblaud-site
pm2 logs weblaud-site --lines 50

curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/     # 200
curl -fsS https://weblaud.com/robots.txt | tail -5                    # absolute https:// sitemap URL
curl -fsS https://weblaud.com/sitemap.xml | head -20                  # includes DB-backed /projects/* etc.
curl -s -o /dev/null -w '%{http_code}\n' https://weblaud.com/nope     # 404, not 200
```

A sitemap containing only the 12 static pages means the backend was unreachable
during that request — `fetchOptional` swallowed the error and returned `[]`. Check
the API before assuming the sitemap is fine.

## Rollback

```bash
cd /var/www/weblaud-site
git reset --hard <previous-good-sha>
npm ci && npm run build
pm2 reload weblaud-site --update-env
```

## Known gaps

Not blockers, but deploy with your eyes open:

- **No `/health` route.** Uptime checks have to hit `/`, which renders the full
  homepage. The backend exposes `/api/v1/health`; the site has no equivalent.
- **`robots.txt` has no `Disallow`.** The panel lives at `/cpadmin`, which is
  unguessable enough that adding `Disallow: /cpadmin` would do more harm than
  good — robots.txt is public, so the rule would advertise the path to exactly
  the scanners it is hidden from. Both admin pages sit behind a session check
  and return a redirect to unauthenticated crawlers, so there is nothing to
  index. If you want belt-and-braces, add `<meta name="robots" content="noindex">`
  to the admin layout rather than a robots.txt entry.
- **Two lockfiles are tracked** (`package-lock.json` and `bun.lock`). `npm ci`
  reads only the first; they can drift. Delete the one you do not deploy with.
- **Canonical URLs are hardcoded to `https://weblaud.com`.** Any staging host
  emits canonicals pointing at production, so staging pages cannot be indexed or
  verified independently.
- **The `Dockerfile` is an unused second deployment path** and its final stage
  sets no `NODE_ENV`, which would ship the admin cookie without `Secure`. PM2 is
  the real path; either fix or delete the Docker one.
