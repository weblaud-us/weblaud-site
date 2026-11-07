import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  /**
   * Hosts allowed to submit actions, matched on HOST ONLY (no scheme).
   *
   * React Router compares the browser's `Origin` header against the origin it
   * derives from `request.url`, and rejects a mismatch with 400 Bad Request
   * before any loader or action runs. We serve with `react-router-serve`,
   * which builds its own Express app and never enables `trust proxy` — and
   * offers no way to. So behind nginx `req.protocol` is always "http" and the
   * server computes its own origin as `http://weblaud.com`, while every real
   * browser sends `Origin: https://weblaud.com`. The scheme alone differs, so
   * the check failed on every form POST on the site: the admin login, the
   * contact and audit forms, the calculator, job applications. Requests with
   * no `Origin` header (curl, bots) were unaffected, which is why this looked
   * like it was specific to logging in.
   *
   * Listing the hosts here sidesteps the scheme mismatch, since the fallback
   * allowlist ignores the scheme. If this ever moves to a custom Express
   * server, set `app.set("trust proxy", true)` there and this can go away.
   */
  allowedActionOrigins: ["weblaud.com", "www.weblaud.com"],
  // Keep manual Netlify review builds separate from the existing Node release.
  ...(process.env.WEBLAUD_DEPLOY_TARGET === "netlify"
    ? { buildDirectory: "build-netlify" }
    : {}),
} satisfies Config;
