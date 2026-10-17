import type { AuditVitals } from "./types";

export type ScoreBand = "good" | "needs-work" | "poor";

/** Lighthouse's own bands: 90+ good, 50–89 needs work, under 50 poor. */
export function scoreBand(score: number): ScoreBand {
  if (score >= 90) return "good";
  if (score >= 50) return "needs-work";
  return "poor";
}

export const SCORE_BAND_LABEL: Record<ScoreBand, string> = {
  good: "Good",
  "needs-work": "Needs work",
  poor: "Poor",
};

/**
 * Lab Core Web Vitals in display form, with Google's "good" threshold and
 * whether this value meets it. Rows Lighthouse couldn't measure are dropped.
 */
export function vitalRows(vitals: AuditVitals | undefined) {
  if (!vitals) return [];
  const rows: { label: string; value: string; target: string; good: boolean }[] = [];
  if (vitals.lcpMs !== undefined)
    rows.push({
      label: "Largest Contentful Paint",
      value: `${(vitals.lcpMs / 1000).toFixed(1)} s`,
      target: "≤ 2.5 s",
      good: vitals.lcpMs <= 2500,
    });
  if (vitals.tbtMs !== undefined)
    rows.push({
      label: "Total Blocking Time",
      value: `${Math.round(vitals.tbtMs)} ms`,
      target: "≤ 200 ms",
      good: vitals.tbtMs <= 200,
    });
  if (vitals.cls !== undefined)
    rows.push({
      label: "Cumulative Layout Shift",
      value: vitals.cls.toFixed(2),
      target: "≤ 0.1",
      good: vitals.cls <= 0.1,
    });
  if (vitals.fcpMs !== undefined)
    rows.push({
      label: "First Contentful Paint",
      value: `${(vitals.fcpMs / 1000).toFixed(1)} s`,
      target: "≤ 1.8 s",
      good: vitals.fcpMs <= 1800,
    });
  return rows;
}

/**
 * Quick client-side sanity check before spending a captcha + API run. The
 * backend's normalizeAuditUrl() is the real validator.
 */
export function looksLikeWebsite(input: string): boolean {
  const value = input.trim();
  if (!value || value.length > 300) return false;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.includes(".") &&
      !/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname)
    );
  } catch {
    return false;
  }
}

/** Visitor-facing copy for a failed run's machine-readable reason. */
export function failureMessage(reason?: string): string {
  switch (reason) {
    case "unreachable":
      return "Google couldn't load that page. Check the address is right and the site is publicly reachable, then try again.";
    case "quota":
      return "Our audit tool is very busy right now. Please try again in a little while — or book a call and we'll run it for you.";
    case "timeout":
      return "The audit took too long to finish. Very slow or very large pages can time out — try again, or book a call and we'll look manually.";
    default:
      return "Something went wrong running the audit. Please try again in a moment.";
  }
}
