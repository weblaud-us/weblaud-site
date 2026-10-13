import { redirect } from "react-router";
import type { Route } from "./+types/invoices.$id";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi } from "~/lib/portal.server";

/**
 * /portal/invoices/:id is where every invoice notification (sent, overdue,
 * paid, retainer) has always linked, but invoices are shown on their
 * project's Invoices tab — there is no standalone invoice page. Looks the
 * invoice up (access-checked by the backend) and forwards there, keeping any
 * query string such as ?paid=1 from a Stripe return.
 */
export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const invoice = await callPortalApi(request, (accessToken) =>
      apiFetch<{ project: { _id: string } | string }>(`/portal/invoices/${params.id}`, {
        accessToken,
      }),
    );
    const projectId = typeof invoice.project === "string" ? invoice.project : invoice.project._id;
    const { search } = new URL(request.url);
    return redirect(`/portal/projects/${projectId}/invoices${search}`);
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError && (err.status === 403 || err.status === 404)) {
      // Not theirs or gone — the billing overview is the most useful landing.
      return redirect("/portal/billing");
    }
    throw err;
  }
}
