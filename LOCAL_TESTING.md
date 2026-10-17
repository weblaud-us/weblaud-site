# Testing Phase 2 on your own computer, then going live

This guide has three parts:

1. **What Sentry, a DSN and an uptime monitor are.** Plain-language explanations.
2. **Testing everything locally.** It's safe: nothing touches the live database, and no real emails are sent.
3. **Going live.** The accounts to create and the settings to add once local testing passes.

---

## Part 1 — The three new terms

### Sentry (error monitoring)

[Sentry](https://sentry.io) is a service that records an error whenever the website or the API breaks, for example a page that crashes or a payment request that fails. You get an email about it, with enough technical detail to fix it. Without Sentry, you only find out when a client complains.

- The free "Developer" plan is enough to start (5,000 errors a month).
- The code is already in place and stays **switched off** until you add a DSN (see below).
- Before anything is sent to Sentry, the code strips personal data: form contents, cookies, link tokens, and names, emails and IP addresses.

### DSN

A DSN is the address Sentry gives you for one project. It looks like this:

```
https://3f8a1b...@o4508....ingest.us.sentry.io/4508...
```

Putting it in a `.env` file switches error reporting on. It isn't a password, because it only allows *sending* errors to Sentry, but keep it in `.env` and out of the code.

You will need **two** DSNs, one per Sentry project:

| Sentry project | Platform to pick in Sentry | Where the DSN goes |
|---|---|---|
| `weblaud-site` | React Router | `weblaud-site/.env` → `SENTRY_DSN=` |
| `weblaud-backend` | NestJS | `backend/.env` → `SENTRY_DSN=` (for local testing: `backend/.env.local`) |

### Uptime monitor

An uptime monitor is a separate service that visits your site every few minutes and emails you if it stops responding. It catches the cases Sentry can't: the server is down, the domain expired, or Cloudflare is having problems.

It only works on public URLs, so there's nothing to test locally. You'll set it up in Part 3, and it takes about 5 minutes.

---

## Part 2 — Test locally (safe)

Your normal `backend/.env` points at the **live** database, the real Gmail account and Cloudinary. The local setup never reads that file:

- The backend uses `backend/.env.local`, which points at a throwaway database running on your computer.
- Every email goes to a fake inbox (Mailpit) instead of being delivered.
- The `pnpm …:local` commands refuse to run if `.env.local` ever points at a database that isn't on your computer.

### One-time setup

1. **Install and start Docker Desktop** ([docker.com](https://www.docker.com/products/docker-desktop/)). It's already installed on this machine. Just open it and wait until it says "Engine running".
2. **`backend/.env.local`** already exists, with local-only values and freshly generated secrets. Don't copy production values into it. It's gitignored.

### Every time you test

Open three PowerShell windows.

**Window 1: start the test database and the fake mailbox, then the backend**

```powershell
cd E:\WebLaud\Products\weblaud\backend
pnpm local:up        # starts MongoDB (port 27018) and Mailpit in Docker
pnpm seed:local      # fills the test database with demo accounts and a demo project (safe to re-run; it resets them)
pnpm start:local     # the API, at http://127.0.0.1:4000
```

**Window 2: the website**

```powershell
cd E:\WebLaud\Products\weblaud\weblaud-site
npm run dev          # http://localhost:5173
```

**Window 3: the fake inbox**

Open **http://localhost:8025** in your browser. Every email the system sends shows up here.

### Demo accounts (password for all: `Demo1234!`)

| Log in at | Email | Who they are |
|---|---|---|
| http://localhost:5173/portal/login | `client@demo.weblaud.local` | Client **admin** at Acme (can approve, pay, invite) |
| same | `viewer@demo.weblaud.local` | Client **viewer** at Acme (read-only) |
| same | `client2@demo.weblaud.local` | Client admin at a different company (Globex) |
| same | `pm@demo.weblaud.local` | Project manager (staff) on both projects |
| http://localhost:5173/cpadmin/login | `admin@demo.weblaud.local` | Agency admin |

### What to check

Use a phone, or Chrome DevTools' device mode (F12 → phone icon) set to 360 px wide.

**2.1 "Needs your input" inbox.** Log in as `client@…`.

- [ ] The dashboard shows "Needs your input" with 4 items: a contract to sign, an approval, a quote to decide, and an invoice to pay. Clicking one takes you straight to it.
- [ ] "Projects" in the menu shows a count.

**2.2 Six tabs.** Open "Acme Website Revamp".

- [ ] Six tabs in two rows, with no sideways scrolling. Decisions and Billing show badges.
- [ ] Open an old-style link, for example `http://localhost:5173/portal/projects/<the id in your address bar>/approvals`. It should move you to Decisions → Approvals.

**2.3 Overview.**

- [ ] You see: needs your input, latest update, recent activity, next milestone (with "Late" if it's overdue), budget (contract value / invoiced / paid / remaining) and the team.
- [ ] Approve "Homepage design v2" under Decisions → Approvals. The Decisions badge goes down by one, and the approval appears in Recent activity.
- [ ] Log in as `pm@…` and post an update with "Progress estimate %" set to a low number, like 5. The project's overall progress bar must **not** change.

**2.4 Weekly digest.** It normally sends Mondays at 08:00 UTC. To send it now, in a new PowerShell window:

```powershell
cd E:\WebLaud\Products\weblaud\backend
pnpm digest:local -- --force    # --force forgets that it already ran this week
```

- [ ] Two emails, "Your week on Acme Website Revamp", appear at http://localhost:8025 (one for the client admin, one for the viewer).
- [ ] Run it again **without** `--force`. It says "Sent 0", because it never sends twice in one week.
- [ ] The unsubscribe link at the bottom of the email turns off weekly summaries. You can see the setting in the portal → your name (top right) → Settings.

**2.5 Team.** As `client@…`, open **Team** in the menu.

- [ ] Invite someone with a made-up address. The invite email appears in Mailpit. Open its link to accept the invite and set a password.
- [ ] Change someone's role, then remove their access. Try to remove the last admin: it's refused.
- [ ] As `viewer@…`, "Team" isn't in the menu.

**2.6 Sentry.** Optional locally; do it once you have the DSNs from Part 3.

1. Put the **site** DSN in `weblaud-site/.env` as `SENTRY_DSN=...` and the **backend** DSN in `backend/.env.local` as `SENTRY_DSN=...`.
2. Restart both (Ctrl+C, then `pnpm start:local` / `npm run dev`).
3. Log in at http://localhost:5173/cpadmin/login as `admin@demo.weblaud.local`, then open **http://localhost:5173/cpadmin/sentry-test**.
4. Click **Send backend test error**, then **Send website test error**.
5. Within a minute, both errors appear in Sentry → Issues. Open one and check there's no email address, cookie or password in it.

**2.7 Cookie banner.** It only appears for visitors from the EU, the UK and Switzerland. Locally, stop the website (Ctrl+C) and start it pretending to be in Germany:

```powershell
$env:DEV_COUNTRY="DE"; npm run dev
```

- [ ] The home page shows the "Cookies and analytics" banner. Decline and Accept both close it, and "Cookie settings" in the footer reopens it.
- [ ] To return to normal: `Remove-Item Env:DEV_COUNTRY`, then `npm run dev` again.

### When you're done

```powershell
cd E:\WebLaud\Products\weblaud\backend
pnpm local:down          # stops the containers; the test data is kept
# docker compose -f docker-compose.local.yml down -v    # ← also wipes the test data
```

Things you can't test locally:

- **Paying an invoice**, because Stripe isn't connected locally.
- **The uptime monitor**, because it needs a public URL.
- **The real cookie banner by country**, because the country comes from Cloudflare. `DEV_COUNTRY` imitates it.

---

## Part 3 — Going live (after local testing passes)

### A. Create Sentry and get the two DSNs (about 10 minutes)

1. Go to https://sentry.io/signup and create a free account. Name the organization "Weblaud".
2. **Projects → Create Project → React Router.** Name it `weblaud-site`, keep "Alert me on every new issue", and click Create.
3. Copy the DSN it shows. You can find it again later under **Settings → Projects → weblaud-site → Client Keys (DSN)**.
4. Repeat with **NestJS**, named `weblaud-backend`, and copy that DSN too.
5. Skip the wizard's "install the SDK" steps; that's already done in the code.
6. Optional: under **Settings → Security & Privacy**, keep "Data Scrubber" on (it's on by default). It adds a second layer of filtering on top of ours.

### B. Put the DSNs on the server (when you deploy)

On the server, **after** the Phase 0 deploy:

```bash
# /var/www/weblaud-backend/.env
SENTRY_DSN=https://...your weblaud-backend DSN...
SENTRY_ENVIRONMENT=production

# /var/www/weblaud-site/.env
SENTRY_DSN=https://...your weblaud-site DSN...
SENTRY_ENVIRONMENT=production
```

Restart both apps. For the site: `pm2 startOrReload ecosystem.config.cjs --update-env`. Then, on the live site, log in to `/cpadmin`, open **`https://weblaud.com/cpadmin/sentry-test`**, send both test errors, and check they arrive in Sentry.

### C. Uptime monitor (about 5 minutes, free)

UptimeRobot's free plan is enough: 50 monitors, checked every 5 minutes, with email alerts.

1. Sign up at https://uptimerobot.com.
2. **+ New monitor → HTTP(s)**:
   - URL: `https://weblaud.com/`
   - Friendly name: `Weblaud website`
   - Interval: 5 minutes
   - Alert: your email
3. Add a second monitor with URL `https://api.weblaud.com/api/v1/faqs` and name `Weblaud API`.
4. Both should turn green within a few minutes.
5. Optional: add your phone in the UptimeRobot app for push alerts.

Better Stack (betterstack.com) is a good alternative if you'd rather; the settings are the same.

### D. The rest of going live (from ROADMAP.md)

1. Phase 0: merge `origin/main`, push both repos, deploy the **backend first**, then the site.
2. Do the phone walkthrough from Part 2 on the live site with a real client account.
3. On the first Monday after deploy, check that the weekly summary arrived in a real inbox.
4. Keep Cloudflare from caching HTML pages. The cookie banner depends on the visitor's country.
