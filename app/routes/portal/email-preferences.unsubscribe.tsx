import { Form, Link, useActionData, useNavigation } from "react-router";
import { FiCheckCircle, FiAlertCircle, FiMail } from "react-icons/fi";
import type { Route } from "./+types/email-preferences.unsubscribe";
import SectionBadge from "~/components/ui/section-badge";
import { apiFetch, ApiError, withClientContext } from "~/lib/api.server";

const CATEGORY_LABEL: Record<string, string> = {
  all: "all email notifications",
  contracts: "contract emails",
  invoices: "invoice emails",
  approvals: "approval emails",
  changeRequests: "change request emails",
  updates: "project update emails",
  mentions: "mention emails",
  digest: "weekly summary emails",
};

/**
 * Public — no portal session. Lands here from the "Unsubscribe" link in the
 * footer of every transactional email (see NotificationService.dispatchEmail
 * for how the link is signed and users.controller.ts#unsubscribe for the
 * backend side). uid + a signed token prove who it's for; there's nothing
 * to log in to.
 *
 * Two steps on purpose: the loader only checks the link is complete, and the
 * unsubscribe happens when the recipient presses the button. Corporate mail
 * scanners (Outlook Safe Links and friends) open every link in an email, so
 * unsubscribing on page load turned people's notifications off without them
 * ever clicking anything.
 */
export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");
  const token = url.searchParams.get("token");
  const category = url.searchParams.get("category") ?? "all";

  if (!uid || !token) {
    return { valid: false as const, uid: "", token: "", category };
  }
  return { valid: true as const, uid, token, category };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const uid = String(formData.get("uid") ?? "");
  const token = String(formData.get("token") ?? "");
  const category = String(formData.get("category") ?? "all");

  try {
    await withClientContext(request, () =>
      apiFetch<{ category: string }>(
        `/users/email-preferences/unsubscribe?${new URLSearchParams({ uid, token, category })}`,
        { method: "POST" },
      ),
    );
    return { ok: true as const };
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
    return { ok: false as const, error: message };
  }
}

export default function UnsubscribeEmailPreferences({ loaderData }: Route.ComponentProps) {
  const { valid, uid, token, category } = loaderData;
  const actionData = useActionData<typeof action>();
  const isSubmitting = useNavigation().state === "submitting";
  const label = CATEGORY_LABEL[category] ?? "these emails";

  return (
    <div className="min-h-screen relative bg-black text-white flex flex-col justify-center items-center px-4 py-12 overflow-hidden selection:bg-primary selection:text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="w-full max-w-sm relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#0055b3] p-[1px] shadow-[0_0_25px_rgba(10,132,255,0.3)]">
            <div className="w-full h-full rounded-[15px] bg-[#0c1220] flex items-center justify-center text-primary">
              <FiMail className="w-5 h-5" />
            </div>
          </div>
          <SectionBadge icon={<FiMail className="w-3.5 h-3.5 text-primary" />} text="Email preferences" color="#0a84ff" />
        </div>

        <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {!valid ? (
            <ErrorNote message="This link is missing required information." />
          ) : actionData?.ok ? (
            <div className="space-y-3">
              <FiCheckCircle className="w-8 h-8 mx-auto text-primary" />
              <h1 className="text-xl font-bold font-barlow text-white">You're unsubscribed</h1>
              <p className="text-gray-400 font-barlow text-sm">
                You won't receive {label} anymore. In-app notifications in the portal are unaffected.
              </p>
              <Link to="/portal/login" className="inline-block text-sm text-primary hover:underline pt-2">
                Manage all preferences in Settings
              </Link>
            </div>
          ) : (
            <Form method="post" className="space-y-4">
              <input type="hidden" name="uid" value={uid} />
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="category" value={category} />
              <h1 className="text-xl font-bold font-barlow text-white">Unsubscribe?</h1>
              <p className="text-gray-400 font-barlow text-sm">
                Stop receiving {label} from the WebLaud portal.
              </p>
              {actionData && !actionData.ok && <ErrorNote message={actionData.error} />}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-[10px] text-sm font-semibold font-barlow text-white bg-[#0A84FF] hover:bg-[#0070e0] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Unsubscribing…" : "Confirm unsubscribe"}
              </button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm font-barlow text-left">
      <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
