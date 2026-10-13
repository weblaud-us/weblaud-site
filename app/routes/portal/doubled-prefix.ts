import { redirect } from "react-router";
import type { Route } from "./+types/doubled-prefix";

/**
 * Notification emails sent before the backend's URL fix joined PORTAL_URL
 * (".../portal") with a link that already started with "/portal/", producing
 * /portal/portal/... Strips the extra prefix so those links still work.
 */
export function loader({ request, params }: Route.LoaderArgs) {
  const { search } = new URL(request.url);
  return redirect(`/portal/${params["*"] ?? ""}${search}`);
}
