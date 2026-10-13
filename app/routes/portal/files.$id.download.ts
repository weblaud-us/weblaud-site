import type { Route } from "./+types/files.$id.download";
import { apiFetchRaw, ApiError } from "~/lib/api.server";
import { callPortalApi } from "~/lib/portal.server";

/** Proxies the backend's authenticated file stream — see invoices.$id.pdf.ts for why this can't be a direct browser link (the browser never holds the access token). */
export async function loader({ request, params }: Route.LoaderArgs) {
  const res = await callPortalApi(request, async (accessToken) => {
    const response = await apiFetchRaw(`/portal/files/${params.id}/download`, { accessToken });
    if (!response.ok) throw new ApiError(response.status, "Failed to download file");
    return response;
  });

  const headers = new Headers({ "Cache-Control": "no-store" });
  const contentType = res.headers.get("content-type");
  const contentDisposition = res.headers.get("content-disposition");
  if (contentType) headers.set("Content-Type", contentType);
  if (contentDisposition) headers.set("Content-Disposition", contentDisposition);

  return new Response(res.body, { headers });
}
