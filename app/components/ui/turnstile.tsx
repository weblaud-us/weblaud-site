import { useEffect, useRef, useState } from "react";
import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "~/root";

/**
 * Cloudflare Turnstile bot check for the public forms (contact, estimate,
 * job application). The token it produces is forwarded by each form's action
 * to the backend, which verifies it with Cloudflare (backend CaptchaGuard) —
 * the check has to live there because the API endpoints are public and bots
 * were posting to them directly, skipping the site's own honeypot.
 *
 * "interaction-only": invisible for almost everyone; Cloudflare only shows a
 * checkbox when it isn't confident the visitor is human.
 *
 * The site key comes from the root loader (TURNSTILE_SITE_KEY at runtime, not
 * a VITE_ build-time variable). With no key configured — local dev — the
 * widget renders nothing and forms submit as before.
 */

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      theme?: "light" | "dark" | "auto";
      appearance?: "always" | "execute" | "interaction-only";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null; // allow a retry on the next mount
        reject(new Error("Turnstile failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/**
 * Form-side state for the check. `ready` is true when the form may submit:
 * either a token is in hand, or no site key is configured at all.
 */
export function useTurnstile() {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const siteKey = rootData?.turnstileSiteKey || undefined;
  const [token, setToken] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  return {
    siteKey,
    token,
    failed,
    ready: !siteKey || !!token,
    onToken: (next: string | null) => {
      setToken(next);
      if (next) setFailed(false);
    },
    onError: () => {
      setToken(null);
      setFailed(true);
    },
  };
}

interface TurnstileProps {
  siteKey: string | undefined;
  onToken: (token: string | null) => void;
  onError: () => void;
  /** Change this after every submission: tokens are single-use, so the widget re-issues one. */
  resetKey?: unknown;
  /** Shown in Cloudflare analytics, e.g. "contact". */
  action?: string;
  className?: string;
}

export function Turnstile({ siteKey, onToken, onError, resetKey, action, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  // Latest callbacks without re-rendering the widget whenever a parent re-renders.
  const callbacks = useRef({ onToken, onError });
  callbacks.current = { onToken, onError };

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: "dark",
          appearance: "interaction-only",
          callback: (token) => callbacks.current.onToken(token),
          "expired-callback": () => callbacks.current.onToken(null),
          "error-callback": () => callbacks.current.onError(),
        });
      })
      .catch(() => callbacks.current.onError());

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = undefined;
    };
  }, [siteKey, action]);

  useEffect(() => {
    if (resetKey === undefined || !widgetId.current || !window.turnstile) return;
    window.turnstile.reset(widgetId.current);
    callbacks.current.onToken(null);
  }, [resetKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} className={className} />;
}

/** One-line status under a form's submit button while the check runs or if it can't load. */
export function TurnstileStatus({ siteKey, ready, failed }: { siteKey?: string; ready: boolean; failed: boolean }) {
  if (!siteKey || ready) return null;
  return (
    <p className="text-xs text-gray-500 font-barlow mt-2" role="status">
      {failed
        ? "We couldn't run our spam check. Please disable content blockers for this site and reload, or email us directly."
        : "Running a quick spam check…"}
    </p>
  );
}
