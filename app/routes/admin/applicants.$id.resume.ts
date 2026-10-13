import type { Route } from "./+types/applicants.$id.resume";
import { apiFetchRaw, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";

/**
 * Proxies an applicant's CV from the backend's admin-only stream (see
 * CareerController.resume). The old "Open" link pointed straight at the
 * stored Cloudinary URL, which was public and downloaded as an extensionless
 * file the OS couldn't open; the backend now supplies a real filename and
 * content type, which are passed through unchanged. `?download=1` forces a
 * download instead of the browser's PDF viewer.
 */
export async function loader({ request, params }: Route.LoaderArgs) {
  const download = new URL(request.url).searchParams.get("download") === "1";

  const res = await callAdminApi(request, async (accessToken) => {
    const response = await apiFetchRaw(
      `/careers/applications/${params.id}/resume${download ? "?download=1" : ""}`,
      { accessToken },
    );
    if (!response.ok) throw new ApiError(response.status, "Failed to load résumé");
    return response;
  });

  const headers = new Headers({
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  for (const name of ["content-type", "content-disposition", "content-length"]) {
    const value = res.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(res.body, { headers });
}
