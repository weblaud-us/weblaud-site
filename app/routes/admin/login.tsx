import { useState } from "react";
import { Form, redirect, useActionData, useNavigation, Link } from "react-router";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiChevronLeft,
  FiLogIn,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import type { Route } from "./+types/login";
import SectionBadge from "~/components/ui/section-badge";
import { apiFetch, ApiError } from "~/lib/api.server";
import { createAdminSession, getSession } from "~/lib/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (session.get("accessToken")) {
    throw redirect("/cpadmin");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const result = await apiFetch<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    const cookie = await createAdminSession(result, email);
    throw redirect("/cpadmin", { headers: { "Set-Cookie": cookie } });
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Invalid email or password. Please try again." };
  }
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen relative bg-black text-white flex flex-col justify-center items-center px-4 py-12 overflow-hidden selection:bg-primary selection:text-white">
      {/* Ambient background soft glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="w-full max-w-sm relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#0055b3] p-[1px] shadow-[0_0_25px_rgba(10,132,255,0.3)]">
            <div className="w-full h-full rounded-[15px] bg-[#0c1220] flex items-center justify-center text-primary">
              <FiShield className="w-5 h-5" />
            </div>
          </div>

          <SectionBadge
            icon={<FiLock className="w-3.5 h-3.5 text-primary" />}
            text="Control Panel"
            badgeLabel="Restricted"
            color="#0a84ff"
          />

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-barlow text-white tracking-tight">
              Admin Login
            </h1>
            <p className="text-gray-400 font-barlow text-xs sm:text-sm">
              Sign in to manage weblaud.com content and operations.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle top primary highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <Form method="post" className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-mono uppercase tracking-wider text-gray-400 font-medium"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@weblaud.com"
                  required
                  autoComplete="email"
                  className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl pl-10 pr-4 py-2.5 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
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

            {/* Error Message */}
            {actionData?.error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-barlow">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionData.error}</span>
              </div>
            )}

            {/* Action Buttons Side-by-Side */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/"
                className="group relative h-11 px-4 rounded-xl text-xs sm:text-sm font-medium font-barlow text-gray-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <FiChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300 shrink-0" />
                <span>Back</span>
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group/btn relative h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold font-barlow text-white bg-gradient-to-r from-[#0a84ff] to-[#0070e0] border border-[#0a84ff]/50 shadow-[0_2px_14px_rgba(10,132,255,0.35)] hover:shadow-[0_4px_22px_rgba(10,132,255,0.5)] hover:-translate-y-[1px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
                {!isSubmitting && (
                  <FiLogIn className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-all duration-300 shrink-0" />
                )}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
