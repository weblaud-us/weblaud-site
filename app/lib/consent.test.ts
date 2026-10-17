import { describe, expect, it } from "vitest";
import {
  analyticsAllowed,
  consentCookie,
  gaBootstrapScript,
  needsConsentFor,
  readConsent,
} from "./consent";

describe("needsConsentFor", () => {
  it("covers the EEA, the UK and Switzerland", () => {
    for (const cc of ["DE", "FR", "IE", "NO", "IS", "LI", "GB", "CH", "de"]) {
      expect(needsConsentFor(cc)).toBe(true);
    }
  });

  it("leaves everyone else, and requests without the header, as before", () => {
    for (const cc of ["US", "CA", "BD", "AU", "XX", "T1", "", null, undefined]) {
      expect(needsConsentFor(cc)).toBe(false);
    }
  });
});

describe("readConsent", () => {
  it("reads a stored choice among other cookies", () => {
    expect(readConsent("wl_ft=abc; wl_consent=granted; _ga=1")).toBe("granted");
    expect(readConsent("wl_consent=denied")).toBe("denied");
  });

  it("ignores missing or tampered values", () => {
    expect(readConsent(null)).toBeNull();
    expect(readConsent("other=1")).toBeNull();
    expect(readConsent("wl_consent=yes")).toBeNull();
    expect(readConsent("not_wl_consent=granted")).toBeNull();
  });
});

describe("consentCookie", () => {
  it("stores the choice for 180 days", () => {
    expect(consentCookie("granted", true)).toBe("wl_consent=granted; Max-Age=15552000; Path=/; SameSite=Lax; Secure");
    expect(consentCookie("denied", false)).toBe("wl_consent=denied; Max-Age=15552000; Path=/; SameSite=Lax");
  });
});

describe("analyticsAllowed", () => {
  it("needs an explicit yes only where consent is required", () => {
    expect(analyticsAllowed(false, null)).toBe(true);
    expect(analyticsAllowed(true, null)).toBe(false);
    expect(analyticsAllowed(true, "denied")).toBe(false);
    expect(analyticsAllowed(true, "granted")).toBe(true);
  });
});

describe("gaBootstrapScript", () => {
  it("is unchanged for visitors who don't need consent", () => {
    const script = gaBootstrapScript("G-TEST", { needsConsent: false, consent: null });
    expect(script).not.toContain("consent");
    expect(script).toContain("gtag('config', 'G-TEST')");
  });

  it("denies every storage type before config when consent is needed", () => {
    const script = gaBootstrapScript("G-TEST", { needsConsent: true, consent: null });
    const defaults = script.indexOf("gtag('consent', 'default'");
    expect(defaults).toBeGreaterThan(-1);
    expect(defaults).toBeLessThan(script.indexOf("gtag('config'"));
    for (const key of ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"]) {
      expect(script).toContain(`${key}: 'denied'`);
    }
    expect(script).not.toContain("'update'");
  });

  it("re-applies a stored yes straight after the defaults", () => {
    const script = gaBootstrapScript("G-TEST", { needsConsent: true, consent: "granted" });
    const update = script.indexOf("gtag('consent', 'update', { analytics_storage: 'granted' })");
    expect(update).toBeGreaterThan(script.indexOf("'default'"));
    expect(update).toBeLessThan(script.indexOf("gtag('config'"));
  });
});
