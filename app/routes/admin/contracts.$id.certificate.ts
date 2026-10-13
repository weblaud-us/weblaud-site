import type { Route } from "./+types/contracts.$id.certificate";
import { apiFetchRaw, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";

/** Proxies the backend's contract acceptance certificate PDF. See invoices.$id.pdf.ts for why this can't be a direct browser link. */
export async function loader({ request, params }: Route.LoaderArgs) {
  const res = await callAdminApi(request, async (accessToken) => {
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
