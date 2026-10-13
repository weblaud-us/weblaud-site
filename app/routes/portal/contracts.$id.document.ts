import type { Route } from "./+types/contracts.$id.document";
import { apiFetchRaw, ApiError } from "~/lib/api.server";
import { callPortalApi } from "~/lib/portal.server";

/**
 * Proxies the backend's authenticated contract document stream. Deliberately
 * not a plain link to a storage URL — see ContractService.streamDocument on
 * the backend for why: the document used to be served from a bare,
 * unauthenticated S3/local URL with no expiry and no access check.
 */
export async function loader({ request, params }: Route.LoaderArgs) {
  const res = await callPortalApi(request, async (accessToken) => {
    const response = await apiFetchRaw(`/portal/contracts/${params.id}/document`, { accessToken });
    if (!response.ok) throw new ApiError(response.status, "Failed to load document");
    return response;
  });

  return new Response(res.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=contract-${params.id}.pdf`,
      "Cache-Control": "no-store",
    },
  });
}
