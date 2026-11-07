/**
 * Browser side of portal push notifications: service-worker registration and
 * the Web Push subscription. Talks to app/routes/portal/push.ts, never to the
 * API directly. Browser-only (the .client suffix keeps it out of the server
 * bundle) — call from effects and event handlers.
 */

export type PushState =
  /** Browser can't do Web Push at all (old browser, in-app webview...). */
  | "unsupported"
  /** iPhone/iPad Safari tab: push works only from the Home Screen app. */
  | "ios-install"
  /** The user blocked notifications for this site. */
  | "denied"
  /** Push is off server-side (no VAPID keys). */
  | "unavailable"
  | "off"
  | "on";

const SW_URL = "/sw.js";
const SW_SCOPE = "/portal";
const ENDPOINT = "/portal/push";

export function isIos() {
  const ua = navigator.userAgent;
  // iPadOS 13+ reports itself as a Mac; touch support gives it away.
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

export function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function pushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

let publicKeyPromise: Promise<string | null> | null = null;
function getPublicKey() {
  publicKeyPromise ??= fetch(ENDPOINT, { credentials: "same-origin" })
    .then((res) => (res.ok ? res.json() : { publicKey: null }))
    .then((json: { publicKey: string | null }) => json.publicKey)
    .catch(() => {
      publicKeyPromise = null;
      return null;
    });
  return publicKeyPromise;
}

/** Registers the portal service worker (idempotent). */
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });
  } catch {
    return null;
  }
}

async function currentSubscription() {
  const reg = await navigator.serviceWorker.getRegistration(SW_SCOPE);
  return (await reg?.pushManager.getSubscription()) ?? null;
}

export async function getPushState(): Promise<PushState> {
  if (!pushSupported()) {
    return isIos() && !isStandalone() ? "ios-install" : "unsupported";
  }
  if (Notification.permission === "denied") return "denied";
  if (!(await getPublicKey())) return "unavailable";
  const sub = await currentSubscription();
  return sub && Notification.permission === "granted" ? "on" : "off";
}

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function post(body: Record<string, string>) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    credentials: "same-origin",
    body: new URLSearchParams(body),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error ?? "Couldn't update push notifications.");
  }
}

/**
 * Asks for permission (must run from a click — browsers block the prompt
 * otherwise), subscribes this device, and saves it server-side.
 */
export async function enablePush(): Promise<PushState> {
  if (!pushSupported()) return getPushState();
  const publicKey = await getPublicKey();
  if (!publicKey) return "unavailable";

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission === "denied" ? "denied" : "off";

  const reg = (await registerServiceWorker()) ?? (await navigator.serviceWorker.ready);
  await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  await post({ intent: "subscribe", subscription: JSON.stringify(sub.toJSON()) });
  return "on";
}

export async function disablePush(): Promise<PushState> {
  const sub = pushSupported() ? await currentSubscription() : null;
  if (sub) {
    // Server first: if it fails the user can retry with the subscription intact.
    await post({ intent: "unsubscribe", endpoint: sub.endpoint });
    await sub.unsubscribe();
  }
  return getPushState();
}

/**
 * Re-saves an existing subscription for whoever is logged in now. Covers a
 * browser that rotated its subscription, and a device where someone else
 * logged in since push was enabled (the server upserts by endpoint, so the
 * row moves to the current user). Silent and best effort.
 */
export async function syncPush() {
  try {
    if (!pushSupported() || Notification.permission !== "granted") return;
    await registerServiceWorker();
    const sub = await currentSubscription();
    if (sub) await post({ intent: "subscribe", subscription: JSON.stringify(sub.toJSON()) });
  } catch {
    // Best effort.
  }
}

/**
 * On logout: drop this device's subscription so a shared computer stops
 * getting the previous user's notifications. Local only — the server row is
 * removed the next time a push to it returns 410. Never throws.
 */
export async function forgetPushOnThisDevice() {
  try {
    if (!pushSupported()) return;
    await (await currentSubscription())?.unsubscribe();
  } catch {
    // Best effort.
  }
}
