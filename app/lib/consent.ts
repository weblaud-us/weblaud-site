/**
 * Cookie consent for visitors where the law requires it before analytics
 * cookies (GDPR / ePrivacy in the EEA, UK GDPR + PECR, Swiss FADP). The
 * country comes from Cloudflare's CF-IPCountry header; anywhere else — and
 * any request without the header, e.g. local dev — keeps the current
 * behaviour with no banner.
 *
 * For those visitors, Google Consent Mode v2 starts every storage type as
 * denied (GA then sends cookieless pings and sets no _ga cookie), and the
 * first-party wl_ft attribution cookie isn't written until they accept.
 *
 * NOTE: this makes the HTML vary by country. It's only correct while
 * Cloudflare doesn't cache HTML — the default today.
 */

/** EU 27 + Iceland, Liechtenstein, Norway (EEA) + United Kingdom + Switzerland. */
export const CONSENT_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "IS", "LI", "NO",
  "GB", "CH",
]);

export const CONSENT_COOKIE = "wl_consent";
export const CONSENT_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

export type ConsentChoice = "granted" | "denied";

/** Fired on window by the footer's "Cookie settings" button to reopen the banner. */
export const OPEN_CONSENT_EVENT = "wl:open-consent";

export function needsConsentFor(country: string | null | undefined): boolean {
  return !!country && CONSENT_COUNTRIES.has(country.trim().toUpperCase());
}

/** The visitor's stored choice, from a Cookie header or document.cookie. */
export function readConsent(cookieHeader: string | null | undefined): ConsentChoice | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === CONSENT_COOKIE) {
      const value = rest.join("=").trim();
      return value === "granted" || value === "denied" ? value : null;
    }
  }
  return null;
}

/** The Set-Cookie / document.cookie string that stores a choice. */
export function consentCookie(choice: ConsentChoice, secure: boolean): string {
  return `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure ? "; Secure" : ""}`;
}

/**
 * Whether first-party analytics (GA cookies, wl_ft) may run. Outside the
 * consent countries the answer is yes, as before.
 */
export function analyticsAllowed(needsConsent: boolean, consent: ConsentChoice | null): boolean {
  return !needsConsent || consent === "granted";
}

/**
 * The inline GA bootstrap. With needsConsent, Consent Mode defaults go in
 * BEFORE `config`, so the very first hit already respects them; a stored
 * "granted" is re-applied straight after. gtag.js itself is still fetched
 * only once the page is idle (see root.tsx).
 */
export function gaBootstrapScript(
  measurementId: string,
  { needsConsent, consent }: { needsConsent: boolean; consent: ConsentChoice | null },
): string {
  const consentLines = needsConsent
    ? `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
${consent === "granted" ? "gtag('consent', 'update', { analytics_storage: 'granted' });\n" : ""}`
    : "";
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
${consentLines}gtag('js', new Date());
gtag('config', '${measurementId}');
(function(){
  function inject(){
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
    document.head.appendChild(s);
  }
  function whenIdle(){
    if ('requestIdleCallback' in window) requestIdleCallback(inject, { timeout: 2000 });
    else setTimeout(inject, 1);
  }
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
})();`;
}
