import { useFetcher } from "react-router";
import type { Route } from "./+types/sentry-test";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi, requireAdminUser } from "~/lib/session.server";
import { AdminPageHeader } from "~/components/admin/page-header";
import { Button } from "~/components/ui/button";

/**
 * Admin-only: sends a deliberate error to Sentry from the website and from
 * the backend, to prove monitoring works after SENTRY_DSN is set. Not linked
 * from the nav — open /cpadmin/sentry-test directly.
 */
export async function loader({ request }: Route.LoaderArgs) {
  await requireAdminUser(request);
  return { siteMonitoringOn: !!process.env.SENTRY_DSN?.trim() };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdminUser(request);
  const intent = String((await request.formData()).get("intent"));

  if (intent === "site") {
    // Deliberately uncaught: it goes through entry.server.tsx's handleError
    // to Sentry, and you see the real 500 page a visitor would see.
    throw new Error("Sentry test error from the website — sent on purpose from /cpadmin/sentry-test");
  }

  if (intent === "backend") {
    try {
      await callAdminApi(request, (accessToken) =>
        apiFetch("/monitoring/test-error", { method: "POST", accessToken }),
      );
      return { message: "The backend didn't fail — is it running the latest code?" };
    } catch (err) {
      if (err instanceof Response) throw err;
      if (err instanceof ApiError && err.status === 500) {
        return { message: "The backend failed on purpose (500). It should appear in Sentry within a minute." };
      }
      return { message: `Unexpected response: ${err instanceof ApiError ? err.status : "network error"}` };
    }
  }

  return { message: "Unknown action." };
}

export default function SentryTest({ loaderData }: Route.ComponentProps) {
  const { siteMonitoringOn } = loaderData;
  const backend = useFetcher<typeof action>();

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Error monitoring test"
        description="Sends a deliberate error to Sentry so you can check reporting works."
      />

      <p className="text-sm text-white/60 mb-6">
        Website monitoring is{" "}
        <strong className={siteMonitoringOn ? "text-emerald-400" : "text-amber-400"}>
          {siteMonitoringOn ? "on" : "off (SENTRY_DSN is not set in the website's .env)"}
        </strong>
        . The backend has its own SENTRY_DSN in its .env.
      </p>

      <div className="space-y-4">
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-medium text-white">Website</h2>
          <p className="text-sm text-white/50 mt-1 mb-3">
            Shows the error page a visitor would see. With monitoring on, it says the team has been notified.
          </p>
          <form method="post">
            <input type="hidden" name="intent" value="site" />
            <Button type="submit" size="sm">
              Send website test error
            </Button>
          </form>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-medium text-white">Backend (API)</h2>
          <p className="text-sm text-white/50 mt-1 mb-3">Asks the API to fail on purpose.</p>
          <backend.Form method="post">
            <input type="hidden" name="intent" value="backend" />
            <Button type="submit" size="sm" disabled={backend.state !== "idle"}>
              {backend.state !== "idle" ? "Sending..." : "Send backend test error"}
            </Button>
          </backend.Form>
          {backend.data?.message && (
            <p role="status" className="text-sm text-white/70 mt-3">
              {backend.data.message}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
