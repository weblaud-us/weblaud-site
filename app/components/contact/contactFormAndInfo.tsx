import {
  FiPhone,
  FiSend,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
  FiMail,
  FiCheckCircle,
  FiCalendar,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useFetcher, useRouteLoaderData } from "react-router";
import { ContactInfo } from "../ui/contact-info";
import { BookMeeting } from "../ui/book-meeting";
import { CountryCodeSelect } from "../ui/country-code-select";
import { Turnstile, TurnstileStatus, useTurnstile } from "../ui/turnstile";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import type { loader as rootLoader } from "~/root";
import {
  BUDGET_OPTIONS,
  HEARD_ABOUT_OPTIONS,
  PERSON_NAME_PATTERN,
  TIMELINE_OPTIONS,
} from "~/lib/leads";
import { track } from "~/lib/analytics";
import { RESPONSE_TIME } from "~/lib/constants";
import { LazyBookingModal as BookingModal } from "../ui/lazy-booking-modal";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  message: string;
  /** Optional "How did you hear about us?" — see HEARD_ABOUT_OPTIONS. */
  heardAbout: string;
  /** Optional qualifiers — see BUDGET_OPTIONS / TIMELINE_OPTIONS. */
  budget: string;
  timeline: string;
  /** Honeypot — hidden from humans, irresistible to bots. */
  website: string;
};

