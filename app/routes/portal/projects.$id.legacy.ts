import { redirect, type LoaderFunctionArgs } from "react-router";
import { legacyProjectRedirect } from "~/lib/portal-paths";
import { requestPageUrl } from "~/lib/request-url";

/**
 * Permanent redirects from the pre-2026-10 flat project tabs (/tasks,
 * /approvals, /change-requests, /requests, /invoices, /contract) to their
 * place in the eight-tab layout. (/discussion keeps its URL, so it needs no
 * redirect.) Notification links in the database and in emails already sent
 * still use the old paths, so these routes must stay. Registered once per
 * old tab in app/routes.ts. No session check: the target page does its own.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const to = legacyProjectRedirect(requestPageUrl(request));
  if (!to) throw new Response("Not found", { status: 404 });
  return redirect(to, 301);
}
