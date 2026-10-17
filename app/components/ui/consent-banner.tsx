import { useEffect, useState } from "react";
import { Link } from "react-router";
import { captureFirstTouch, clearFirstTouch } from "~/lib/attribution";
import { OPEN_CONSENT_EVENT, consentCookie, type ConsentChoice } from "~/lib/consent";

type Gtag = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  try {
    (window as unknown as { gtag?: Gtag }).gtag?.(...args);
  } catch {
    /* analytics must never break the page */
  }
}

/** Expires Google Analytics' own cookies (_ga, _ga_<id>) on this host and its parent domain. */
function clearGaCookies() {
  try {
    const host = window.location.hostname;
    const domains = ["", host, `.${host.replace(/^www\./, "")}`];
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!name.startsWith("_ga")) continue;
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
      }
    }
  } catch {
    /* cookies blocked */
  }
}

/**
 * Accept / Decline bar for visitors where consent is required (EEA, UK,
 * Switzerland — see lib/consent.ts). Not a modal: it doesn't trap focus or
 * block the page, and both choices are equally easy. The footer's "Cookie
 * settings" button reopens it so a choice can be changed or withdrawn.
 */
export function ConsentBanner({ initialChoice }: { initialChoice: ConsentChoice | null }) {
  const [open, setOpen] = useState(initialChoice === null);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const choose = (choice: ConsentChoice) => {
    try {
      document.cookie = consentCookie(choice, window.location.protocol === "https:");
    } catch {
      /* cookies blocked — the choice still applies to this page view */
    }
    if (choice === "granted") {
      gtag("consent", "update", { analytics_storage: "granted" });
      captureFirstTouch();
    } else {
      gtag("consent", "update", { analytics_storage: "denied" });
      clearGaCookies();
      clearFirstTouch();
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <section
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-white/15 bg-[#0e0e0e]/95 p-4 sm:p-5 shadow-2xl backdrop-blur">
        <h2 id="consent-title" className="text-sm font-semibold text-white">
          Cookies and analytics
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-white/70">
          With your permission we use Google Analytics and a first-party cookie that remembers how you found us, so we
          can see which pages help people. Nothing is shared or sold.{" "}
          <Link to="/privacy-policy#collection" className="text-white underline underline-offset-2 hover:text-white/80">
            Privacy policy
          </Link>
        </p>
        <div className="mt-3.5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-lg border border-white bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
