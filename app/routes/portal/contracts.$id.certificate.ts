import type { Route } from "./+types/contracts.$id.certificate";
import { apiFetchRaw, ApiError } from "~/lib/api.server";
import { callPortalApi } from "~/lib/portal.server";

/** Proxies the backend's contract acceptance certificate PDF for the portal. */
export async function loader({ request, params }: Route.LoaderArgs) {
  const res = await callPortalApi(request, async (accessToken) => {
    const response = await apiFetchRaw(`/portal/contracts/${params.id}/certificate.pdf`, { accessToken });
    if (!response.ok) throw new ApiError(response.status, "Failed to load certificate");
    return response;
  });

  return new Response(res.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=contract-${params.id}-certificate.pdf`,
      "Cache-Control": "no-store",
    },
  });
}
