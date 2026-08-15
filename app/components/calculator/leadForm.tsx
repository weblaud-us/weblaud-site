import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FiAlertCircle, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import type { EstimateSelection } from "~/lib/calculator";

interface LeadFormFields {
  name: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
  /** Honeypot — hidden from humans, irresistible to bots. */
  website: string;
}

interface LeadFormProps {
  selection: EstimateSelection;
  /** Fires once the estimate has been recorded, to reveal the booking CTA. */
  onSubmitted: () => void;
  submitted: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" aria-hidden="true" />
      <p className="text-red-400 text-xs font-barlow">{message}</p>
    </div>
  );
}

export function LeadForm({ selection, onSubmitted, submitted }: LeadFormProps) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSending = fetcher.state !== "idle";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormFields>();

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;

    if (fetcher.data.ok) {
      toast.success("Estimate sent — we'll be in touch shortly.");
      onSubmitted();
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data, onSubmitted]);

  const onValid = (data: LeadFormFields) => {
    fetcher.submit(
      {
        ...data,
        projectTypeId: selection.projectTypeId,
        featureIds: selection.featureIds.join(","),
        speedId: selection.speedId,
      },
      { method: "post" },
    );
  };

  if (submitted) {
    return (
      <div className="mt-8 text-center" role="status">
        <div className="inline-flex items-center gap-2 text-emerald-400 font-barlow font-semibold text-sm">
          <FiCheckCircle aria-hidden="true" />
          <span>Estimate saved. A copy is on its way to our team.</span>
        </div>
        <p className="text-xs text-gray-400 font-barlow mt-2">
          Want to move faster? Book a call and we'll walk through this scope
          together.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="mt-8 pt-8 border-t border-white/10 text-left"
    >
      <h4 className="text-base font-bold font-barlow text-white">
        Send me this estimate
      </h4>
      <p className="text-xs text-gray-400 font-barlow mt-1 mb-5">
        We'll save your scope so the first call starts where you left off.
      </p>

      {/* Honeypot: off-screen rather than display:none so bots still fill it. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="estimate-name">Name</Label>
          <Input
            id="estimate-name"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            className={`mt-1.5 ${errors.name ? "border-red-500" : ""}`}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="estimate-email">Work email</Label>
          <Input
            id="estimate-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            className={`mt-1.5 ${errors.email ? "border-red-500" : ""}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="estimate-company">
            Company <span className="text-gray-500">(optional)</span>
          </Label>
          <Input
            id="estimate-company"
            autoComplete="organization"
            className="mt-1.5"
            {...register("company")}
          />
        </div>

        <div>
          <Label htmlFor="estimate-phone">
            Phone <span className="text-gray-500">(optional)</span>
          </Label>
          <Input
            id="estimate-phone"
            type="tel"
            autoComplete="tel"
            className="mt-1.5"
            {...register("phone")}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="estimate-notes">
            Anything else we should know?{" "}
            <span className="text-gray-500">(optional)</span>
          </Label>
          <Textarea
            id="estimate-notes"
            className="mt-1.5 h-20"
            {...register("notes")}
          />
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button
          type="submit"
          disabled={isSending}
          className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-barlow font-semibold text-xs sm:text-sm px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 shadow-md shadow-blue-500/25 hover:scale-[1.02] cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
        >
          <span>{isSending ? "Sending..." : "Send Me This Estimate"}</span>
          {!isSending && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
              <FiArrowRight className="w-3 h-3 text-white -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
