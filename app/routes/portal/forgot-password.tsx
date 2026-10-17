import { Form, Link, redirect, useActionData, useNavigation, useSearchParams } from "react-router";
import { FiMail, FiLock, FiHash, FiChevronLeft, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import type { Route } from "./+types/forgot-password";
import SectionBadge from "~/components/ui/section-badge";
import weblaudLogo from "~/assets/weblaud-logo.svg";
import { apiFetch, ApiError, withClientContext } from "~/lib/api.server";

/**
 * Self-service password reset for portal clients, staff and the admin — all
 * accounts share /auth. Three steps on the existing endpoints:
 *   email → POST /auth/send-otp (same reply whether or not the account exists)
 *   code  → POST /auth/verify-otp (5 wrong codes discard it; see UsersService.verifyOtp)
 *   new password → POST /auth/reset-password, then back to the right login.
 */

/** Where the reset sends people afterwards. Anything else falls back to the portal. */
const LOGIN_PATHS = { portal: "/portal/login", admin: "/cpadmin/login" } as const;
type From = keyof typeof LOGIN_PATHS;
const parseFrom = (value: unknown): From => (value === "admin" ? "admin" : "portal");

const MIN_PASSWORD_LENGTH = 8; // ResetPasswordDto's @MinLength

type Step = "email" | "code" | "password";
type ActionData = { step: Step; email?: string; otp?: string; error?: string; notice?: string };

export function meta() {
  return [{ title: "Reset your password – Weblaud" }, { name: "robots", content: "noindex" }];
}

export async function action({ request }: Route.ActionArgs): Promise<ActionData> {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const email = String(formData.get("email") ?? "").trim();
  const otp = String(formData.get("otp") ?? "").trim();
  const from = parseFrom(formData.get("from"));
  const call = (path: string, body: Record<string, string>) =>
    withClientContext(request, () => apiFetch(path, { method: "POST", body }));

  try {
    if (intent === "send") {
      await call("/auth/send-otp", { email });
      return {
        step: "code",
        email,
        notice: "If that address has an account, a 6-digit code is on its way. It expires shortly.",
      };
    }

    if (intent === "verify") {
      await call("/auth/verify-otp", { email, otp });
      return { step: "password", email, otp };
    }

    if (intent === "reset") {
      const newPassword = String(formData.get("newPassword") ?? "");
      if (newPassword.length < MIN_PASSWORD_LENGTH) {
        return { step: "password", email, otp, error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
      }
      if (newPassword !== String(formData.get("confirmPassword") ?? "")) {
        return { step: "password", email, otp, error: "The two passwords don't match." };
      }
      await call("/auth/reset-password", { email, otp, newPassword });
      throw redirect(`${LOGIN_PATHS[from]}?reset=1`);
    }
  } catch (err) {
    if (err instanceof Response) throw err;
    const message =
      err instanceof ApiError && err.status === 429
        ? "Too many attempts. Wait a minute and try again."
        : err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
    // A failed send stays on the email step. A bad or expired code, whether
    // caught at verify or at the final reset, goes back to entering the code.
    const step: Step = intent === "send" ? "email" : "code";
    return { step, email, error: message };
  }

  return { step: "email" };
}

const INPUT =
  "w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl pl-10 pr-4 py-2.5 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200";
const LABEL = "block text-xs font-mono uppercase tracking-wider text-gray-400 font-medium";
const SUBMIT =
  "group/btn w-full h-11 px-4 rounded-xl text-sm font-semibold font-barlow text-white bg-primary-solid hover:bg-primary-solid-hover transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

function Field({
  id,
  label,
  icon,
  ...input
}: { id: string; label: string; icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
          {icon}
        </div>
        <input id={id} name={id} className={INPUT} required {...input} />
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const from = parseFrom(searchParams.get("from"));
  const busy = navigation.state !== "idle";
  const step: Step = data?.step ?? "email";

  return (
    <div className="dark min-h-screen relative bg-black text-white flex flex-col justify-center items-center px-4 py-12">
      <main className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <img src={weblaudLogo} alt="Weblaud" className="h-9 w-auto" />
          <SectionBadge
            icon={<FiLock className="w-3.5 h-3.5 text-primary" />}
            text="Account"
            badgeLabel="Reset password"
            color="#0a84ff"
          />
          <h1 className="text-2xl sm:text-3xl font-bold font-barlow tracking-tight">Reset your password</h1>
          <p className="text-gray-400 font-barlow text-xs sm:text-sm">
            {step === "email" && "Enter the email you sign in with and we'll send you a 6-digit code."}
            {step === "code" && `Enter the code sent to ${data?.email || "your email"}.`}
            {step === "password" && "Choose a new password."}
          </p>
        </div>

        <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          <Form method="post" className="space-y-4">
            <input type="hidden" name="from" value={from} />

            {step === "email" && (
              <>
                <input type="hidden" name="intent" value="send" />
                <Field
                  id="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  defaultValue={data?.email}
                  icon={<FiMail className="w-4 h-4" />}
                />
              </>
            )}

            {step === "code" && (
              <>
                <input type="hidden" name="intent" value="verify" />
                <input type="hidden" name="email" value={data?.email ?? ""} />
                <Field
                  id="otp"
                  label="6-digit code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="123456"
                  icon={<FiHash className="w-4 h-4" />}
                />
              </>
            )}

            {step === "password" && (
              <>
                <input type="hidden" name="intent" value="reset" />
                <input type="hidden" name="email" value={data?.email ?? ""} />
                <input type="hidden" name="otp" value={data?.otp ?? ""} />
                <Field
                  id="newPassword"
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  icon={<FiLock className="w-4 h-4" />}
                />
                <Field
                  id="confirmPassword"
                  label="Confirm new password"
                  type="password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  icon={<FiLock className="w-4 h-4" />}
                />
              </>
            )}

            {data?.notice && !data.error && (
              <p role="status" className="text-xs text-gray-400 font-barlow">
                {data.notice}
              </p>
            )}
            {data?.error && (
              <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-barlow">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{data.error}</span>
              </div>
            )}

            <button type="submit" disabled={busy} className={SUBMIT}>
              <span>
                {busy
                  ? "Please wait…"
                  : step === "email"
                    ? "Send code"
                    : step === "code"
                      ? "Verify code"
                      : "Set new password"}
              </span>
              {!busy && <FiArrowRight className="w-4 h-4" />}
            </button>
          </Form>

          <div className="mt-5 flex items-center justify-between text-xs font-barlow">
            <Link
              to={LOGIN_PATHS[from]}
              className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <FiChevronLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
            {step === "code" && (
              <Link to={`?from=${from}`} reloadDocument className="text-primary hover:underline">
                Start over
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
