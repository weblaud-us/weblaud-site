import { useState, useRef, useEffect } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/career.$slug.apply";
import { toast } from "sonner";
import SectionBadge from "~/components/ui/section-badge";
import { CountryCodeSelect } from "~/components/ui/country-code-select";
import {
  FiChevronLeft,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiUploadCloud,
  FiUser,
  FiX,
  FiAlertCircle,
  FiMessageSquare,
} from "react-icons/fi";
import { apiFetch, ApiError } from "~/lib/api.server";
import { RouteErrorBoundary } from "~/components/ui/error-page";
import type { Career } from "~/lib/types";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const job = await apiFetch<Career>(`/careers/slug/${params.slug}`);
    return { job };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }
    throw err;
  }
}

export function ErrorBoundary() {
  return (
    <RouteErrorBoundary
      notFound={{
        badge: "Role not found",
        title: "This opening isn't available.",
        description:
          "The position you're looking for has either been filled or is no longer listed. Take a look at the roles we're hiring for right now.",
        primaryAction: { label: "View Open Roles", to: "/career" },
        suggestions: [
          { label: "About Us", to: "/aboutus" },
          { label: "Our Projects", to: "/projects" },
          { label: "Contact Us", to: "/contact" },
        ],
      }}
    />
  );
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const careerId = String(formData.get("careerId") ?? "");
  if (!careerId) {
    return { error: "Missing job reference. Please reload the page." };
  }

  const resume = formData.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return { error: "Please attach your resume." };
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const directName = String(formData.get("name") ?? "").trim();
  const fullName = directName || `${firstName} ${lastName}`.trim();

  const body = new FormData();
  body.set("name", fullName);
  body.set("email", String(formData.get("email") ?? "").trim());
  body.set("phone", String(formData.get("phone") ?? "").trim());
  body.set("interestReason", String(formData.get("interestReason") ?? "").trim());
  body.set("coverLetter", String(formData.get("coverLetter") ?? "").trim());
  body.set("resume", resume);

  try {
    await apiFetch(`/careers/${careerId}/apply`, { method: "POST", body });
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof ApiError
        ? err.message
        : "Something went wrong. Please try again.";
    return { error: message };
  }
}

export function meta({ data }: Route.MetaArgs) {
  const job = data?.job;
  if (!job) return [{ title: "Position Not Found - Weblaud LLC" }];

  return [
    { title: `Apply for ${job.title} | Careers at Weblaud LLC` },
    {
      name: "description",
      content: `Submit your application for the ${job.title} position at Weblaud LLC.`,
    },
  ];
}

