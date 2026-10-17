import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FiAlertCircle, FiMail } from "react-icons/fi";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Turnstile, TurnstileStatus, useTurnstile } from "~/components/ui/turnstile";
import { HEARD_ABOUT_OPTIONS } from "~/lib/leads";
import { track } from "~/lib/analytics";

interface ClaimFields {
  name: string;
  email: string;
  company: string;
  heardAbout: string;
  /** Honeypot — hidden from humans, irresistible to bots. */
  website: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1 text-red-400 text-xs font-barlow">
      <FiAlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

/**
 * The gate: contact details in exchange for the full issue list and fix plan
 * by email. This is the moment the anonymous audit becomes a lead.
 */
export function AuditClaimForm({
  auditId,
  issueCount,
  onClaimed,
}: {
  auditId: string;
  issueCount: number;
  onClaimed: (email: string) => void;
}) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const captcha = useTurnstile();
  const sending = fetcher.state !== "idle";
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ClaimFields>();

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (fetcher.data.ok) {
      track("generate_lead", {
        form: "audit",
        heard_about: getValues("heardAbout") || undefined,
      });
      onClaimed(getValues("email"));
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data, onClaimed, getValues]);

  const onValid = (data: ClaimFields) => {
    fetcher.submit(
      { ...data, intent: "claim", id: auditId, captchaToken: captcha.token ?? "" },
      { method: "post" },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-[#0c1424] via-[#090e1a] to-[#070707] p-5 sm:p-7"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
          <FiMail className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-barlow text-white">
            {issueCount > 0
              ? `Get all ${issueCount} issue${issueCount === 1 ? "" : "s"} and a fix plan`
              : "Get the full report by email"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 font-barlow mt-1">
            We'll email the complete report — every issue, ranked by impact, with
            what we'd fix first. Free, no obligation, no mailing list.
          </p>
        </div>
      </div>

      {/* Honeypot: off-screen rather than display:none so bots still fill it. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="audit-website">Website</label>
        <input id="audit-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="audit-name">Name</Label>
          <Input
            id="audit-name"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            className={`mt-1.5 ${errors.name ? "border-red-500" : ""}`}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
              maxLength: { value: 100, message: "Name is too long" },
            })}
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="audit-email">Work email</Label>
          <Input
            id="audit-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            className={`mt-1.5 ${errors.email ? "border-red-500" : ""}`}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Enter a valid email address" },
            })}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="audit-company">
            Company <span className="text-gray-500">(optional)</span>
          </Label>
          <Input
            id="audit-company"
            autoComplete="organization"
            className="mt-1.5"
            {...register("company", { maxLength: 150 })}
          />
        </div>
        <div>
          <Label htmlFor="audit-heard-about">
            How did you hear about us? <span className="text-gray-500">(optional)</span>
          </Label>
          <Select
            id="audit-heard-about"
            defaultValue=""
            className="mt-1.5 w-full py-2.5"
            {...register("heardAbout")}
          >
            <option value="">Select one…</option>
            {HEARD_ABOUT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Turnstile
        siteKey={captcha.siteKey}
        onToken={captcha.onToken}
        onError={captcha.onError}
        resetKey={fetcher.data}
        action="audit-claim"
        className="mt-4"
      />

      <button
        type="submit"
        disabled={sending || !captcha.ready}
        className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-solid hover:bg-primary-solid-hover text-white font-barlow font-semibold text-sm px-6 py-3 rounded-full transition-all duration-300 shadow-md shadow-blue-500/25 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
      >
        {sending ? "Sending…" : "Email me the full report"}
      </button>
      <TurnstileStatus {...captcha} />
    </form>
  );
}
