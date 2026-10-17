import type { LeadAttribution } from "./types";

/**
 * First-touch marketing attribution.
 *
 * On a visitor's first public page view we record where they came from (UTM
 * tags, external referrer, landing page) in a first-party cookie, and never
 * overwrite it. When they eventually submit the contact form or the
 * estimator — usually several pages and often several days later, by which
 * point the UTM tags are long gone from the URL — the route action reads the
 * cookie server-side and sends it with the lead.
 */

const COOKIE = "wl_ft";
const MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

/** Same caps as the backend's LeadAttributionDto, so a long URL can't 400 a lead. */
const LIMITS: Record<keyof LeadAttribution, number> = {
  utmSource: 100,
  utmMedium: 100,
  utmCampaign: 150,
  referrer: 300,
  landingPath: 300,
};

function clean(raw: Partial<Record<keyof LeadAttribution, unknown>>): LeadAttribution {
  const out: LeadAttribution = {};
  for (const key of Object.keys(LIMITS) as (keyof LeadAttribution)[]) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim().slice(0, LIMITS[key]);
    }
  }
  return out;
}

/** Client-side, once per page view: records first touch if none is stored yet. */
export function captureFirstTouch() {
  try {
    if (document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`))) return;

    const params = new URLSearchParams(window.location.search);
    let referrer = "";
    try {
      // External referrers only — internal navigation says nothing about source.
      if (document.referrer && new URL(document.referrer).host !== window.location.host) {
        referrer = document.referrer;
      }
    } catch {
      /* malformed referrer — ignore */
    }

    const touch = clean({
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      referrer,
      landingPath: window.location.pathname,
    });

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(touch))}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // Cookies blocked — attribution is a nice-to-have, never a reason to throw.
  }
}

/**
 * Server-side, in a form's route action: the stored first touch, or undefined.
 * Visitor-controlled, so re-validated here rather than trusted.
 */
export function readAttribution(request: Request): LeadAttribution | undefined {
  const header = request.headers.get("Cookie") ?? "";
  const raw = header
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (!parsed || typeof parsed !== "object") return undefined;
    const touch = clean(parsed);
    return Object.keys(touch).length ? touch : undefined;
  } catch {
    return undefined;
  }
}
