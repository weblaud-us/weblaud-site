import { Link } from "react-router";
import type { Route } from "./+types/career.$slug";
import Discuss from "~/components/aboutUs/discuss";
import { ApplyButton, ApplyDialog } from "~/components/career/applyDialog";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiUsers,
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

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  // The apply endpoint keys off the job's ObjectId, not its slug, so the form
  // carries the id in a hidden field.
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
    { icon: <FiMapPin />, label: "Location", value: job.location },
    { icon: <FiBriefcase />, label: "Job Type", value: job.jobType },
    { icon: <FiClock />, label: "Experience", value: job.experience },
    { icon: <FiUsers />, label: "Openings", value: job.position },
    { icon: <FiDollarSign />, label: "Salary", value: job.salaryRange },
    { icon: <FiCalendar />, label: "Apply By", value: deadline },
  ].filter((fact) => Boolean(fact.value));

  return (
    // Extra bottom padding on mobile so the sticky apply bar doesn't cover the
    // end of the page.
    <div className="bg-black text-white pt-24 md:pt-32 pb-32 md:pb-16 min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          to="/career"
          className="inline-flex items-center text-sm font-barlow text-gray-400 hover:text-primary transition-colors mb-8"
        >
          <FiArrowLeft className="mr-2" /> All Open Positions
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {job.jobType && (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider font-barlow">
              {job.jobType}
            </span>
          )}
          {job.department && (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold uppercase tracking-wider font-barlow">
              {job.department}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-barlow mb-4">
          {job.title}
        </h1>

        {job.summary && (
          <p className="text-gray-400 font-barlow text-base sm:text-lg leading-relaxed mb-8">
            {job.summary}
          </p>
        )}

        <div className="hidden md:block mb-10">
          <ApplyDialog careerId={job._id} jobTitle={job.title}>
            <ApplyButton />
          </ApplyDialog>
        </div>

        {/* Fact strip */}
        {facts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-card-bg/80 border border-light-black rounded-3xl p-6 sm:p-8 mb-10 shadow-xl">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-start gap-3">
                <span className="text-primary text-lg mt-0.5 shrink-0">
                  {fact.icon}
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-barlow">
                    {fact.label}
                  </p>
                  <p className="text-sm text-white font-barlow font-medium">
                    {fact.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {job.jobDetails && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold font-barlow mb-4">
              About the Role
            </h2>
            <p className="text-gray-400 font-barlow leading-relaxed whitespace-pre-line">
              {job.jobDetails}
            </p>
          </section>
        )}

        {job.responsibilities.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold font-barlow mb-4">
              What You'll Do
            </h2>
            <ul className="space-y-3">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FiCheckCircle className="text-primary mt-1 shrink-0" />
                  <span className="text-gray-400 font-barlow leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {job.requirements.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold font-barlow mb-4">
              What We're Looking For
            </h2>
            <ul className="space-y-3">
              {job.requirements.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FiCheckCircle className="text-primary mt-1 shrink-0" />
                  <span className="text-gray-400 font-barlow leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-card-bg/80 border border-light-black rounded-3xl p-8 sm:p-10 text-center shadow-xl mb-16">
          <h2 className="text-2xl font-bold font-barlow mb-2">
            Interested in this role?
          </h2>
          <p className="text-gray-400 font-barlow text-sm mb-6">
            Send us your resume — it takes about two minutes.
          </p>
          <ApplyDialog careerId={job._id} jobTitle={job.title}>
            <ApplyButton />
          </ApplyDialog>
        </section>
      </div>

      {/* Mobile: the apply action stays reachable without scrolling back up. */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-light-black bg-black/90 backdrop-blur-md px-4 py-3">
        <ApplyDialog careerId={job._id} jobTitle={job.title}>
          <ApplyButton className="w-full" />
        </ApplyDialog>
      </div>

      <Discuss />
    </div>
  );
}
