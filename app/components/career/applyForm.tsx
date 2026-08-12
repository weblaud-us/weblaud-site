import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import {
  FiAlertCircle,
  FiFileText,
  FiMail,
  FiPhone,
  FiSend,
  FiUser,
} from "react-icons/fi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// Mirrors the server-side multer cap on POST /careers/:id/apply so an oversized
// file is caught before it is uploaded rather than after.
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ["pdf", "doc", "docx"];

type ApplyFormValues = {
  name: string;
  email: string;
  phone: string;
  interestReason: string;
  coverLetter: string;
  resume: FileList;
};

interface ApplyFormProps {
  careerId: string;
  /** Called after a successful submit, so a host dialog can close itself. */
  onSuccess?: () => void;
}

const ApplyForm = ({ careerId, onSuccess }: ApplyFormProps) => {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSending = fetcher.state !== "idle";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyFormValues>();

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;

    if (fetcher.data.ok) {
      toast.success("Application submitted! We'll be in touch.");
      reset();
      onSuccess?.();
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data, reset, onSuccess]);

  const onSubmit = (data: ApplyFormValues) => {
    const body = new FormData();
    body.set("careerId", careerId);
    body.set("name", data.name);
    body.set("email", data.email);
    body.set("phone", data.phone);
    body.set("interestReason", data.interestReason ?? "");
    body.set("coverLetter", data.coverLetter ?? "");
    body.set("resume", data.resume[0]);

    // encType matters: without it the fetcher URL-encodes the body and the
    // file never leaves the browser.
    fetcher.submit(body, { method: "post", encType: "multipart/form-data" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="group/input">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
              <FiUser className="w-4 h-4 text-white/40 group-hover/input:text-primary transition-colors duration-300" />
            </div>
            <Input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`pl-10 transition-all duration-300 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.name && (
            <div className="flex items-center gap-1.5 mt-1">
              <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
              <p className="text-red-400 text-xs font-barlow">
                {errors.name.message}
              </p>
            </div>
          )}
        </div>

        <div className="group/input">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
              <FiMail className="w-4 h-4 text-white/40 group-hover/input:text-primary transition-colors duration-300" />
            </div>
            <Input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`pl-10 transition-all duration-300 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-1.5 mt-1">
              <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
              <p className="text-red-400 text-xs font-barlow">
                {errors.email.message}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="group/input">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
            <FiPhone className="w-4 h-4 text-white/40 group-hover/input:text-primary transition-colors duration-300" />
          </div>
          <Input
            type="tel"
            placeholder="Phone Number"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[+\d][\d\s-]{7,19}$/,
                message: "Enter a valid phone number",
              },
            })}
            className={`pl-10 transition-all duration-300 ${
              errors.phone ? "border-red-500" : ""
            }`}
          />
        </div>
        {errors.phone && (
          <div className="flex items-center gap-1.5 mt-1">
            <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            <p className="text-red-400 text-xs font-barlow">
              {errors.phone.message}
            </p>
          </div>
        )}
      </div>

      <div className="group/input">
        <Textarea
          placeholder="Why are you interested in this role?"
          rows={3}
          {...register("interestReason", {
            maxLength: {
              value: 1000,
              message: "Please keep this under 1000 characters",
            },
          })}
          className={`transition-all duration-300 ${
            errors.interestReason ? "border-red-500" : ""
          }`}
        />
        {errors.interestReason && (
          <div className="flex items-center gap-1.5 mt-1">
            <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            <p className="text-red-400 text-xs font-barlow">
              {errors.interestReason.message}
            </p>
          </div>
        )}
      </div>

      <div className="group/input">
        <Textarea
          placeholder="Cover letter (optional)"
          rows={5}
          {...register("coverLetter", {
            maxLength: {
              value: 3000,
              message: "Please keep your cover letter under 3000 characters",
            },
          })}
          className={`transition-all duration-300 ${
            errors.coverLetter ? "border-red-500" : ""
          }`}
        />
        {errors.coverLetter && (
          <div className="flex items-center gap-1.5 mt-1">
            <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            <p className="text-red-400 text-xs font-barlow">
              {errors.coverLetter.message}
            </p>
          </div>
        )}
      </div>

      <div className="group/input">
        <label
          htmlFor="resume"
          className="flex items-center gap-2 text-sm font-barlow text-white mb-2"
        >
          <FiFileText className="w-4 h-4 text-primary" />
          Resume <span className="text-red-400">*</span>
        </label>
        <Input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          {...register("resume", {
            required: "Resume is required",
            validate: {
              size: (files) =>
                !files?.[0] ||
                files[0].size <= MAX_RESUME_BYTES ||
                "Resume must be 5 MB or smaller",
              type: (files) => {
                const name = files?.[0]?.name ?? "";
                const ext = name.split(".").pop()?.toLowerCase() ?? "";
                return (
                  !name ||
                  ACCEPTED_EXTENSIONS.includes(ext) ||
                  "Resume must be a PDF, DOC, or DOCX file"
                );
              },
            },
          })}
          className={`file:text-white file:mr-3 cursor-pointer transition-all duration-300 ${
            errors.resume ? "border-red-500" : ""
          }`}
        />
        <p className="text-[11px] text-gray-500 font-barlow mt-1">
          PDF, DOC, or DOCX — max 5 MB.
        </p>
        {errors.resume && (
          <div className="flex items-center gap-1.5 mt-1">
            <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            <p className="text-red-400 text-xs font-barlow">
              {errors.resume.message}
            </p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSending}
        className="w-full font-barlow font-semibold text-sm py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
      >
        {isSending ? "Submitting..." : "Submit Application"}
        {!isSending && (
          <FiSend className="w-4 h-4 group-hover/btn:translate-x-2 group-hover/btn:rotate-12 transition-all duration-300" />
        )}
    </Button>
    </form>
  );
};

export default ApplyForm;
