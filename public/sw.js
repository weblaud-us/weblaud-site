/*
 * WebLaud client portal service worker — push notifications only.
 *
 * Deliberately caches nothing: the portal is server-rendered by React Router
 * and must always show live data, so a stale cached page would do more harm
 * than an offline fallback would help. Registered from app/lib/push.client.ts
 * with scope /portal. nginx must serve this file with Cache-Control: no-cache
 * so updates reach installed clients.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "WebLaud", body: event.data ? event.data.text() : "" };
  }

  // Always show something: iOS revokes push permission from a site whose
  // push events don't display a notification.
  const title = data.title || "WebLaud";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-96.png",
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      data: { link: data.link || "/portal" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || "/portal";
  // Only same-origin portal paths — never navigate to whatever a payload says.
  const target = new URL(link.startsWith("/portal") ? link : "/portal", self.location.origin).href;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const portalWindow = windows.find((client) =>
        new URL(client.url).pathname.startsWith("/portal"),
      );
      if (portalWindow) {
        await portalWindow.focus();
        if ("navigate" in portalWindow) {
          try {
            await portalWindow.navigate(target);
            return;
          } catch {
            // Uncontrolled window: fall through and open a fresh one.
          }
        } else {
          return;
        }
      }
      await self.clients.openWindow(target);
    })(),
  );
});
