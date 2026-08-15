import { useState, useRef, useEffect } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/career.$slug.apply";
import { toast } from "sonner";
import SectionBadge from "~/components/ui/section-badge";
import {
  FiArrowLeft,
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

  const body = new FormData();
  body.set("name", String(formData.get("name") ?? ""));
  body.set("email", String(formData.get("email") ?? ""));
  body.set("phone", String(formData.get("phone") ?? ""));
  body.set("interestReason", String(formData.get("interestReason") ?? ""));
  body.set("coverLetter", String(formData.get("coverLetter") ?? ""));
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        toast.success("Application submitted successfully! We'll review your specs right away.");
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
    <div className="bg-black text-white pt-28 sm:pt-32 md:pt-36 min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back navigation */}
        <div className="mb-6 sm:mb-8">
          <Link
            to={`/career/${job.slug}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-barlow text-gray-400 hover:text-white transition-colors duration-300 group py-1.5 px-3.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/20"
          >
            <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>
              <span className="sm:hidden">Role Overview</span>
              <span className="hidden sm:inline">Back to {job.title}</span>
            </span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <SectionBadge
            icon={<FiSend className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            color="#0a84ff"
            className="mb-3 sm:mb-4 px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs inline-flex"
          >
            <span className="font-bold tracking-[0.06em] text-primary whitespace-nowrap">
              Application
            </span>
            <span className="text-white/50 pl-1.5 sm:pl-2 border-l border-white/10 font-medium tracking-[0.04em] text-[9px] sm:text-[11px] whitespace-nowrap">
              {job.department || "Open Role"}
            </span>
          </SectionBadge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-barlow text-white tracking-tight leading-tight mb-3">
            Apply for <span className="text-primary">{job.title}</span>
          </h1>
          <p className="text-gray-400 font-barlow text-sm sm:text-base leading-relaxed">
            Fill out the information below to submit your profile directly to our hiring team. We review every application with care.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Form Column */}
          <div className="lg:col-span-8">
            {isSuccess ? (
              <div className="bg-[#0e0e0e] border border-primary/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6 relative overflow-hidden">
                <div className="w-16 h-16 rounded-3xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto shadow-xl shadow-blue-500/20">
                  <FiCheckCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold font-barlow text-white tracking-tight">
                    Application Submitted!
                  </h2>
                  <p className="text-gray-400 font-barlow text-xs sm:text-sm leading-relaxed">
                    Thank you for applying to the <span className="text-white font-semibold">{job.title}</span> role. Our founders and senior engineering leads review all submissions and will reach out shortly.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/career"
                    className="group inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-blue-600 text-white font-barlow font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-blue-500/25 cursor-pointer"
                  >
                    <span>View All Roles</span>
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                      <FiArrowRight className="w-3 h-3 text-white -rotate-45" />
                    </span>
                  </Link>
                  <Link
                    to="/"
                    className="py-2.5 px-4 text-xs text-gray-400 hover:text-white font-barlow transition-colors rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <fetcher.Form method="post" encType="multipart/form-data" className="space-y-6">
                  <input type="hidden" name="careerId" value={job._id} />

                  {fetcher.data?.error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-barlow flex items-center gap-2.5">
                      <FiAlertCircle className="w-4 h-4 shrink-0" />
                      <span>{fetcher.data.error}</span>
                    </div>
                  )}

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                      01. Contact Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="apply-name"
                          className="block text-xs font-barlow font-semibold text-gray-300"
                        >
                          Full Name <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                          <input
                            id="apply-name"
                            name="name"
                            required
                            placeholder="Alex Morgan"
                            className="w-full bg-black/60 border border-white/[0.12] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-barlow"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="apply-email"
                          className="block text-xs font-barlow font-semibold text-gray-300"
                        >
                          Email Address <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                          <input
                            id="apply-email"
                            name="email"
                            type="email"
                            required
                            placeholder="alex@example.com"
                            className="w-full bg-black/60 border border-white/[0.12] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-barlow"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label
                          htmlFor="apply-phone"
                          className="block text-xs font-barlow font-semibold text-gray-300"
                        >
                          Phone Number <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                          <input
                            id="apply-phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-black/60 border border-white/[0.12] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-barlow"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                      02. Resume / CV <span className="text-primary">*</span>
                    </h3>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                        selectedFile
                          ? "bg-primary/[0.05] border-primary/50"
                          : "bg-black/40 border-white/[0.12] hover:border-primary/40 hover:bg-white/[0.02]"
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
                        <div className="flex items-center justify-between gap-3 p-2 bg-[#1a1a1a] rounded-xl border border-white/[0.08]">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                              <FiFileText className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-xs font-barlow font-semibold text-white truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono">
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
                            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
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
                      <p className="text-xs text-red-400 font-barlow">{fileError}</p>
                    )}
                  </div>

                  {/* Motivations & Cover Letter */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                      03. Additional Context
                    </h3>

                    {/* Interest Reason */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="apply-interest"
                        className="block text-xs font-barlow font-semibold text-gray-300"
                      >
                        Why are you interested in this role? <span className="text-primary">*</span>
                      </label>
                      <textarea
                        id="apply-interest"
                        name="interestReason"
                        required
                        rows={4}
                        placeholder="Tell us about your background, relevant projects, and why you'd like to work with Weblaud..."
                        className="w-full bg-black/60 border border-white/[0.12] rounded-xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-barlow leading-relaxed resize-y"
                      />
                    </div>

                    {/* Cover Letter */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="apply-cover"
                        className="block text-xs font-barlow font-semibold text-gray-300"
                      >
                        Cover letter / Portfolio links{" "}
                        <span className="text-gray-500 font-normal">(optional)</span>
                      </label>
                      <textarea
                        id="apply-cover"
                        name="coverLetter"
                        rows={3}
                        placeholder="GitHub, LinkedIn, Portfolio URL, or any additional notes..."
                        className="w-full bg-black/60 border border-white/[0.12] rounded-xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-barlow leading-relaxed resize-y"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-blue-600 text-white font-barlow font-semibold text-xs sm:text-sm px-7 py-3 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-[1.02] cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                    >
                      <span>{isSubmitting ? "Submitting Application..." : "Submit Application"}</span>
                      {!isSubmitting && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                          <FiArrowRight className="w-3 h-3 text-white -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </span>
                      )}
                    </button>
                  </div>
                </fetcher.Form>
              </div>
            )}
          </div>

          {/* Role Snapshot Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl p-6 space-y-5 sticky top-28">
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                  Role Snapshot
                </span>
                {job.jobType && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {job.jobType}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-lg font-bold font-barlow text-white mb-1.5 leading-snug">
                  {job.title}
                </h4>
                {job.department && (
                  <p className="text-xs text-gray-400 font-barlow">{job.department}</p>
                )}
              </div>

              <div className="space-y-3 pt-2 text-xs font-barlow">
                {job.location && (
                  <div className="flex items-center gap-2.5 text-gray-300">
                    <FiMapPin className="text-primary shrink-0 w-3.5 h-3.5" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.experience && (
                  <div className="flex items-center gap-2.5 text-gray-300">
                    <FiClock className="text-primary shrink-0 w-3.5 h-3.5" />
                    <span>{job.experience} experience</span>
                  </div>
                )}
                {job.salaryRange && (
                  <div className="flex items-center gap-2.5 text-gray-300">
                    <FiDollarSign className="text-primary shrink-0 w-3.5 h-3.5" />
                    <span>{job.salaryRange}</span>
                  </div>
                )}
                {deadline && (
                  <div className="flex items-center gap-2.5 text-gray-300">
                    <FiCalendar className="text-primary shrink-0 w-3.5 h-3.5" />
                    <span>Apply by {deadline}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                <p className="text-[11px] font-mono uppercase text-gray-400 font-semibold tracking-wider">
                  Our Promise
                </p>
                <p className="text-xs text-gray-400 font-barlow leading-relaxed">
                  We value craft, autonomy, and speed. Zero endless recruiter screens — you'll speak directly with our team leads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
