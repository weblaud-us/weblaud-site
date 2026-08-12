import { Link } from "react-router";
import type { Route } from "./+types/career";
import Discuss from "~/components/aboutUs/discuss";
import {
  FiArrowRight,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { fetchOptional } from "~/lib/api.server";
import type { Career } from "~/lib/types";

export async function loader() {
  const careers = await fetchOptional<Career[]>("/careers", []);
  return { careers };
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Careers at Weblaud LLC | Open Positions" },
    {
      name: "description",
      content:
        "Join Weblaud LLC. Explore open roles in design, marketing, and engineering — remote-first, with real ownership over the work you ship.",
    },
    { property: "og:title", content: "Careers at Weblaud LLC | Open Positions" },
    {
      property: "og:description",
      content:
        "Explore open roles at Weblaud LLC — remote-first positions in design, marketing, and engineering.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/career" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Careers at Weblaud LLC" },
    {
      name: "twitter:description",
      content: "Remote-first open roles in design, marketing, and engineering.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/career" },
  ];
}

export default function CareerHub({ loaderData }: Route.ComponentProps) {
  const { careers } = loaderData;

  return (
    <div className="bg-black text-white pt-24 md:pt-32 pb-16 min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4 font-barlow">
            Careers at Weblaud
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-barlow mb-4">
            Build What Actually Ships
          </h1>
          <p className="text-gray-400 font-barlow text-base sm:text-lg">
            We are a small, remote-first team that puts craft over headcount. If
            you want real ownership over the work you put your name on, we
            should talk.
          </p>
        </div>

        {/* Openings Grid */}
        {careers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {careers.map((job) => (
              <article
                key={job._id}
                className="bg-card-bg/80 border border-light-black rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 group shadow-xl"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {job.jobType && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium font-barlow">
                        <FiBriefcase className="mr-1.5" />
                        {job.jobType}
                      </span>
                    )}
                    {job.department && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium font-barlow">
                        {job.department}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold font-barlow text-white group-hover:text-primary transition-colors leading-snug mb-3">
                    <Link to={`/career/${job.slug}`}>{job.title}</Link>
                  </h2>

                  <p className="text-gray-400 text-sm font-barlow leading-relaxed mb-6">
                    {job.summary}
                  </p>

                  <ul className="space-y-2 text-xs font-barlow text-gray-400 mb-6">
                    {job.location && (
                      <li className="flex items-center gap-2">
                        <FiMapPin className="text-primary shrink-0" />
                        {job.location}
                      </li>
                    )}
                    {job.experience && (
                      <li className="flex items-center gap-2">
                        <FiClock className="text-primary shrink-0" />
                        {job.experience} experience
                      </li>
                    )}
                    {job.position && (
                      <li className="flex items-center gap-2">
                        <FiUsers className="text-primary shrink-0" />
                        {job.position}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-barlow">
                    {job.salaryRange || "Compensation on discussion"}
                  </span>
                  <Link
                    to={`/career/${job.slug}`}
                    className="inline-flex items-center text-primary text-xs font-bold font-barlow group-hover:translate-x-1 transition-transform"
                  >
                    View Details <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto text-center bg-card-bg/80 border border-light-black rounded-3xl p-10 mb-20 shadow-xl">
            <h2 className="text-xl font-bold font-barlow text-white mb-3">
              No open positions right now
            </h2>
            <p className="text-gray-400 text-sm font-barlow leading-relaxed mb-6">
              We hire whenever we meet someone exceptional. Send us your work and
              we will keep you in mind for the next opening.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center text-primary text-sm font-bold font-barlow hover:translate-x-1 transition-transform"
            >
              Get in touch <FiArrowRight className="ml-1" />
            </Link>
          </div>
        )}
      </div>

      <Discuss />
    </div>
  );
}
