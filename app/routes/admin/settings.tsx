import type { Route } from "./+types/settings";
import { apiFetch, ApiError, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi, requireAdminUser } from "~/lib/session.server";
import { AdminPageHeader } from "~/components/admin/page-header";
import { ProfileForm } from "~/components/account/profile-form";
import { ChangePasswordForm } from "~/components/account/change-password-form";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAdminUser(request);
  // Resolved here, not in the component — resolveMediaUrl lives in
  // api.server.ts, and calling it from the component body (rather than a
  // loader/action) pulls that whole server-only module into the client
  // bundle. React Router's Vite plugin only strips server code from
  // loader/action/middleware/headers exports, so this was a hard build
  // failure ("Server-only module referenced by client"), not just a lint
  // nit.
  return { user, avatarUrl: user.avatar ? resolveMediaUrl(user.avatar) : undefined };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "profile") {
      // See portal/settings.tsx's action for why "intent" has to be
      // stripped before this reaches the backend's ValidationPipe.
      formData.delete("intent");
      await callAdminApi(request, (accessToken) =>
        apiFetch("/users/me", { method: "PATCH", accessToken, body: formData }),
      );
      return { ok: true };
    }

    if (intent === "change-password") {
      await callAdminApi(request, (accessToken) =>
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

export default function AdminSettings({ loaderData }: Route.ComponentProps) {
  const { user, avatarUrl } = loaderData;

  return (
    <div className="max-w-2xl">
      <AdminPageHeader title="Settings" description="Manage your profile and password." />
      <div className="space-y-6">
        <ProfileForm user={user} avatarUrl={avatarUrl} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
