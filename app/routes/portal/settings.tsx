import type { Route } from "./+types/settings";
import { apiFetch, ApiError, resolveMediaUrl } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import { AdminPageHeader } from "~/components/admin/page-header";
import { ProfileForm } from "~/components/account/profile-form";
import { ChangePasswordForm } from "~/components/account/change-password-form";
import { EmailPreferencesForm } from "~/components/account/email-preferences-form";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePortalUser(request);
  // Resolved here, not in the component — see the matching comment on
  // admin/settings.tsx's loader for why calling resolveMediaUrl from the
  // component body breaks the production build.
  return { user, avatarUrl: user.avatar ? resolveMediaUrl(user.avatar) : undefined };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "profile") {
      // The backend's ValidationPipe runs with forbidNonWhitelisted: true —
      // an "intent" field it doesn't know about would 400 the whole
      // request, not just get ignored. apiFetch passes a FormData body
      // straight through as multipart otherwise unchanged (see
      // ApiFetchOptions/apiFetchRaw in lib/api.server.ts).
      formData.delete("intent");
      await callPortalApi(request, (accessToken) =>
        apiFetch("/users/me", { method: "PATCH", accessToken, body: formData }),
      );
      return { ok: true };
    }

    if (intent === "email-preferences") {
      const categories = ["contracts", "invoices", "approvals", "changeRequests", "updates", "mentions", "digest"] as const;
      const body = Object.fromEntries(categories.map((c) => [c, formData.get(c) === "on"]));
      await callPortalApi(request, (accessToken) =>
        apiFetch("/users/me/email-preferences", { method: "PATCH", accessToken, body }),
      );
      return { ok: true };
    }

    if (intent === "change-password") {
      await callPortalApi(request, (accessToken) =>
        apiFetch("/auth/change-password", {
          method: "POST",
          accessToken,
          body: {
            currentPassword: String(formData.get("currentPassword") ?? ""),
            newPassword: String(formData.get("newPassword") ?? ""),
          },
        }),
      );
      return { ok: true };
    }

    return { error: "Unknown action." };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

export default function PortalSettings({ loaderData }: Route.ComponentProps) {
  const { user, avatarUrl } = loaderData;

  return (
    <div className="max-w-2xl">
      <AdminPageHeader title="Settings" description="Manage your profile and password." />
      <div className="space-y-6">
        <ProfileForm user={user} avatarUrl={avatarUrl} />
        <EmailPreferencesForm preferences={user.emailPreferences} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
