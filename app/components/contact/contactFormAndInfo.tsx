import {
  FiPhone,
  FiSend,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
  FiMail,
} from "react-icons/fi";
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useFetcher, useRouteLoaderData } from "react-router";
import { ContactInfo } from "../ui/contact-info";
import { BookMeeting } from "../ui/book-meeting";
import { CountryCodeSelect } from "../ui/country-code-select";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import type { loader as rootLoader } from "~/root";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  message: string;
};

const ContactFormAndInfo = () => {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const [formRef, isFormVisible] = useBlurAnimation();

  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSending = fetcher.state !== "idle";

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
      toast.success("Message sent successfully!");
      reset();
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data, reset]);

  const onSubmit = (data: FormData) => {
    fetcher.submit(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phoneNumber ? `${data.countryCode} ${data.phoneNumber}` : "",
        message: data.message,
      },
      { method: "post" },
    );

    const accessKey = import.meta.env.VITE_CONTACT_FORM_ACCESS_KEY;
    if (!accessKey) return;

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "New Project Inquiry - Weblaud Website",
        from_name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: `${data.countryCode} ${data.phoneNumber}`,
        message: data.message,
      }),
    }).catch((error) => {
      console.error("Web3Forms notification failed:", error);
    });
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
            className={`lg:col-span-7 bg-[#0c0c0c] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-primary/30 transition-all duration-500 shadow-2xl relative overflow-hidden ${getBlurAnimationClasses(
              isFormVisible
            )}`}
          >
            {/* Ambient accent top light */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
              <div className="w-11 h-11 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center text-primary shrink-0 shadow-lg">
                <FiSend className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white font-barlow font-bold text-2xl sm:text-3xl tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-gray-400 font-barlow text-xs sm:text-sm mt-0.5">
                  Tell us about your project or inquiry. We typically reply within 24 hours.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                    First Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="John"
                      {...register("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "First name can only contain letters",
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
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                    Last Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Doe"
                      {...register("lastName", {
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Last name must be at least 2 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Last name can only contain letters",
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
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                  Work Email <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
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
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                  Phone Number
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2.5">
                  <CountryCodeSelect
                    value={currentCountryCode}
                    onChange={(val) => setValue("countryCode", val)}
                  />

                  <div className="relative">
                    <input
                      type="tel"
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
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                  Your Message <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                    <FiMessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    placeholder="Tell us about your project scope, requirements, or timeline..."
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                      maxLength: {
                        value: 1000,
                        message: "Message must not exceed 1000 characters",
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending}
                className="group/btn relative w-full h-[46px] px-6 rounded-[10px] text-sm font-semibold font-barlow text-white bg-[#0A84FF] shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:bg-[#0070e0] hover:shadow-[0_4px_20px_rgba(10,132,255,0.5)] hover:-translate-y-[2px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                <span>{isSending ? "Sending Message..." : "Send Message"}</span>
                {!isSending && (
                  <FiSend className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" />
                )}
              </button>
            </form>
          </div>

          {/* Right Info & Consultation (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ContactInfo contactInfo={rootData?.contactInfo ?? null} />
            <BookMeeting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormAndInfo;