const ContactFormAndInfo = () => {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const [formRef, isFormVisible] = useBlurAnimation();

  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSending = fetcher.state !== "idle";
  const captcha = useTurnstile();
  // After a successful send the form is swapped for a "what happens next"
  // panel — the visitor is warmest right now, so offer the call here.
  const [sent, setSent] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Time-trap: bots submit near-instantly; the action drops submissions that
  // come in faster than a human could plausibly fill the form.
  const mountedAt = useRef(Date.now());
  // The success effect below runs after reset(), so remember the answer here.
  const submittedHeardAbout = useRef("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      countryCode: "+1",
    },
  });

  const currentCountryCode = watch("countryCode") || "+1";

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;

    if (fetcher.data.ok) {
      setSent(true);
      track("generate_lead", {
        form: "contact",
        heard_about: submittedHeardAbout.current || undefined,
      });
      reset();
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data, reset]);

  const onSubmit = (data: FormData) => {
    submittedHeardAbout.current = data.heardAbout ?? "";
    fetcher.submit(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phoneNumber ? `${data.countryCode} ${data.phoneNumber}` : "",
        message: data.message,
        heardAbout: data.heardAbout ?? "",
        budget: data.budget ?? "",
        timeline: data.timeline ?? "",
        website: data.website ?? "",
        renderedAt: String(mountedAt.current),
        captchaToken: captcha.token ?? "",
      },
      { method: "post" },
    );
    // No second, browser-side email here anymore. A Web3Forms call used to
    // fire from this function with its access key shipped in the client
    // bundle — anyone could lift the key and mail the inbox directly,
    // bypassing every check. The backend already emails the admin for every
    // lead that passes its spam checks (DashboardNotifierService).
  };

  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Form Card (7 cols) */}
          <div
            ref={formRef}
            className={`lg:col-span-7 bg-[#0c0c0c] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-primary/30 transition-all duration-500 shadow-2xl relative ${getBlurAnimationClasses(
              isFormVisible
            )}`}
          >
            {/* Ambient accent top light */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
              <div className="w-11 h-11 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center text-primary shrink-0 shadow-lg">
                <FiSend className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white font-barlow font-bold text-2xl sm:text-3xl tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-gray-400 font-barlow text-xs sm:text-sm mt-0.5">
                  Tell us about your project or inquiry. We typically reply {RESPONSE_TIME.reply}.
                </p>
              </div>
            </div>

            {sent ? (
              <div
                role="status"
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5 sm:p-6 space-y-4"
              >
                <p className="flex items-center gap-2 text-white font-barlow font-semibold text-lg">
                  <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                  Message sent — thank you!
                </p>
                <p className="text-sm text-gray-300 font-barlow leading-relaxed">
                  A confirmation is on its way to your inbox, and we'll reply{" "}
                  {RESPONSE_TIME.reply}. Want to skip the back-and-forth? Pick a time
                  and talk to an engineer directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(true)}
                    className="inline-flex items-center justify-center gap-2 h-[44px] px-5 rounded-[10px] text-sm font-semibold font-barlow text-white bg-primary-solid hover:bg-primary-solid-hover transition-colors cursor-pointer"
                  >
                    <FiCalendar className="w-4 h-4" aria-hidden="true" />
                    Book a call now
                  </button>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="inline-flex items-center justify-center h-[44px] px-5 rounded-[10px] text-sm font-semibold font-barlow text-gray-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 md:gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-first-name" className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                    First Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <input
                      id="contact-first-name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="John"
                      {...register("firstName", {
                        required: "First name is required",
                        maxLength: { value: 100, message: "First name is too long" },
                        pattern: {
                          value: PERSON_NAME_PATTERN,
                          message: "Please use letters only (apostrophes and hyphens are fine)",
                        },
                      })}
                      className={`w-full bg-black/60 border ${
                        errors.firstName ? "border-red-500/80 focus:border-red-500" : "border-white/[0.08] focus:border-primary/60"
                      } focus:bg-black/90 rounded-xl pl-10 pr-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200`}
                    />
                  </div>
                  {errors.firstName && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      <p className="text-red-400 text-xs font-barlow">
                        {errors.firstName.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-last-name" className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                    Last Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <input
                      id="contact-last-name"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Doe"
                      {...register("lastName", {
                        required: "Last name is required",
                        maxLength: { value: 100, message: "Last name is too long" },
                        pattern: {
                          value: PERSON_NAME_PATTERN,
                          message: "Please use letters only (apostrophes and hyphens are fine)",
                        },
                      })}
                      className={`w-full bg-black/60 border ${
                        errors.lastName ? "border-red-500/80 focus:border-red-500" : "border-white/[0.08] focus:border-primary/60"
                      } focus:bg-black/90 rounded-xl pl-10 pr-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200`}
                    />
                  </div>
                  {errors.lastName && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      <p className="text-red-400 text-xs font-barlow">
                        {errors.lastName.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                  Work Email <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="john@company.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={`w-full bg-black/60 border ${
                      errors.email ? "border-red-500/80 focus:border-red-500" : "border-white/[0.08] focus:border-primary/60"
                    } focus:bg-black/90 rounded-xl pl-10 pr-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200`}
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

              {/* Phone with Country Code */}
              <div className="space-y-1.5">
                <label htmlFor="contact-phone" className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                  Phone Number
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2.5">
                  <CountryCodeSelect
                    value={currentCountryCode}
                    onChange={(val) => setValue("countryCode", val)}
                  />

                  <div className="relative">
                    <input
                      id="contact-phone"
                      type="tel"
                      autoComplete="tel-national"
                      placeholder="123 456 7890"
                      {...register("phoneNumber", {
                        pattern: {
                          value: /^[0-9\s\-()]{7,20}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                      className={`w-full bg-black/60 border ${
                        errors.phoneNumber ? "border-red-500/80 focus:border-red-500" : "border-white/[0.08] focus:border-primary/60"
                      } focus:bg-black/90 rounded-xl px-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200`}
                    />
                  </div>
                </div>
                {errors.phoneNumber && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs font-barlow">
                      {errors.phoneNumber.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                  Your Message <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                    <FiMessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    id="contact-message"
                    placeholder="Tell us about your project scope, requirements, or timeline..."
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                      // Matches CreateContactDto's cap — project briefs run long.
                      maxLength: {
                        value: 5000,
                        message: "Message must not exceed 5,000 characters",
                      },
                    })}
                    rows={4}
                    className={`w-full bg-black/60 border ${
                      errors.message ? "border-red-500/80 focus:border-red-500" : "border-white/[0.08] focus:border-primary/60"
                    } focus:bg-black/90 rounded-xl pl-10 pr-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200 resize-none`}
                  />
                </div>
                {errors.message && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs font-barlow">
                      {errors.message.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Optional qualifiers — so the reply is a plan for this project, not a generic pitch. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 md:gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-budget"
                    className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium"
                  >
                    Budget{" "}
                    <span className="normal-case tracking-normal text-gray-400">(optional)</span>
                  </label>
                  <select
                    id="contact-budget"
                    {...register("budget")}
                    defaultValue=""
                    className="w-full h-[46px] bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl px-3.5 text-white font-barlow text-sm outline-none transition-all duration-200 [&>option]:bg-[#0c0c0c]"
                  >
                    <option value="">Select a range…</option>
                    {BUDGET_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-timeline"
                    className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium"
                  >
                    Timeline{" "}
                    <span className="normal-case tracking-normal text-gray-400">(optional)</span>
                  </label>
                  <select
                    id="contact-timeline"
                    {...register("timeline")}
                    defaultValue=""
                    className="w-full h-[46px] bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl px-3.5 text-white font-barlow text-sm outline-none transition-all duration-200 [&>option]:bg-[#0c0c0c]"
                  >
                    <option value="">When do you need it?</option>
                    {TIMELINE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional — feeds the lead-source report in the admin dashboard. */}
              <div className="space-y-1.5">
                <label
                  htmlFor="heardAbout"
                  className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium"
                >
                  How did you hear about us?{" "}
                  <span className="normal-case tracking-normal text-gray-400">(optional)</span>
                </label>
                <select
                  id="heardAbout"
                  {...register("heardAbout")}
                  defaultValue=""
                  className="w-full h-[46px] bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl px-3.5 text-white font-barlow text-sm outline-none transition-all duration-200 [&>option]:bg-[#0c0c0c]"
                >
                  <option value="">Select one…</option>
                  {HEARD_ABOUT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <Turnstile
                siteKey={captcha.siteKey}
                onToken={captcha.onToken}
                onError={captcha.onError}
                resetKey={fetcher.data}
                action="contact"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending || !captcha.ready}
                className="group/btn relative w-full h-[46px] px-6 rounded-[10px] text-sm font-semibold font-barlow text-white bg-primary-solid shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:bg-primary-solid-hover hover:shadow-[0_4px_20px_rgba(10,132,255,0.5)] hover:-translate-y-[2px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                <span>{isSending ? "Sending Message..." : "Send Message"}</span>
                {!isSending && (
                  <FiSend className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" />
                )}
              </button>
              <TurnstileStatus {...captcha} />
            </form>
            )}
          </div>

          {/* Right Info & Consultation (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ContactInfo contactInfo={rootData?.contactInfo ?? null} />
            <BookMeeting />
          </div>
        </div>
      </div>
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default ContactFormAndInfo;
