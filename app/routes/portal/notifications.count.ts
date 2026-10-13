import type { Route } from "./+types/notifications.count";
import { apiFetch } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";

/**
 * Cheap poll target for the bell badge (see PortalLayout's polling effect) —
 * a dedicated resource route so polling doesn't have to re-fetch all 100
 * notification rows (and the review-queue count) just to learn the unread
 * count changed.
 */
export async function loader({ request }: Route.LoaderArgs) {
  await requirePortalUser(request);
  return callPortalApi(request, (accessToken) =>
    apiFetch<{ unread: number }>("/portal/notifications/count", { accessToken }),
  );
}
