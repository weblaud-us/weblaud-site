import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BellRing, Share, SquarePlus, X } from "lucide-react";
import {
  disablePush,
  enablePush,
  getPushState,
  syncPush,
  type PushState,
} from "~/lib/push.client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

/** Current push state for this device; "loading" until checked in the browser. */
function usePushState() {
  const [state, setState] = useState<PushState | "loading">("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPushState()
      .then((s) => !cancelled && setState(s))
      .catch(() => !cancelled && setState("unsupported"));
    return () => {
      cancelled = true;
    };
  }, []);

  const run = useCallback(async (fn: () => Promise<PushState>, success?: string) => {
    setBusy(true);
    try {
      const next = await fn();
      setState(next);
      if (next === "on" && success) toast.success(success);
      if (next === "denied") toast.error("Notifications are blocked for this site in your browser settings.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update push notifications.");
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    state,
    busy,
    enable: () => run(enablePush, "Push notifications are on for this device."),
    disable: () => run(disablePush),
  };
}

function IosInstallSteps() {
  return (
    <ol className="space-y-1.5 text-sm text-white/60">
      <li className="flex items-center gap-2">
        <span className="text-white/40">1.</span> Tap <Share className="size-4 text-[#0A84FF]" />
        <span className="text-white/80">Share</span> in Safari's toolbar
      </li>
      <li className="flex items-center gap-2">
        <span className="text-white/40">2.</span> Choose <SquarePlus className="size-4 text-white/80" />
        <span className="text-white/80">Add to Home Screen</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="text-white/40">3.</span> Open WebLaud from your Home Screen and turn notifications on
        here
      </li>
    </ol>
  );
}

const DESCRIPTION: Record<PushState | "loading", string> = {
  loading: "Checking this device…",
  on: "This device gets a notification for new updates, invoices, approvals, change requests and replies.",
  off: "Get a phone or desktop notification the moment something needs you — no need to keep the portal open.",
  denied:
    "Notifications are blocked for this site. Allow them in your browser's site settings, then come back here.",
  unavailable: "Push notifications aren't available right now. You'll still get email and in-app notifications.",
  unsupported:
    "This browser can't receive push notifications. Try Chrome, Edge, Firefox or Safari — you'll still get email and in-app notifications.",
  "ios-install": "On iPhone and iPad, notifications work once WebLaud is on your Home Screen:",
};

/** Settings card: per-device on/off switch for push notifications. */
export function PushNotificationsCard() {
  const { state, busy, enable, disable } = usePushState();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Push notifications on this device</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-white/60">{DESCRIPTION[state]}</p>
        {state === "ios-install" && <IosInstallSteps />}
        {state === "off" && (
          <Button onClick={enable} disabled={busy}>
            <BellRing className="size-4" />
            {busy ? "Turning on…" : "Turn on"}
          </Button>
        )}
        {state === "on" && (
          <Button variant="outline" onClick={disable} disabled={busy}>
            {busy ? "Turning off…" : "Turn off for this device"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

const DISMISS_KEY = "weblaud:push-banner-dismissed";

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * One-time invitation at the top of the portal. The permission prompt only
 * fires from the button click (browsers ignore it otherwise). Dismissal is
 * remembered per device; Settings always has the toggle.
 */
export function PushPromptBanner() {
  const { state, busy, enable } = usePushState();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(readDismissed());
    void syncPush();
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private mode: it just shows again next visit.
    }
  };

  if (dismissed || (state !== "off" && state !== "ios-install")) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#0A84FF]/30 bg-[#0A84FF]/[0.07] p-4">
      <BellRing className="size-5 shrink-0 text-[#0A84FF] mt-0.5" />
      <div className="flex-1 min-w-0 space-y-3">
        <div>
          <p className="text-sm font-medium text-white">Get notified when something needs you</p>
          <p className="text-sm text-white/60">
            {state === "ios-install"
              ? "Add WebLaud to your Home Screen to get notifications on your iPhone or iPad."
              : "New updates, invoices and approvals, straight to your phone or desktop."}
          </p>
        </div>
        {state === "ios-install" ? (
          <IosInstallSteps />
        ) : (
          <Button size="sm" onClick={() => enable().then(dismiss)} disabled={busy}>
            {busy ? "Turning on…" : "Turn on notifications"}
          </Button>
        )}
      </div>
      <button
        onClick={dismiss}
        className="text-white/40 hover:text-white p-1 -m-1 shrink-0"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
