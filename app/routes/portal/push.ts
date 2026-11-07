import { data } from "react-router";
import type { Route } from "./+types/push";
import { ApiError, apiFetch } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";

/**
 * Push-notification plumbing for app/lib/push.client.ts. The browser never
 * talks to the API directly, so subscribing goes through here:
 *   GET  → { publicKey } — the VAPID key, or null when push is off server-side
 *   POST → intent=subscribe (subscription=<PushSubscription JSON>) or
 *          intent=unsubscribe (endpoint=<url>)
 */
export async function loader({ request }: Route.LoaderArgs) {
  await requirePortalUser(request);
  return callPortalApi(request, (accessToken) =>
    apiFetch<{ publicKey: string | null }>("/portal/push/public-key", { accessToken }),
  );
}

export async function action({ request }: Route.ActionArgs) {
  await requirePortalUser(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "subscribe") {
      const subscription = JSON.parse(String(formData.get("subscription") ?? "null")) as {
        endpoint?: string;
        keys?: { p256dh?: string; auth?: string };
      } | null;
      if (!subscription?.endpoint || !subscription.keys) {
        return data({ error: "Invalid subscription." }, { status: 400 });
      }
      await callPortalApi(request, (accessToken) =>
        apiFetch("/portal/push/subscribe", {
          method: "POST",
          accessToken,
          body: {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.keys?.p256dh, auth: subscription.keys?.auth },
            userAgent: request.headers.get("user-agent")?.slice(0, 400) ?? undefined,
          },
        }),
      );
      return { ok: true };
    }

    if (intent === "unsubscribe") {
      const endpoint = String(formData.get("endpoint") ?? "");
      if (!endpoint) return data({ error: "Missing endpoint." }, { status: 400 });
      await callPortalApi(request, (accessToken) =>
        apiFetch("/portal/push/unsubscribe", {
          method: "POST",
          accessToken,
          body: { endpoint },
        }),
      );
      return { ok: true };
    }
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof SyntaxError) return data({ error: "Invalid subscription." }, { status: 400 });
    if (err instanceof ApiError) return data({ error: err.message }, { status: err.status });
    return data({ error: "Something went wrong." }, { status: 500 });
  }

  return data({ error: "Unknown intent." }, { status: 400 });
}
