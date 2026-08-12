import type { Route } from "./+types/applicants.export";
import { apiFetchRaw, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";

/**
 * Proxies the backend's applicant CSV export. It writes CSV straight to the
 * response rather than through the API's JSON envelope, so it can't go via
 * `apiFetch` — and the browser can't call it directly either, since the admin
 * access token lives in an httpOnly session cookie this server holds.
 *
 * Resource route: no component, so the loader's Response is returned as-is.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = new URLSearchParams();
  for (const key of ["careerId", "email", "startDate", "endDate"]) {
    const value = url.searchParams.get(key);
    if (value) query.set(key, value);
  }

  const res = await callAdminApi(request, async (accessToken) => {
    const response = await apiFetchRaw(
      `/careers/admin/applicants/export/csv?${query.toString()}`,
      { accessToken },
    );
    // callAdminApi refreshes the session and retries on a 401, but only if the
    // failure surfaces as an ApiError.
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to export applicants");
    }
    return response;
  });

  return new Response(res.body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=applicants.csv",
      "Cache-Control": "no-store",
    },
  });
}