function formatDeadline(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CareerApplyPage({ loaderData }: Route.ComponentProps) {
  const { job } = loaderData;
  const deadline = formatDeadline(job.deadline);
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSubmitting = fetcher.state !== "idle";

  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        toast.success("Application submitted successfully! We'll review your profile right away.");
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleFileChange = (file: File | undefined) => {
    setFileError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_RESUME_BYTES) {
      setFileError("Resume must be under 5MB.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setFileError("Please upload a PDF, DOC, or DOCX file.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const isSuccess = fetcher.data?.ok;

  return (
    <div className="bg-black text-white pt-28 sm:pt-32 md:pt-36 pb-20 min-h-screen relative">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Top Bar with Badge on left and Back Link on right */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8 sm:mb-10">
          <SectionBadge
            icon={<FiSend className="w-3.5 h-3.5" />}
            text="Application"
            badgeLabel={job.department || "Open Role"}
            color="#0a84ff"
          />

          <Link
            to={`/career/${job.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-gray-300 hover:text-white text-xs font-barlow font-medium transition-all duration-300 group shrink-0"
          >
            <FiChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-white shrink-0" />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Back to {job.title}</span>
          </Link>
        </div>

        {/* Page Header */}
        <header className="space-y-3 mb-10 sm:mb-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-barlow text-white tracking-tight leading-[1.15]">
            Apply for <span className="text-primary">{job.title}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-barlow leading-relaxed">
            Fill out the form below to submit your details directly to our hiring team. We review every application with care.
          </p>
        </header>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Form Column (7 cols) */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="bg-[#0c0c0c] border border-primary/40 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto shadow-xl shadow-blue-500/20">
                  <FiCheckCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold font-barlow text-white tracking-tight">
                    Application Submitted!
                  </h2>
                  <p className="text-gray-400 font-barlow text-xs sm:text-sm leading-relaxed">
                    Thank you for applying for the <span className="text-white font-semibold">{job.title}</span> role. Our engineering leads will review your submission and get back to you shortly.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/career"
                    className="group/btn relative h-[46px] px-6 rounded-[10px] text-sm font-semibold font-barlow text-white bg-[#0A84FF] shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:bg-[#0070e0] hover:shadow-[0_4px_20px_rgba(10,132,255,0.5)] hover:-translate-y-[2px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View All Roles</span>
                    <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/"
                    className="h-[46px] px-5 text-xs sm:text-sm text-gray-400 hover:text-white font-barlow transition-colors rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] flex items-center justify-center"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-primary/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
                {/* Ambient accent top light */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none">
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                <div className="flex items-center gap-3.5 mb-6 sm:mb-8 relative z-10">
                  <div className="w-11 h-11 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center text-primary shrink-0 shadow-lg">
                    <FiSend className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-white font-barlow font-bold text-2xl sm:text-3xl tracking-tight">
                      Submit Your Profile
                    </h2>
                    <p className="text-gray-400 font-barlow text-xs sm:text-sm mt-0.5">
                      Tell us about your background and qualifications.
                    </p>
                  </div>
                </div>

                <fetcher.Form method="post" encType="multipart/form-data" className="space-y-5 relative z-10">
                  <input type="hidden" name="careerId" value={job._id} />
                  <input
                    type="hidden"
                    name="phone"
                    value={phoneNumber ? `${countryCode} ${phoneNumber}` : ""}
                  />

                  {fetcher.data?.error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-barlow flex items-center gap-2.5">
                      <FiAlertCircle className="w-4 h-4 shrink-0" />
                      <span>{fetcher.data.error}</span>
                    </div>
                  )}

                  {/* 01. Contact Information */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 pb-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                        01. Personal Information
                      </span>
                      <div className="h-px bg-white/[0.06] flex-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 md:gap-4">
                      {/* First Name */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="apply-first-name"
                          className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium block"
                        >
                          First Name <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                            <FiUser className="w-4 h-4" />
                          </div>
                          <input
                            id="apply-first-name"
                            name="firstName"
                            type="text"
                            required
                            placeholder="John"
                            className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl pl-10 pr-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="apply-last-name"
                          className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium block"
                        >
                          Last Name <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                            <FiUser className="w-4 h-4" />
                          </div>
                          <input
                            id="apply-last-name"
                            name="lastName"
                            type="text"
                            required
                            placeholder="Doe"
                            className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl pl-10 pr-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="apply-email"
                        className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium block"
                      >
                        Work Email <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                          <FiMail className="w-4 h-4" />
                        </div>
                        <input
                          id="apply-email"
                          name="email"
                          type="email"
                          required
                          placeholder="john@example.com"
                          className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl pl-10 pr-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Phone with Country Code Select */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="apply-phone"
                        className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium block"
                      >
                        Phone Number <span className="text-primary">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2.5">
                        <CountryCodeSelect
                          value={countryCode}
                          onChange={setCountryCode}
                        />

                        <div className="relative">
                          <input
                            id="apply-phone"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            placeholder="123 456 7890"
                            className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl px-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 02. Resume / CV Upload */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-2 pb-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                        02. Resume / CV <span className="text-primary">*</span>
                      </span>
                      <div className="h-px bg-white/[0.06] flex-1" />
                    </div>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all duration-300 ${
                        selectedFile
                          ? "bg-primary/[0.06] border-primary/50"
                          : "bg-black/60 border-white/[0.1] hover:border-primary/50 hover:bg-black/80"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        required={!selectedFile}
                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                        className="sr-only"
                      />

                      {selectedFile ? (
                        <div className="flex items-center justify-between gap-3 p-3 bg-black/80 rounded-xl border border-white/[0.1]">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                              <FiFileText className="w-5 h-5" />
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-xs sm:text-sm font-barlow font-semibold text-white truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-[11px] text-gray-400 font-mono">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5 py-1">
                          <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center mx-auto shadow-md">
                            <FiUploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold font-barlow text-white">
                              Click to upload or drag and drop your resume
                            </p>
                            <p className="text-[11px] text-gray-500 font-barlow mt-0.5">
                              PDF, DOC, DOCX (Max 5MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {fileError && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                        <p className="text-xs text-red-400 font-barlow">{fileError}</p>
                      </div>
                    )}
                  </div>

                  {/* 03. Additional Context */}
                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center gap-2 pb-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                        03. Additional Context
                      </span>
                      <div className="h-px bg-white/[0.06] flex-1" />
                    </div>

                    {/* Interest Reason */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="apply-interest"
                        className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium block"
                      >
                        Why are you interested in this role? <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                          <FiMessageSquare className="w-4 h-4" />
                        </div>
                        <textarea
                          id="apply-interest"
                          name="interestReason"
                          required
                          rows={4}
                          placeholder="Tell us about your background, relevant projects, and why you'd like to work with Weblaud..."
                          className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl pl-10 pr-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200 resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Cover Letter / Links */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="apply-cover"
                        className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium block"
                      >
                        Cover Letter / Portfolio links <span className="text-gray-500 font-normal lowercase">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none z-10 text-gray-400">
                          <FiMessageSquare className="w-4 h-4" />
                        </div>
                        <textarea
                          id="apply-cover"
                          name="coverLetter"
                          rows={3}
                          placeholder="GitHub, LinkedIn, Portfolio URL, or any additional notes..."
                          className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 focus:bg-black/90 rounded-xl pl-10 pr-4 py-3 text-white font-barlow text-sm placeholder:text-gray-600 outline-none transition-all duration-200 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group/btn relative w-full h-[46px] px-6 rounded-[10px] text-sm font-semibold font-barlow text-white bg-[#0A84FF] shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:bg-[#0070e0] hover:shadow-[0_4px_20px_rgba(10,132,255,0.5)] hover:-translate-y-[2px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                    >
                      <span>{isSubmitting ? "Submitting Application..." : "Submit Application"}</span>
                      {!isSubmitting && (
                        <FiSend className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" />
                      )}
                    </button>
                  </div>
                </fetcher.Form>
              </div>
            )}
          </div>

          {/* Right Role Snapshot Sidebar Column (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 self-start">
            <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5 hover:border-primary/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
              {/* Ambient top light */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/[0.08] relative z-10">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
                    Role Snapshot
                  </p>
                  <h3 className="text-white font-barlow font-bold text-xl sm:text-2xl tracking-tight mt-1">
                    {job.title}
                  </h3>
                  {job.department && (
                    <p className="text-primary font-barlow text-xs sm:text-sm font-medium mt-0.5">
                      {job.department}
                    </p>
                  )}
                </div>
                {job.jobType && (
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 font-medium shrink-0">
                    {job.jobType}
                  </span>
                )}
              </div>

              <div className="space-y-3 relative z-10">
                {job.location && (
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-black/60 border border-white/[0.06] hover:border-primary/40 hover:bg-black/90 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <FiMapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
                        Location
                      </p>
                      <p className="text-white font-barlow text-sm font-medium">
                        {job.location}
                      </p>
                    </div>
                  </div>
                )}

                {job.experience && (
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-black/60 border border-white/[0.06] hover:border-primary/40 hover:bg-black/90 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
                        Experience
                      </p>
                      <p className="text-white font-barlow text-sm font-medium">
                        {job.experience}
                      </p>
                    </div>
                  </div>
                )}

                {job.salaryRange && (
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-black/60 border border-white/[0.06] hover:border-primary/40 hover:bg-black/90 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <FiDollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
                        Compensation
                      </p>
                      <p className="text-white font-barlow text-sm font-medium">
                        {job.salaryRange}
                      </p>
                    </div>
                  </div>
                )}

                {deadline && (
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-black/60 border border-white/[0.06] hover:border-primary/40 hover:bg-black/90 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <FiCalendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
                        Application Deadline
                      </p>
                      <p className="text-white font-barlow text-sm font-medium">
                        {deadline}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Our Promise Subcard */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/[0.06] space-y-2 relative z-10">
                <p className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
                  Our Promise
                </p>
                <p className="text-gray-300 font-barlow text-xs sm:text-sm leading-relaxed">
                  We value craft, autonomy, and speed. Zero endless recruiter screens — you'll speak directly with our engineering and design leads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
