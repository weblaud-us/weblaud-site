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
  /**
   * The React Router v8 behaviours, opted into now so the upgrade is a version
   * bump rather than a migration. A flag left unset is what prints the
   * "Future Flag Warning" lines on `react-router dev`.
   */
  future: {
    // Route `middleware` exports run, and `context` in a loader/action is a
    // RouterContextProvider. Nothing here exports middleware or passes a
    // `getLoadContext` (we serve with react-router-serve), so this only
    // unlocks the feature.
    v8_middleware: true,
    // Split each route module into per-export chunks, so loader-only code
    // stays out of the browser bundle. Modules whose exports share values
    // fall back to a single chunk instead of failing the build.
    v8_splitRouteModules: true,
    // Drive the dev server and build through Vite's Environment API (Vite 7).
    v8_viteEnvironmentApi: true,
    // Loaders and actions get the request as it came off the wire, `.data`
    // suffix and internal `_routes`/`index` params included. Anything reading
    // a page path or query string back out of `request.url` goes through
    // requestPageUrl() in app/lib/request-url.ts.
    v8_passThroughRequests: true,
    // A `.data` request mirrors its page's trailing slash: `/path/_.data` for
    // `/path/`, `/path.data` for `/path`, `/_.data` for the root.
    v8_trailingSlashAwareDataRequests: true,
  },
} satisfies Config;
