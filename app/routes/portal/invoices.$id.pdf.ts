import type { Route } from "./+types/invoices.$id.pdf";
import { apiFetchRaw, ApiError } from "~/lib/api.server";
import { callPortalApi } from "~/lib/portal.server";

/** Proxies the backend's invoice PDF for the portal — see admin/invoices.$id.pdf.ts for why this can't be a direct browser link. */
export async function loader({ request, params }: Route.LoaderArgs) {
  const res = await callPortalApi(request, async (accessToken) => {
    const response = await apiFetchRaw(`/portal/invoices/${params.id}/pdf`, { accessToken });
    if (!response.ok) throw new ApiError(response.status, "Failed to load invoice PDF");
    return response;
  });

  return new Response(res.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${params.id}.pdf`,
      "Cache-Control": "no-store",
    },
  });
}
