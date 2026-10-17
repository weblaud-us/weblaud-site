# Weblaud roadmap: winning clients and running projects

**Owner:** Weblaud engineering · **Started:** 2026-10-17 · **Covers:** `weblaud-site/` and `backend/`

This file is the single plan for the work that came out of the October 2026 audit. Work through it top to bottom.

## How to use this file

1. **One phase at a time.** Don't start a phase until the one before it is deployed and its "Done when" list is ticked. Phase 0 blocks everything else.
2. **Tick boxes as you go** (`- [x]`) and add the date next to finished phases in the status table.
3. **New ideas go to [Parking lot](#parking-lot)**, not into the current phase.
4. **Every feature follows the [Definition of done](#definition-of-done-every-feature).**
5. Sizes are rough working days for one developer who knows the codebase.

## Status at a glance

| Phase | Goal | Size | Status |
|---|---|---|---|
| [0](#phase-0--secure-and-ship-what-is-built) | Commit, merge, deploy everything already built | 1–2 days | ☐ Not started |
| [1](#phase-1--conversion-and-trust-quick-wins) | Conversion leaks, trust fixes, portal quick wins | — | ✅ Built 2026-10-17, ships with Phase 0 |
| [2](#phase-2--client-portal-usability--monitoring) | Portal that tells clients what to do; error monitoring | ~12 days | 🟡 Built 2026-10-17 (local commits, not deployed) — ships after Phase 0 |
| [3](#phase-3--win-clients-online-proposals) | Backend hardening, then online proposals → deposit | ~17 days | ☐ Not started |
| [4](#phase-4--grow-and-retain) | Reviews, referrals, nurture, billing automation, support | ongoing | ☐ Not started |

---

## Ground rules

These apply to every phase.

- **Deploy the backend before the site.** The API's `ValidationPipe` uses `forbidNonWhitelisted`, so a newer site sending new fields to an older API gets a 400 on every request.
- **Never boot the local backend for testing.** Its `.env` points at the production Atlas cluster and real Gmail, and `SeedModule` writes on boot. Use unit tests with mocked models. Test the site against the read-only production API using the recipe below.
- **Ask before submitting any live form** (contact, estimate, audit, password reset). Each one sends real email. Use your own address.
- **One source of truth for facts.** Call length, reply times, timeline, pricing, savings and the booking link live in `app/lib/constants.ts`. Never type them as literals.
- **Hydration-safe dates.** Use `formatDate` / `formatShortDate` from `app/lib/dates.ts` for calendar dates and `<LocalTime>` (`app/components/ui/local-time.tsx`) for timestamps. Never use a bare `toLocaleDateString()`.
- **Private pages stay out of Google Analytics.** Any new route that carries a token or client data (for example `/proposal/:token`) must be added to `PRIVATE_PATH_PREFIXES` in `app/root.tsx`.
- **Backend contract first.** For any new field, update the schema, DTO and spec in `backend/src/modules/<name>/` first, then the site.

**Local production build** (for Lighthouse and visual checks):

```bash
npm run build
NODE_ENV=production API_BASE_URL=https://api.weblaud.com/api/v1 PORT=5299 \
  node --env-file=.env node_modules/@react-router/serve/dist/cli.js build/server/index.js
```

`NODE_ENV` must be set explicitly, or SSR returns 500. Local server response is about 700 ms, so local performance scores read lower than production.

---

## Phase 0 — Secure and ship what is built

**Why:** none of the last month's work is in production. That includes the client portal, lead pipeline, free audit tool, mobile performance fixes and Phase 1. About 25 backend modules have never been committed and exist only on one machine. Production runs `git reset --hard origin/main` on deploy, so nothing local reaches weblaud.com until it is pushed.

### 0.1 Commit and merge

- [ ] **Backend:** commit everything, including the untracked modules: analytics, approval, audit-log, audits, change-request, client-project, comment, contract, counter, dashboard, feature, file, invoice, leads, notification, organization, payment, project-update, task, time-entry, update-request, mail templates, `scripts/*`, `src/common/utils/*`, the guards and `.github/workflows/ci.yml`.
- [ ] **Site:** commit the working tree (lead pipeline, `/audit`, the perf/a11y pass, Phase 1).
- [ ] **Site:** merge `origin/main`. It is 5 commits ahead (PR #14 from Shuvo).
  - Files changed on both sides: `app/app.css`, `components/home/bannerHome.tsx`, `components/ui/hero-banner.tsx`, `components/ui/navBar.tsx`, `root.tsx`, `routes/privacy-policy.tsx`, `routes/terms-of-service.tsx`.
  - Upstream changes: rAF-throttled scroll handlers, Lenis retuned to `duration: 0.5`, a "Scroll" indicator on the hero banners, "Career" removed from the nav.
  - How to resolve:
    - **Keep from local:** no `isVisible` state in the navbar; Lenis only on fine pointers; the mobile "Get estimate" button and "Pricing" link.
    - **Take from upstream:** the rAF throttle and its passive listener; the new Lenis numbers; the scroll indicator.
  - After merging, confirm the server HTML still has no `opacity:0` on `<main>` or the navbar.
- [ ] `npm run typecheck && npm test && npm run build` (site) and `pnpm build && pnpm test` (backend) are green.
- [ ] Push both repos. The site's `deploy.yml` now runs a `verify` job first.

### 0.2 Backend environment (production `.env`)

- [ ] `TURNSTILE_SECRET_KEY`; site `.env` gets `TURNSTILE_SITE_KEY`.
- [ ] `INTERNAL_API_SECRET`, the same value in both `.env` files.
- [ ] `PAGESPEED_API_KEY`. The keyless quota is exhausted, so `/audit` fails without it.
- [ ] `BOOKING_URL=https://zcal.co/i/JW03svfU`, and confirm in Zcal that this event is 15 minutes.
- [ ] Stripe: webhook endpoint `/api/v1/payments/webhook` with events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`; set `STRIPE_WEBHOOK_SECRET`.
- [ ] nginx overwrites `X-Real-IP` with the visitor IP, so it can't be spoofed.
- [ ] Delete the old Web3Forms access key in the Web3Forms dashboard.

### 0.3 Deploy

- [ ] Deploy the **backend**, then check that `GET /api/v1/portal/projects` returns **401** (not 404).
- [ ] Deploy the **site** (push to `main`).

### 0.4 Dashboards and CMS (no code)

- [ ] Cloudflare → Scrape Shield → **Email Address Obfuscation off**. Optionally turn off the auto-injected Web Analytics beacon.
- [ ] GA4: mark `generate_lead` as a key event.
- [ ] `/cpadmin/insights`: edit "Eliminating Manual Business Bottlenecks with Automated Operations Workflows". Replace "Our clients routinely reduce customer onboarding friction by 70%…" with the typical-outcome wording already in `app/data/insights.ts`. The live copy comes from the database.
- [ ] `/cpadmin/projects`: upload 2–4 screenshots per case study. The gallery shows only when `detailImages` exist, and today none do.

### Done when

- [ ] `https://weblaud.com/audit`, `/portal/login` and `/portal/forgot-password` return 200.
- [ ] Production HTML has no `fonts.googleapis.com`, no `email-decode.min.js`, and no `opacity:0` on `<main>`.
- [ ] One contact submission with your own email arrives with the auto-reply, including the new budget and timeline fields.
- [ ] Mobile PageSpeed run on `/`, `/services`, `/contact`, recorded here: `/` ___ · `/services` ___ · `/contact` ___

---

## Phase 1 — Conversion and trust quick wins

**Status:** built and verified locally on 2026-10-17. It ships with Phase 0. Kept here so nobody rebuilds it.

**Verification at build time:**
- Site: typecheck clean, 47 vitest tests pass, build OK.
- Backend: 282 unit tests pass, build OK.
- Every footer and related link returns 200.
- Lighthouse accessibility is 100 on home, contact, services, a case study and a solutions page.

- [x] **Mobile CTA:** "Get estimate" in the phone header. The drawer has "Book a Call" and an estimate link. Main nav: Career → Pricing (`components/ui/navBar.tsx`).
- [x] **Contact form** (`components/contact/contactFormAndInfo.tsx`):
  - Unicode names via `PERSON_NAME_PATTERN` in `lib/leads.ts`.
  - 5,000-character messages.
  - `htmlFor` and `autoComplete` on every field.
  - Optional **budget** and **timeline**, stored by the backend, shown in admin and the alert email.
  - Inline success panel with "Book a call now".
- [x] **Single sources of truth:** `DISCOVERY_CALL` (15 minutes), `RESPONSE_TIME`, `BOOKING_URL` (the embedded Zcal invite). The backend default and email templates match.
- [x] **Internal links:**
  - `app/data/landing/links.ts` (with a test that keeps it in sync with the catalog).
  - Footer groups: Solutions, Resources, Compare, and a Client Login link.
  - A "Keep exploring" block on every landing page.
  - A `/services` solution strip and a visible FAQ that matches its JSON-LD.
- [x] **Home:** a "Featured work" section with 3 case studies.
- [x] **Case studies:** `RESULTS_DISCLOSURE` rendered, `detailImages` gallery, the cover image as `og:image` / `twitter:image` and Article image.
- [x] **Privacy policy:** current processors (Stripe, Atlas, Cloudinary, Google Workspace, PageSpeed), the `wl_ft` cookie, e-signature data. **Needs legal review.**
- [x] **500 page:** no longer claims "our team has been notified".
- [x] **Forgot password** (`routes/portal/forgot-password.tsx`, used by portal and admin). The backend discards a code after `MAX_OTP_ATTEMPTS` (5) wrong tries.
- [x] **Portal:**
  - The budget card shows "paid / remaining" (it was mislabelled "invoiced").
  - Hydration-safe dates everywhere, and the Time tab uses UTC weeks.
  - The real logo instead of the "W" box.
- [x] **CI:** the site deploy waits for typecheck, test and build. Backend `ci.yml` runs build and test.

---

## Phase 2 — Client portal usability + monitoring

**Goal:** a client opens the portal and immediately knows (a) where the project stands and (b) what they need to do. Clients who don't log in still stay informed.

**Order:** 2.1 → 2.2 → 2.3 (they build on each other), then 2.4–2.7 in any order.

**Build status (2026-10-17):** 2.1–2.7 are built and committed locally in both repos, on top of a "checkpoint Phase 0.1" commit in each. Nothing is pushed or deployed. Phase 0 (merge `origin/main`, push, deploy backend first) still comes first.

- Verification at build time: backend 333 unit tests pass and `pnpm build` is OK; site typecheck is clean, 76 vitest tests pass and the build is OK. Old project URLs return 301 to the new tabs (checked with curl against the local production build). Consent was checked in headless Chrome: DE gets no `wl_ft` until Accept, US is unchanged. Lighthouse accessibility is 100 on `/` (with and without the banner) and on `/privacy-policy`.
- **Not verified yet:** the portal pages in a real browser. Production has no portal API yet, and the local backend must not be booted. Do the phone walkthrough below after deploy.
- Deviations from the plan text:
  - 2.1: the per-project counts have a fifth key, `files`, for @mentions on files.
  - 2.1: a security fix shipped with it. Contract and invoice portal lists returned **every org's rows** to any role other than USER, MANAGER or ADMIN (e.g. EDITOR). They are now project-scoped.
  - 2.2: all notification links come from `portalProjectLink()` (`backend/src/common/utils/portal-links.util.ts`), mirrored on the site by `app/lib/portal-paths.ts`. Project-update notifications now open the Updates tab, and update-request ones open Decisions → Questions.
  - 2.5: client admins can also resend or cancel a pending invite and restore a deactivated colleague. A client admin can't deactivate themselves.
  - 2.6: server-side Sentry on the site is initialised from `entry.server.tsx` (`app/lib/sentry.server.ts`), not an `--import` preload, so PM2 and `npm start` are unchanged. That is enough for error capture because tracing is off. The browser SDK is a lazy ~32 kB gzip chunk that loads only when a DSN is set. SDK v11's `dataCollection` turns off user info, cookies, bodies and query strings, and a scrubber runs again before sending. The 500 page says "our team has been notified" while `SENTRY_DSN` is set.
  - 2.7: the per-country HTML assumes Cloudflare doesn't cache HTML, which is the default today. If HTML caching is ever turned on, the banner has to move client-side.

### 2.1 "Needs your input" inbox — ~3 days

**Why:** the dashboard's attention card covers only contracts, approvals and overdue invoices, and the project tabs show no counts. Clients miss quoted change requests, unpaid invoices that aren't overdue yet, and @mentions.

**Backend** (`src/modules/dashboard/portal-dashboard.service.ts`):
- [x] Add groups to `PortalAttentionSummary`. Clients see the first three plus mentions.
  - `changeRequestsAwaitingDecision`: change requests with status `QUOTED`, from `ChangeRequestService.findForPortalUser`.
  - `unpaidInvoices`: status `SENT` or `PARTIALLY_PAID` (keep `overdueInvoices` separate). Meta shows the amount still owed (`total - amountPaid`) and the due date.
  - `unreadMentions`: unread notifications of type `comment_mention` for this user, from `NotificationService`.
  - Staff only (PM, admin):
    - `changeRequestsAwaitingQuote` (status `REQUESTED`)
    - `openUpdateRequests` (status `OPEN`)
    - `updatesPendingReview` (from the project-update review queue)
- [x] New `GET /portal/projects/:id/attention`. It returns counts keyed by the **Phase 2.2 tab names**: `{ decisions, billing, updates, work }`, checked with the existing project-access helper (`common/utils/project-access.util.ts`).
- [x] Unit spec: each group filters by status and stays inside the user's access scope (mock the sibling services, as the existing specs do).

**Site:**
- [x] `components/portal/action-inbox.tsx` replaces `AttentionCard` in `routes/portal/dashboard.tsx`. Every item links straight to the thing to act on.
- [x] Sidebar: a total badge on "Projects" (`routes/portal/layout.tsx`, from the layout loader).
- [x] Project tabs: count badges, loaded in `routes/portal/projects.$id.tsx` from the new endpoint.
- [x] Empty state: "You're all caught up."

**Done when:** a client with one quoted change request and one unpaid invoice sees both on the dashboard and as badges on the right tabs, and clearing them removes the badges.

### 2.2 Ten project tabs → six — ~3 days

**Why:** 10 tabs (12 for staff) with overlapping meanings, and the tab bar scrolls sideways on phones.

**New structure.** Top-level tabs become **layout routes**; the old pages become their sub-pages. Every existing loader and action keeps working unchanged.

| New tab | Contains (old tab → new URL) |
|---|---|
| Overview | Overview → `/portal/projects/:id` |
| Work | Tasks → `/work/tasks`; new Milestones timeline → `/work/timeline` |
| Updates | Updates → `/updates`; Discussion → `/updates/discussion` |
| Files | Files → `/files` (unchanged) |
| Decisions | Approvals → `/decisions/approvals`; Change requests → `/decisions/changes`; Requests ("Ask for an update") → `/decisions/questions` |
| Billing | Invoices → `/billing/invoices`; Contract → `/billing/contract` |
| *(staff)* Time, Manage | unchanged |

- [x] `app/routes.ts`: add the layout routes `work`, `decisions`, `billing` (and `updates` children) with a small sub-nav (segmented control).
- [x] **Redirect old URLs** with redirect-only route files, like `routes/portal/invoices.$id.ts`. Notification `link` values stored in the database point at `/tasks`, `/approvals`, `/change-requests`, `/invoices` (see `backend/src/modules/*/…service.ts`), so these redirects must stay **permanently**.
- [x] Backend: update the `link:` strings in the notification calls to the new paths, for new notifications.
- [x] Badges from 2.1 attach to the new top-level tabs.
- [x] Mobile: the six tabs fit at 360 px without sideways scrolling.

**Done when:**
- Every old link (from an email or a notification) lands on the right sub-page.
- At 360 px, all six tabs are visible without scrolling.
- Approve, quote, pay, upload, comment and log-time all still work.

### 2.3 New Overview + one progress number — ~2 days

**Why:** the Overview doesn't answer "where are we?". Progress has two writers — the task-board recompute (`TaskService.recomputeProgress`) and a PM update's `progressValue` (`ProjectUpdateService`, `applyProgress`) — so a client can see progress go **down**.

- [x] **Decision: progress comes from the task board only.** In `backend/src/modules/project-update/project-update.service.ts`, stop calling `applyProgress` with `progressValue`. Keep the field on the update as narrative and show it in the update card only. Update the schema comment in `client-project.schema.ts`.
- [x] Overview sections (`routes/portal/projects.$id._index.tsx`):
  - [x] **Needs your input:** this project's items from 2.1.
  - [x] **Next milestone:** title, due date, "Late" flag when `dueDate < today` and status isn't `done` (compare in UTC).
  - [x] **Latest update:** the most recent published update, with a link to the Updates tab.
  - [x] **Budget:** contract value / invoiced (non-draft, non-void invoices) / paid (`budget.spent`) / remaining. "Invoiced" needs the project's invoices, which the Billing loader already fetches.
  - [x] **Recent activity:** the last 10 events (published updates, files shared with the client, approvals decided, invoices paid). Source: a new `GET /portal/projects/:id/activity` that merges the most recent rows from those collections. Don't read the notifications table; it's per-user.
- [x] Spec: the activity endpoint respects `clientVisible` / file `visibility: client` for client users.

**Done when:** a client can tell from one screen what happened this week, what's next, what they owe, and what they must do. Progress never moves backwards when a PM posts an update.

### 2.4 Weekly digest email — ~2 days

**Why:** most clients don't log in, and there is no summary email. Today the only scheduled jobs are the two invoice jobs and the lead digest.

**Backend:**
- [x] `task.schema.ts`: add `completedAt?: Date`. `TaskService` sets it when status changes to `done` and clears it when the status leaves `done`.
- [x] New `src/modules/digest/project-digest.service.ts` with `@Cron('0 8 * * 1', { timeZone: 'UTC' })` (Mondays 08:00 UTC).
  - For each `active` project, collect the last 7 days:
    - tasks completed (`clientVisible` only)
    - published updates
    - milestones completed
    - files shared with the client
  - Add what's waiting on the client (reuse 2.1) and invoices due in the next 14 days.
  - **Skip the project if every section is empty.**
- [x] Recipients: active client users in the project's organization whose `emailPreferences.digest !== false`.
- [x] Add `digest` to `EmailPreferences` in three places: `user.schema.ts`, `EMAIL_CATEGORIES` in `users.service.ts`, and the update-preferences DTO. On the site, add it to the `EmailPreferences` type and `components/account/email-preferences-form.tsx`.
- [x] Template `mail/templates/weekly-digest.hbs` with an unsubscribe link (existing `email-preference-token` util).
- [x] Store `lastDigestAt` on the project so a restart can't send twice in one week.
- [x] Spec: the empty week is skipped, opted-out users are skipped, and a second run in the same week sends nothing.

**Done when:** a test project with activity produces one correct email per client user, and a project with no activity sends nothing.

### 2.5 Client admins invite their own team — ~1.5 days

**Why:** only the agency admin can invite (`users.controller.ts` → `@Roles(Role.ADMIN)`), so clients email you to add colleagues.

**Backend** (new `PortalTeamController` in `src/modules/users/`):
- [x] `GET /portal/team`: active and invited users in the caller's organization.
- [x] `POST /portal/team/invite`: **client_admin only.**
  - `organization` is forced to the caller's own and `role` is forced to `USER`.
  - `orgRole` must be `client_viewer` or `client_admin`.
  - Reuses `UsersService.invite`.
  - Throttled to 10 per hour.
- [x] `PATCH /portal/team/:id`: change `orgRole` or deactivate. It refuses to act on users outside the organization, and refuses to remove or demote the **last** client admin.
- [x] Audit-log every change. Spec covers the organization scoping and the last-admin guard.

**Site:**
- [x] `routes/portal/team.tsx`: list, invite dialog and role select. "Team" appears in the sidebar for client admins only.

**Done when:** a client admin can invite a viewer, the viewer can accept and sign in, and nobody can touch another organization's users.

### 2.6 Error and uptime monitoring — ~1 day

**Needs from the owner:** a Sentry account and two DSNs (site, backend).

- [x] Backend: `@sentry/nestjs`, initialized only when `SENTRY_DSN` is set. Strip request bodies, cookies and `Authorization` headers before sending.
- [x] Site: the official Sentry SDK for React Router v7 framework mode, client and server, only when `SENTRY_DSN` is set. Same scrubbing, and skip `/portal/accept-invite` query strings, because they carry tokens.
- [x] Once events are arriving, restore "Our team has been notified" on the 500 page (`app/root.tsx`). It now shows automatically whenever `SENTRY_DSN` is set. **Owner:** create the two Sentry projects, put each DSN in that repo's `.env` as `SENTRY_DSN`, then throw a test error and confirm it arrives with no personal data.
- [ ] **(owner)** Uptime monitor (UptimeRobot, Better Stack or similar) on `https://weblaud.com/` and `https://api.weblaud.com/api/v1/faqs`, alerting by email.

**Done when:** a deliberately thrown test error shows up in Sentry with no personal data, and the uptime monitor reports both URLs as up.

### 2.7 Cookie consent for EU/UK visitors — ~1 day

**Why:** GA4 and the `wl_ft` attribution cookie run for EU and UK visitors without consent, and the site lists GB and the EU as service areas.

**Decision needed:** a banner for EU/UK/CH visitors only (recommended), or for everyone.

- [x] Root loader reads Cloudflare's `CF-IPCountry` header and returns `needsConsent` for EEA, UK and CH.
- [x] Google Consent Mode v2: when `needsConsent`, the inline GA snippet sends `gtag('consent','default', { analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' })` **before** `config`.
- [x] Small banner (Accept / Decline) storing a first-party `wl_consent` cookie for 180 days, then calling `gtag('consent','update', …)`.
- [x] `captureFirstTouch()` (`lib/attribution.ts`) runs only after consent when `needsConsent`.
- [x] Update the privacy policy cookies section.
- [x] Accessibility: the banner is keyboard reachable, doesn't trap focus, and keeps Lighthouse accessibility at 100.

**Done when:** with `CF-IPCountry: DE`, there are no GA cookies and no `wl_ft` until Accept. A US visitor's experience is unchanged.

### Phase 2 done when

- [ ] 2.1–2.7 ticked and deployed (backend first).
- [ ] A client walkthrough on a phone: log in → see the inbox → approve one item → pay one invoice → read the latest update, all without sideways scrolling or hunting.
- [ ] The first weekly digest went out and you checked it in a real inbox.

---

## Phase 3 — Win clients: online proposals

**Goal:** turn "proposal sent" into a link the prospect can read, sign and pay a deposit through, ending as an onboarded portal client with no manual steps.

**Order:** **3.0 must ship before 3.1.** Proposals move money and store signed documents, so the hardening comes first. 3.2 and 3.3 can run in parallel with 3.1.

### 3.0 Backend hardening — ~5 days

- [ ] **Money in integer cents.**
  - Fields:
    - invoice `lineItems.unitPrice`, `subtotal`, `tax`, `total`
    - payment `amount`
    - project `budget.amount`, `budget.spent`
    - change-request `priceAmount`
    - any time/cost rates used in invoicing
  - Store cents and convert at the API boundary (DTO in, serializer out), so the site and API shapes don't change.
  - Migration script `backend/scripts/migrate-money-to-cents.ts`: idempotent, records itself in a `migrations` collection, takes a dry-run flag, and **runs against a database backup first**.
  - Remove the `/ 100` conversions in `payment.service.ts` once amounts are cents end to end.
  - Specs: invoice totals are exact (no `0.1 + 0.2` drift) and partial payments sum exactly.
- [ ] **Private files.**
  - Portal files, contract documents and CVs are uploaded as Cloudinary `type: 'authenticated'` and fetched server-side with short-lived signed URLs (`common/utils/stored-file-streamer.util.ts`). Marketing images stay public.
  - Needs an `upload-pro` change (publish 1.2.0, bump in `backend/package.json`) and a migration script that converts existing private assets.
  - Done when: a raw Cloudinary URL for a contract returns 401/404 in a logged-out browser.
- [ ] **Archive instead of delete.**
  - `ClientProject` gets `archivedAt`.
  - `DELETE /client-projects/:id` returns **409** when the project has invoices, payments or contracts.
  - Admin UI gets an "Archive" action; archived projects are hidden from portal lists.
- [ ] **Deactivated organizations are locked out.** `auth/strategy/jwt-access.strategy.ts` (and the refresh path) reject users whose organization has `isActive: false`. Spec covers both.
- [ ] **Signed-document integrity.**
  - When a contract is sent, store `documentSha256` of the file.
  - On accept, recompute it, refuse if it changed, and save the hash in `acceptance`.
  - The certificate PDF prints the hash.

### 3.1 Online proposals → e-sign → deposit — ~8 days

**Data model** (new module `src/modules/proposal/`):

```ts
Proposal {
  lead: { source: 'contact' | 'estimate' | 'audit'; id: ObjectId }
  client: { name; email; company? }
  title; summary                       // short intro shown at the top
  scope: { title; description? }[]     // prefilled from estimate.featureTitles
  milestones: { title; weeksFromStart; amountCents }[]
  totalCents; currency; depositPercent // e.g. 30
  timelineWeeks                        // prefilled from estimate.totalWeeks; must respect TIMELINE
  terms                                // markdown, from a template the owner approves
  validUntil: Date
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'paid' | 'declined' | 'expired' | 'void'
  tokenHash                            // sha256 of a 32-byte random token; the raw token only exists in the emailed link
  firstViewedAt?; lastViewedAt?; viewCount
  acceptance?: { name; signatureImage; acceptedAt; ip; userAgent; documentSha256 }
  organization?; project?; contract?; depositInvoice?
  createdBy
}
```

**Admin API** (`@Roles(ADMIN, MANAGER)`):
- [ ] `POST /proposals`, with an optional `fromLead`. Prefill from the estimate: features, `costMin`/`costMax` → total, `totalWeeks`.
- [ ] `PATCH /proposals/:id` (draft only), `GET /proposals`, `GET /proposals/:id`.
- [ ] `POST /proposals/:id/send`: generates the token, emails `/proposal/:token` (template `proposal-sent.hbs`), and moves the lead to stage `proposal_sent`.
- [ ] `POST /proposals/:id/void`.

**Public API** (`@Public`, throttled, token-checked, nothing else exposed):
- [ ] `GET /proposals/public/:token`: returns the proposal. The first view sets `viewed` and notifies the admin ("Proposal viewed — follow up now"). It returns 410 when expired or void.
- [ ] `POST /proposals/public/:token/accept` with `{ name, signatureImage }`, **idempotent**, in one transaction:
  1. Create the `Organization`, or reuse one if the email already has one.
  2. Invite the client as `client_admin` (`UsersService.invite`).
  3. Create a `ClientProject` (status `planning`, milestones and features from the proposal, `budget.amount = total`).
  4. Create a `Contract`: a PDF snapshot of the proposal and terms, already `accepted`, with the acceptance record and `documentSha256` from 3.0.
  5. Create a deposit `Invoice` (type `deposit`, status `sent`, `depositPercent` of the total).
  6. Return `{ checkoutUrl }` from a new `PaymentService.createProposalCheckout(invoiceId, token)` that reuses the existing checkout code, with `success_url` = `/proposal/:token?paid=1`.
- [ ] Webhook: in the existing `PaymentService.handleEvent` path, when a paid invoice is a proposal deposit:
  - set the proposal to `paid` and the project to `active`
  - move the lead to `won`
  - notify the admin and the PM
- [ ] `GET /proposals/public/:token/pdf` (pdfkit, like the invoice PDF).

**Site:**
- [ ] Admin `/cpadmin/proposals` (list, new, edit, send, void) with view status, plus a **"Create proposal"** button on contact, estimate and audit lead rows (`components/admin/lead-pipeline.tsx`).
- [ ] Public `/proposal/:token`: scope, milestones, price, deposit and terms, then a signature step (reuse `components/portal/signature-pad.tsx`), then the deposit payment, then "Welcome — check your email for portal access".
  - `noindex`.
  - Add `/proposal` to `PRIVATE_PATH_PREFIXES`.
  - Works at 360 px.
- [ ] Remove the manual "Convert to client" step for leads that come through a proposal. Keep it for offline deals.

**Specs:**
- Token lookup uses the hash.
- An expired or void proposal can't be accepted.
- A double accept doesn't create two organizations.
- The webhook moves the right proposal and project.
- Amounts are cents end to end.

**Done when:** in Stripe test mode, an admin builds a proposal from an estimate lead, sends it, and opens the link. The admin is notified of the view. The prospect signs and pays the deposit with a test card. The prospect receives the portal invite, the project shows as active with its milestones, the deposit invoice is paid, and the lead is won. Nobody touches the admin panel during this.

### 3.2 "How we work" page with portal screenshots — ~2 days

- [ ] Route `/how-we-work`:
  - The process: discovery call → proposal → kickoff → weekly sprints with updates → approvals → launch → support.
  - What the client sees at each step, using **real portal screenshots** taken from the demo data (`backend/scripts/seed-portal-demo.ts`, run against a **non-production** database only).
- [ ] Link it from the home page (a short section after Featured work), the footer Resources group, landing pages ("Keep exploring") and `llms.txt`. Add it to the sitemap.
- [ ] Live demo login: **not in this phase.** A read-only demo account needs a guard that rejects every write for demo users, plus a nightly reset. It's in the Parking lot.

### 3.3 Booking automation — ~2 days

- [ ] Check whether Zcal can send booking webhooks. If not, move to a scheduler that can (Cal.com is open source, has embed events and webhooks), update `BOOKING_URL` and `booking-modal.tsx`, and keep the 15-minute event.
- [ ] Backend `POST /bookings/webhook`, signature-verified:
  - Match the attendee email to the most recent open lead (contact, estimate or audit).
  - Set the stage to `call_booked`, `nextFollowUpAt` to the meeting date, and add a note with the time.
  - If there's no match, create a contact lead with `heardAbout` empty and a "booked directly" note.
- [ ] Site: fire GA4 `book_call_complete` from the scheduler's booking-success embed event. Keep `book_call_click` for modal opens. Mark `book_call_complete` as a key event.

### Phase 3 done when

- [ ] 3.0 shipped and its migrations ran on production (after a backup).
- [ ] The 3.1 test-mode flow passes end to end, then one real proposal goes out.
- [ ] `/how-we-work` is live and linked; booked calls move leads automatically.

---

## Phase 4 — Grow and retain

Pick items in this order unless there's a business reason to change it. Each still follows the Definition of done.

| # | Feature | Size | Notes |
|---|---|---|---|
| 4.1 | **Paid Discovery Sprint** | 3 d | A fixed-price 1–2 week scoping engagement (workshop, clickable prototype, fixed quote) credited to the build. Public page plus Stripe Checkout. On payment, create the lead, organization and a "Discovery" project. **Owner sets the price.** |
| 4.2 | **Review and referral engine** | 4 d | An NPS (0–10) prompt after milestone approval and project completion, in the portal and by email. Scores of 9–10 get Clutch and Google review links (`CLUTCH_REVIEW_URL`, `GOOGLE_REVIEW_URL`) and a testimonial form with a publish-consent checkbox, which creates an inactive testimonial for admin approval. Scores of 0–6 alert the PM. Referral link `?ref=CODE` is captured by attribution and shown on the lead. |
| 4.3 | **Testimonial and case-study proof fields** | 2 d | Testimonials: `company`, `avatar`, `projectSlug`, `sourceUrl`. Projects: `industry`, `duration`, `teamSize`, `engagementModel`, `metricsVerified` (verified studies drop the `RESULTS_DISCLOSURE`). Admin forms and public rendering, plus richer `Review` JSON-LD. Client logos section when permission exists. |
| 4.4 | **Nurture emails** | 3 d | For estimate and audit leads still `new`/`contacted` with no booking: day 2 case study, day 5 how we work, day 9 discovery sprint, day 16 check-in. A daily cron stores `nurtureStep`, `nurtureNextAt` and `nurtureStoppedAt`. It stops on any stage change, a booking (3.3) or unsubscribe. |
| 4.5 | **Milestone billing** | 3 d | A milestone gets an optional `amountCents`. When the PM marks it done, an approval (`subjectType: 'milestone'`) goes to the client. Approval issues the milestone invoice; rejection sends it back to in progress with the comment. |
| 4.6 | **Previews and releases** | 2 d | `ClientProject.environments[{ label, url, kind: web/ios/android }]` and releases (version, notes, link) tied to updates. Overview gets a "See it live" card. |
| 4.7 | **"Report an issue" for testing (UAT)** | 2 d | Client form (title, steps, URL, severity, screenshot via the file module) creates a client-visible task labelled bug and notifies the PM. The client sees its status. |
| 4.8 | **Comment attachments and approval previews** | 2 d | `Comment.attachments[fileId]`; image and PDF previews on approvals through the authenticated stream route. |
| 4.9 | **Meetings** | 2 d | A scheduling link on the PM's profile ("Book time with your PM"), meeting notes as an update type, and an ICS calendar feed (`/portal/calendar/:token.ics`) for milestones and invoice due dates. |
| 4.10 | **Onboarding checklist** | 2 d | Per-project checklist: sign contract → pay deposit → brand assets → access grants → kickoff. Items tick themselves from events where possible. |
| 4.11 | **Support desk after launch** | 4 d | Ticket module (severity, status, SLA due time) tied to retainer invoices, with email notifications and a status card in the portal. |
| 4.12 | **"Start a new project" in the portal** | 1 d | Creates a lead tagged as an existing client, linked to the organization. Repeat revenue. |
| 4.13 | **Two-factor login (TOTP)** | 3 d | Required for staff, optional for client admins. Encrypted secret, recovery codes, a login step. |
| 4.14 | **Pricing page and shareable estimate** | 2 d | `/pricing` built from `PRICING` (packages, discovery sprint, retainer). Calculator "share link" (selection in the query string) and an estimate PDF. |
| 4.15 | **Backend lint backlog** | 2–3 d | ~576 ESLint errors. Clear them, then add a lint step (without `--fix`) to `backend/.github/workflows/ci.yml`. |
| 4.16 | **AI scoping assistant** | 5+ d | A chat grounded only in services, pricing and case studies that qualifies the visitor and hands off to booking or creates a lead with the transcript. Needs guardrails, a cost cap and a human handoff. Only after 4.1–4.4 show demand. |

**Off-site work (no code, ongoing, owner/marketing).** This is the biggest lever for being recommended by AI search:
- [ ] Clutch, GoodFirms, G2 and DesignRush profiles, with name, address and phone matching `COMPANY` in `lib/constants.ts`.
- [ ] Turn happy clients into **written public reviews** (4.2 automates the ask).
- [ ] Get into "best software agency 2026" listicles; build a genuine Reddit and LinkedIn presence.

---

## Definition of done (every feature)

- [ ] Backend schema, DTO and spec land first; deploy order is backend → site.
- [ ] Unit specs for new services (mocked models) and vitest tests for new site helpers.
- [ ] `npm run typecheck`, `npm test`, `npm run build` (site) and `pnpm build`, `pnpm test` (backend) are green, and CI is green.
- [ ] Lighthouse accessibility is 100 on every touched public page; portal pages are checked at 360 px.
- [ ] No hardcoded facts (constants), no unsafe dates (`lib/dates.ts`), and private routes are in `PRIVATE_PATH_PREFIXES`.
- [ ] Money is in cents (after 3.0), and every access check uses the existing project or organization helpers.
- [ ] This file is updated: boxes ticked, phase date filled in.

## Decisions the owner needs to make

| Needed for | Decision |
|---|---|
| 2.6 | Create a Sentry account and share the two DSNs. |
| 2.7 | ~~Consent banner for EU/UK/CH only or everyone.~~ **Decided 2026-10-17: EU/UK/CH only.** |
| 3.1 | Default deposit percentage, proposal terms template, how long proposals stay valid. |
| 3.3 | Keep Zcal (if it has webhooks) or move schedulers. |
| 4.1 | Discovery Sprint price and what it includes. |
| 4.2 | Clutch and Google review URLs; referral reward, if any. |
| Phase 1 | Legal review of the updated privacy policy. |

## Parking lot

Ideas that are **not** scheduled. Add new ones here instead of starting them.

- Live read-only portal demo (needs a demo-user write guard and nightly reset).
- Real-time updates (websockets or SSE). The 30-second notification polling is fine for now.
- Progressive web app and push notifications for the portal.
- Exit-intent or scroll prompts (likely to annoy, low priority).
- Newsletter and related articles on insights.
- Org logo shown in the portal header (`Organization.logo` exists).
