/**
 * True only in the Netlify team-review build (WEBLAUD_DEPLOY_TARGET=netlify,
 * baked in by vite.config.ts). The Node/PM2 production build is always false.
 *
 * netlify.toml's X-Robots-Tag rule only reaches static files; server-rendered
 * pages come from a function, so entry.server.tsx adds the header itself.
 */
declare const __WEBLAUD_REVIEW_BUILD__: boolean | undefined;

export const IS_REVIEW_BUILD = typeof __WEBLAUD_REVIEW_BUILD__ !== "undefined" && __WEBLAUD_REVIEW_BUILD__ === true;

export const REVIEW_ROBOTS_HEADER = "noindex, nofollow, noarchive";
