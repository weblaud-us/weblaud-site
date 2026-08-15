import { Link } from "react-router";
import type { Route } from "./+types/career.$slug";
import SectionBadge from "~/components/ui/section-badge";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiTarget,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { apiFetch, ApiError } from "~/lib/api.server";
import { RouteErrorBoundary } from "~/components/ui/error-page";
import type { Career } from "~/lib/types";

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

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({ data }: Route.MetaArgs) {
  const job = data?.job;
  if (!job) return [{ title: "Position Not Found - Weblaud LLC" }];

  const pageUrl = `https://weblaud.com/career/${job.slug}`;
  const pageTitle = `${job.title} | Careers at Weblaud LLC`;
  const description =
    job.summary || `Apply for the ${job.title} role at Weblaud LLC.`;

  // Schema.org employmentType expects an enum token, not the display label.
  const employmentType = job.jobType
    ? job.jobType.toUpperCase().replace(/[\s-]+/g, "_")
    : undefined;

  return [
    { title: pageTitle },
    { name: "description", content: description },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: pageTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.jobDetails || description,
        datePosted: job.createdAt,
        ...(job.deadline ? { validThrough: job.deadline } : {}),
        ...(employmentType ? { employmentType } : {}),
        hiringOrganization: {
          "@type": "Organization",
          name: "Weblaud LLC",
          sameAs: "https://weblaud.com",
          logo: "https://weblaud.com/favicon.png",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location || "Remote",
          },
        },
        ...(job.experience ? { experienceRequirements: job.experience } : {}),
        url: pageUrl,
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://weblaud.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Careers",
            item: "https://weblaud.com/career",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: job.title,
            item: pageUrl,
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: pageUrl },
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

