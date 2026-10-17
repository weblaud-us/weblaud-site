/**
 * Strips personal and secret data from a Sentry event before it leaves the
 * browser or the server. Allowlist, not denylist: request bodies, cookies,
 * query strings (/portal/accept-invite and /email-preferences/unsubscribe
 * carry account tokens in theirs) and all but a few harmless headers are
 * dropped. Kept in step with the backend's common/utils/sentry-scrub.util.ts.
 */
import type { BrowserOptions } from "@sentry/react-router";

const SAFE_HEADERS = new Set(["accept", "accept-language", "content-type", "host", "user-agent"]);

/** Drops the query string and fragment from a URL or path; keeps it relative if it was. */
export function stripQuery(url: string): string {
  const cut = url.search(/[?#]/);
  return cut === -1 ? url : url.slice(0, cut);
}

type ScrubbableEvent = {
  request?: {
    url?: string;
    data?: unknown;
    cookies?: unknown;
    query_string?: unknown;
    headers?: Record<string, string>;
    env?: unknown;
  };
  user?: { id?: string | number; [key: string]: unknown };
  breadcrumbs?: { data?: Record<string, unknown> }[];
  transaction?: string;
};

export function scrubSentryEvent<T>(event: T): T {
  const e = event as ScrubbableEvent;
  if (e.request) {
    delete e.request.data;
    delete e.request.cookies;
    delete e.request.query_string;
    delete e.request.env;
    if (e.request.url) e.request.url = stripQuery(e.request.url);
    if (e.request.headers) {
      e.request.headers = Object.fromEntries(
        Object.entries(e.request.headers).filter(([name]) => SAFE_HEADERS.has(name.toLowerCase())),
      );
    }
  }
  // An id is enough to find the account; no email, name or IP.
  if (e.user) e.user = e.user.id !== undefined ? { id: e.user.id } : {};
  for (const crumb of e.breadcrumbs ?? []) {
    for (const key of ["url", "to", "from"]) {
      const value = crumb.data?.[key];
      if (typeof value === "string") crumb.data![key] = stripQuery(value);
    }
  }
  if (e.transaction) e.transaction = stripQuery(e.transaction);
  return event;
}

/**
 * Collect as little as possible in the first place (SDK v11's
 * `dataCollection`); scrubSentryEvent then cleans anything that slips through.
 */
export const SENTRY_DATA_COLLECTION: NonNullable<BrowserOptions["dataCollection"]> = {
  userInfo: false,
  cookies: false,
  httpBodies: [],
  urlQueryParams: false,
  httpHeaders: { request: { allow: [...SAFE_HEADERS] }, response: false },
};
