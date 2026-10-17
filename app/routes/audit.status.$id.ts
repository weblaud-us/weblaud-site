import type { Route } from "./+types/audit.status.$id";
import { apiFetch, ApiError, withClientContext } from "~/lib/api.server";
import type { AuditPublicResult } from "~/lib/types";

/**
 * Polled by the /audit page while Google runs Lighthouse. Proxies the public
 * GET /audits/:id (scores only — never contact details or the issue list).
 */
export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const result = await withClientContext(request, () =>
      apiFetch<AuditPublicResult>(`/audits/${encodeURIComponent(params.id)}`),
    );
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 502;
    return Response.json(
      { error: err instanceof ApiError ? err.message : "Audit unavailable" },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
