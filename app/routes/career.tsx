import { useState, useMemo } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/career";
import Discuss from "~/components/aboutUs/discuss";
import SectionBadge from "~/components/ui/section-badge";
import {
  FiArrowRight,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";
import { Globe, ShieldCheck, Zap, Layers } from "lucide-react";
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

const PERKS = [
  {
    icon: <Globe className="w-5 h-5 text-primary" />,
    title: "100% Remote & Async",
    description:
      "Work from wherever you do your best work. No mandatory time-zone lock-in or pointless status calls.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    title: "Real Craft Ownership",
    description:
      "Small teams, direct responsibility. You own technical decisions and build products that actually launch.",
  },
  {
    icon: <Zap className="w-5 h-5 text-primary" />,
    title: "Modern Tech Stack",
    description:
      "React Router, Remix, Next.js, TypeScript, Cloudflare Workers, Node, and cutting-edge AI architectures.",
  },
  {
    icon: <Layers className="w-5 h-5 text-primary" />,
    title: "Transparent Growth",
    description:
      "Competitive fixed-sprint rates, performance bonuses, and continuous learning stipends for your career.",
  },
];

export default function CareerHub({ loaderData }: Route.ComponentProps) {
  const { careers } = loaderData;
  const [selectedDept, setSelectedDept] = useState<string>("all");

  // Dynamically extract unique departments from available jobs
  const departments = useMemo(() => {
    const set = new Set<string>();
    careers.forEach((c) => {
      if (c.department) set.add(c.department);
    });
    return Array.from(set);
  }, [careers]);

  const filteredCareers = useMemo(() => {
    if (selectedDept === "all") return careers;
    return careers.filter((c) => c.department?.toLowerCase() === selectedDept.toLowerCase());
  }, [careers, selectedDept]);

  return (
    <div className="bg-black text-white pt-28 sm:pt-32 md:pt-36 min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <SectionBadge
            icon={<FiBriefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            color="#0a84ff"
            className="mb-3 sm:mb-4 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-xs inline-flex"
          >
            <span className="font-bold tracking-[0.06em] text-primary whitespace-nowrap">
              Careers at Weblaud
            </span>
            <span className="text-white/50 pl-1.5 sm:pl-2 border-l border-white/10 font-medium tracking-[0.04em] text-[9px] sm:text-[11px] whitespace-nowrap">
              Join Our Team
            </span>
          </SectionBadge>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-barlow text-white tracking-tight mb-4 leading-[1.15]">
            Build What Actually <span className="text-primary">Ships.</span>
          </h1>
          <p className="text-gray-400 font-barlow text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
            We are a small, remote-first team of senior engineers and product designers who put craft over headcount. If you want real ownership over the systems you build, you'll love working with us.
          </p>
        </div>

        {/* Culture & Values Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-20">
          {PERKS.map((perk, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0e0e0e] border border-[#1f1f1f] hover:border-primary/40 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-105 transition-transform duration-300">
                  {perk.icon}
                </div>
                <h3 className="text-xs sm:text-base md:text-lg font-bold font-barlow text-white tracking-tight mb-1 sm:mb-2 leading-snug">
                  {perk.title}
                </h3>
              </div>
              <p className="text-[11px] sm:text-sm text-gray-400 font-barlow leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

        {/* Open Positions Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
          <div>
            <SectionBadge
              icon={<FiBriefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              color="#0a84ff"
              className="mb-2.5 px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs inline-flex"
            >
              <span className="font-bold tracking-[0.06em] text-primary whitespace-nowrap">
                Current Openings
              </span>
              <span className="text-white/50 pl-1.5 sm:pl-2 border-l border-white/10 font-medium tracking-[0.04em] text-[9px] sm:text-[11px] whitespace-nowrap">
                {careers.length} Roles
              </span>
            </SectionBadge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-barlow text-white tracking-tight">
              Explore Available Roles
            </h2>
          </div>

          {/* Department Filter Tabs (if departments exist) */}
          {departments.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedDept("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-barlow font-semibold transition-all duration-200 cursor-pointer ${
                  selectedDept === "all"
                    ? "bg-primary text-white shadow-md shadow-blue-500/20"
                    : "bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                All Roles ({careers.length})
              </button>
              {departments.map((dept) => {
                const count = careers.filter(
                  (c) => c.department?.toLowerCase() === dept.toLowerCase(),
                ).length;
                const isSelected = selectedDept.toLowerCase() === dept.toLowerCase();
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-barlow font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white shadow-md shadow-blue-500/20"
                        : "bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {dept} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Openings Grid */}
        {filteredCareers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredCareers.map((job) => (
              <article
                key={job._id}
                className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 group shadow-xl relative overflow-hidden"
              >
                {/* Hover corner glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
                    {job.jobType && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold font-barlow">
                        <FiBriefcase className="mr-1.5 w-3 h-3" />
                        {job.jobType}
                      </span>
                    )}
                    {job.department && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-300 text-[11px] font-medium font-barlow">
                        {job.department}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-barlow text-white group-hover:text-primary transition-colors leading-snug mb-3">
                    <Link to={`/career/${job.slug}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-400 text-xs sm:text-sm font-barlow leading-relaxed mb-6 line-clamp-3">
                    {job.summary}
                  </p>

                  {/* Meta Specs */}
                  <ul className="space-y-2 text-xs font-barlow text-gray-400 mb-6 bg-black/40 border border-white/[0.04] rounded-xl p-3">
                    {job.location && (
                      <li className="flex items-center gap-2">
                        <FiMapPin className="text-primary shrink-0 w-3.5 h-3.5" />
                        <span>{job.location}</span>
                      </li>
                    )}
                    {job.experience && (
                      <li className="flex items-center gap-2">
                        <FiClock className="text-primary shrink-0 w-3.5 h-3.5" />
                        <span>{job.experience} experience</span>
                      </li>
                    )}
                    {job.position && (
                      <li className="flex items-center gap-2">
                        <FiUsers className="text-primary shrink-0 w-3.5 h-3.5" />
                        <span>{job.position}</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Footer Action */}
                <div className="border-t border-white/[0.08] pt-4 mt-2 flex items-center justify-between gap-3 relative z-10">
                  <span className="text-[11px] sm:text-xs font-mono text-gray-400 truncate">
                    {job.salaryRange || "Competitive Pay"}
                  </span>
                  <Link
                    to={`/career/${job.slug}`}
                    className="group/btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 hover:bg-primary text-primary hover:text-white text-xs font-barlow font-semibold transition-all duration-300"
                  >
                    <span>View Role</span>
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/20 group-hover/btn:bg-white/20 transition-colors">
                      <FiArrowRight className="w-2.5 h-2.5 -rotate-45 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="w-full text-center bg-[#0e0e0e] border border-[#1f1f1f] rounded-3xl p-8 sm:p-12 mb-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-16 h-16 rounded-3xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-4">
              <FiBriefcase className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-barlow text-white mb-2">
              No open positions in this category right now
            </h3>
            <p className="text-gray-400 text-xs sm:text-base font-barlow leading-relaxed max-w-md mx-auto mb-6">
              We hire whenever we meet exceptional engineers and designers. Send us your portfolio and general application — we review every submission.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-blue-600 text-white font-barlow font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-blue-500/25 hover:scale-[1.02] cursor-pointer"
            >
              <span>Send General Application</span>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                <FiArrowRight className="w-3.5 h-3.5 text-white -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </span>
            </Link>
          </div>
        )}
      </div>

      <Discuss />
    </div>
  );
}