export default function CareerDetail({ loaderData }: Route.ComponentProps) {
  const { job } = loaderData;
  const deadline = formatDeadline(job.deadline);

  const facts = [
    { icon: <FiMapPin className="w-4 h-4 text-primary" />, label: "Location", value: job.location },
    { icon: <FiBriefcase className="w-4 h-4 text-primary" />, label: "Job Type", value: job.jobType },
    { icon: <FiClock className="w-4 h-4 text-primary" />, label: "Experience", value: job.experience },
    { icon: <FiUsers className="w-4 h-4 text-primary" />, label: "Openings", value: job.position ? `${job.position} Position` : null },
    { icon: <FiDollarSign className="w-4 h-4 text-primary" />, label: "Compensation", value: job.salaryRange || "Competitive / On discussion" },
    { icon: <FiCalendar className="w-4 h-4 text-primary" />, label: "Apply By", value: deadline || "Open until filled" },
  ].filter((fact) => Boolean(fact.value));

  return (
    // Extra bottom padding on mobile so the sticky apply bar doesn't cover the end of the page.
    <div className="bg-black text-white pt-28 sm:pt-32 md:pt-36 min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Top Bar with Badge on left and Back Link on right */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <SectionBadge
            icon={<FiBriefcase className="w-3.5 h-3.5" />}
            text={job.jobType || "Open Position"}
            badgeLabel={job.department || undefined}
            color="#0a84ff"
          />

          <Link
            to="/career"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-gray-300 hover:text-white text-xs font-barlow font-medium transition-all duration-300 group shrink-0"
          >
            <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-white shrink-0" />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Back to All Positions</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-barlow text-white tracking-tight leading-tight">
            {job.title}
          </h1>

          {job.summary && (
            <p className="text-gray-300 font-barlow text-sm sm:text-lg leading-relaxed max-w-3xl">
              {job.summary}
            </p>
          )}

          <div className="hidden md:flex items-center gap-4 pt-2">
            <Link
              to={`/career/${job.slug}/apply`}
              className="group inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-blue-600 text-white font-barlow font-semibold text-sm px-7 py-3 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-[1.02] cursor-pointer"
            >
              <span>Apply for this Role</span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                <FiArrowRight className="w-3.5 h-3.5 text-white -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </span>
            </Link>
          </div>
        </div>

        {/* Fact Specs Bento Strip */}
        {facts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="p-4 sm:p-5 rounded-2xl bg-[#0e0e0e] border border-[#1f1f1f] flex items-start gap-3 hover:border-white/20 transition-colors"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  {fact.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-gray-400">
                    {fact.label}
                  </p>
                  <p className="text-xs sm:text-sm text-white font-barlow font-semibold mt-0.5 truncate">
                    {fact.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Role Content Card */}
        <div className="space-y-8 sm:space-y-10">
          {/* About the Role */}
          {job.jobDetails && (
            <section className="bg-gradient-to-r from-primary/15 via-blue-900/10 to-transparent border-l-4 border-primary p-6 sm:p-8 rounded-r-3xl shadow-xl">
              <h2 className="text-xs uppercase font-barlow font-bold tracking-widest text-primary mb-2">
                About the Role
              </h2>
              <div className="text-white font-barlow text-sm sm:text-base md:text-lg leading-relaxed font-medium whitespace-pre-line">
                {job.jobDetails}
              </div>
            </section>
          )}

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <section className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-barlow text-white tracking-tight flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <FiZap className="w-4 h-4 text-primary" />
                </div>
                <span>What You'll Do</span>
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-[#050505] border border-[#222222] hover:border-white/20 transition-colors duration-200"
                  >
                    <div className="w-5 h-5 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <FiCheckCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-gray-300 font-barlow text-xs sm:text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <section className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-barlow text-white tracking-tight flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <FiTarget className="w-4 h-4 text-primary" />
                </div>
                <span>What We're Looking For</span>
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-[#050505] border border-[#222222] hover:border-white/20 transition-colors duration-200"
                  >
                    <div className="w-5 h-5 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <FiCheckCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-gray-300 font-barlow text-xs sm:text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* Full-width Discuss-style Career CTA Section */}
      <section className="relative bg-black text-white pt-12 mt-14 sm:pt-16 pb-12 sm:pb-16 px-4 overflow-hidden">
        {/* Seamless ambient gradient glow fading softly into black on top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.08] to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
          {/* Eyebrow badge */}
          <SectionBadge
            icon={<FiBriefcase className="w-3.5 h-3.5" />}
            text="Careers at Weblaud"
            badgeLabel="Join Our Team"
            color="#0a84ff"
            className="mb-6"
          />

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-barlow text-white leading-tight max-w-4xl mb-5 tracking-tight">
            Ready to build with <span className="text-primary">us?</span>
          </h2>

          {/* Sub-copy */}
          <p className="text-sm sm:text-base md:text-lg font-barlow text-gray-300 max-w-2xl leading-relaxed mb-8">
            Submit your resume and portfolio — our founders and senior engineering leads review every submission within 48 hours.
          </p>

          {/* CTA button with pulse ring */}
          <div className="relative">
            {/* Pulse ring */}
            <span
              className="absolute inset-0 rounded-full bg-primary opacity-30 pointer-events-none"
              style={{ animation: "career-cta-pulse 2.4s ease-out infinite" }}
            />
            <Link
              to={`/career/${job.slug}/apply`}
              className="group relative z-10 inline-flex items-center gap-2 sm:gap-2.5 bg-primary hover:bg-primary/90 text-white font-barlow font-semibold text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-full transition-all duration-300 shadow-md shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] cursor-pointer"
            >
              <span>Apply for this Role</span>
              <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                <FiArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </span>
            </Link>
          </div>

          {/* Micro-copy trust signal */}
          <p className="mt-5 font-barlow text-xs text-gray-400 tracking-wide">
            Direct team review &nbsp;·&nbsp; No recruiters &nbsp;·&nbsp; Response within 48 h
          </p>
        </div>
      </section>

      {/* Keyframe styles */}
      <style>{`
        @keyframes career-cta-pulse {
          0%   { transform: scale(1);   opacity: 0.3; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      {/* Mobile sticky bottom apply action */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.1] bg-black/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-gray-400 font-barlow truncate font-medium">
            {job.department || "Open Role"}
          </p>
          <p className="text-xs text-white font-barlow font-bold truncate">
            {job.title}
          </p>
        </div>
        <Link
          to={`/career/${job.slug}/apply`}
          className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-barlow font-semibold text-xs px-4.5 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-blue-500/25 shrink-0 cursor-pointer"
        >
          <span>Apply Now</span>
          <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <FiArrowRight className="w-2.5 h-2.5 text-white -rotate-45" />
          </span>
        </Link>
      </div>
    </div>
  );
}
