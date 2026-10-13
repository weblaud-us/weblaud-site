import type { Route } from "./+types/invoices.$id.pdf";
import { apiFetchRaw, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";

/**
 * Proxies the backend's invoice PDF. Same reasoning as applicants.export.ts:
 * the PDF isn't JSON-enveloped so it can't go through apiFetch, and the
 * browser can't call the backend directly since the admin access token lives
 * in an httpOnly session cookie this server holds. Admin's role always
 * passes InvoiceService's access check, same as any other admin read.
 */
export async function loader({ request, params }: Route.LoaderArgs) {
  const res = await callAdminApi(request, async (accessToken) => {
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
