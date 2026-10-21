import { redirect, type LoaderFunctionArgs } from "react-router";
import { sectionIndexRedirect } from "~/lib/portal-paths";
import { requestPageUrl } from "~/lib/request-url";

/** A bare tab URL (/work, /decisions, /billing) lands on the tab's first sub-page. */
export async function loader({ request }: LoaderFunctionArgs) {
  const to = sectionIndexRedirect(requestPageUrl(request));
  if (!to) throw new Response("Not found", { status: 404 });
  return redirect(to);
}
