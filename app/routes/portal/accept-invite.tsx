import { useState } from "react";
import { Form, redirect, useActionData, useNavigation, useSearchParams } from "react-router";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import type { Route } from "./+types/accept-invite";
import SectionBadge from "~/components/ui/section-badge";
import { apiFetch, ApiError, withClientContext } from "~/lib/api.server";
import { createPortalSession } from "~/lib/portal.server";

/**
 * Lands here from the invite email's link: /portal/accept-invite?uid=&token=.
 * The uid/token pair is single-use and expires (see UsersService.issueInvite
 * / AuthService.acceptInvite on the backend) — this form just collects the
 * password and hands both straight to POST /auth/accept-invite.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");
  const token = url.searchParams.get("token");

  if (!uid || !token) {
    return { invalidLink: true as const };
  }
  return { invalidLink: false as const };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const uid = String(formData.get("uid") ?? "");
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    // Visitor IP forwarded so the token-guess rate limit is per visitor.
    const result = await withClientContext(request, () => apiFetch<{
      user: { email: string };
      accessToken: string;
      refreshToken: string;
    }>("/auth/accept-invite", {
      method: "POST",
      body: { uid, token, password },
    }));

    const cookie = await createPortalSession(result, result.user.email);
    throw redirect("/portal", { headers: { "Set-Cookie": cookie } });
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Something went wrong. Please try again." };
  }
}

export default function AcceptInvite({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  return (
    <div className="min-h-screen relative bg-black text-white flex flex-col justify-center items-center px-4 py-12 overflow-hidden selection:bg-primary selection:text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="w-full max-w-sm relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#0055b3] p-[1px] shadow-[0_0_25px_rgba(10,132,255,0.3)]">
            <div className="w-full h-full rounded-[15px] bg-[#0c1220] flex items-center justify-center text-primary">
              <FiCheckCircle className="w-5 h-5" />
            </div>
          </div>

          <SectionBadge
            icon={<FiLock className="w-3.5 h-3.5 text-primary" />}
            text="Accept Invite"
            color="#0a84ff"
          />

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-barlow text-white tracking-tight">
              Set your password
            </h1>
            <p className="text-gray-400 font-barlow text-xs sm:text-sm">
              Create a password to finish setting up your portal account.
            </p>
          </div>
        </div>

        <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {loaderData.invalidLink ? (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm font-barlow">
              <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                This invite link is missing required information. Ask your
                project manager to resend it.
              </span>
            </div>
          ) : (
            <Form method="post" className="space-y-4">
              <input type="hidden" name="uid" value={uid} />
              <input type="hidden" name="token" value={token} />

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-mono uppercase tracking-wider text-gray-400 font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl pl-10 pr-11 py-2.5 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-mono uppercase tracking-wider text-gray-400 font-medium"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl pl-10 pr-4 py-2.5 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {actionData?.error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-barlow">
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{actionData.error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group/btn relative h-11 px-4 rounded-xl text-sm font-semibold font-barlow text-white bg-gradient-to-r from-[#0a84ff] to-[#0070e0] border border-[#0a84ff]/50 shadow-[0_2px_14px_rgba(10,132,255,0.35)] hover:shadow-[0_4px_22px_rgba(10,132,255,0.5)] hover:-translate-y-[1px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSubmitting ? "Setting up your account..." : "Activate account"}
              </button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
