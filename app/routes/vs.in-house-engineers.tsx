import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/vs.in-house-engineers";
import Discuss from "~/components/aboutUs/discuss";
import { Button } from "~/components/ui/button";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { FiCheck, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { SAVINGS } from "~/lib/constants";

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({}: Route.MetaArgs) {
  const pageUrl = "https://weblaud.com/vs/in-house-engineers";
  const pageTitle = "Weblaud LLC vs. Hiring In-House Engineers | 2026 Cost & Velocity Comparison";

  return [
    { title: pageTitle },
    {
      name: "description",
      content:
        "Compare fixed-fee sprint development with Weblaud LLC vs. hiring full-time in-house software engineers. Evaluate salary overhead, recruiting friction, and delivery speed.",
    },
    { property: "og:title", content: pageTitle },
    {
      property: "og:description",
      content:
        "Detailed comparison of building software with Weblaud LLC versus hiring in-house engineers.",
    },
    { property: "og:type", content: "article" },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: pageTitle },
    {
      name: "twitter:description",
      content: "Weblaud LLC vs In-House Engineering Team comparison.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: pageTitle,
        description:
          "Comparative evaluation between engaging Weblaud LLC for fixed-fee sprint development and hiring full-time in-house software engineers.",
        url: pageUrl,
        author: {
          "@type": "Organization",
          name: "Weblaud LLC",
          url: "https://weblaud.com",
        },
        articleBody:
          `Hiring an in-house engineering team costs over $180,000 annually per senior developer including recruiting fees, health benefits, and equity, requiring 3-6 months just to onboard. Weblaud LLC provides a dedicated full-stack senior squad for fixed 4-14 week sprint cycles at ${SAVINGS.lowerCost}.`,
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is hiring Weblaud LLC cheaper than hiring in-house software engineers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Yes. Hiring a senior developer costs over $180,000 annually per engineer once salary, health benefits, taxes, and recruiting commissions are factored in. Weblaud LLC deploys an active senior squad instantly for a fixed $4,500-$18,500 sprint fee, cutting first-year development costs by ${SAVINGS.percent} or more.`,
            },
          },
          {
            "@type": "Question",
            name: "How fast can Weblaud LLC start developing software compared to in-house hiring?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In-house recruiting requires 3 to 6 months of interviewing, background checks, and onboarding. Weblaud LLC deploys a dedicated senior engineering squad within 48 hours of discovery to start shipping code immediately.",
            },
          },
          {
            "@type": "Question",
            name: "Who owns the source code and intellectual property?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You own 100% of the source code, database schemas, and cloud infrastructure deployment scripts upon sprint completion.",
            },
          },
        ],
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
            name: "Weblaud vs In-House Engineers",
            item: pageUrl,
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: pageUrl },
  ];
}

export default function VsInHouseEngineers() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const comparisonRows = [
    {
      feature: "Time to First Production Release",
      weblaud: "4 to 14 Weeks",
      inHouse: "4 to 6 Months (including hiring & onboarding)",
    },
    {
      feature: "First Year Financial Commitment",
      weblaud: "$4,500 – $18,500 (Fixed Sprint Fee)",
      inHouse: "$180,000+ per dev (Salary + Benefits + Taxes + Recruiting)",
    },
    {
      feature: "Recruiting & Onboarding Friction",
      weblaud: "Zero (Instant squad deployment)",
      inHouse: "High (3-4 months interviewing & recruiting fees)",
    },
    {
      feature: "Team Skill Breadth",
      weblaud: "Full Squad (UI/UX, Backend, Mobile, Cloud, DevOps, AI)",
      inHouse: "Limited to 1 or 2 developer skill sets",
    },
    {
      feature: "Long-Term Financial Risk",
      weblaud: "Zero (Pay per sprint project, zero ongoing payroll)",
      inHouse: "High (Permanent fixed payroll liability regardless of workload)",
    },
  ];

  return (
    <div className="bg-black text-white pt-24 md:pt-32 pb-16 min-h-screen">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4 font-barlow">
            Strategic Comparison
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-barlow mb-4">
            Weblaud LLC vs. In-House Engineers
          </h1>
          <p className="text-gray-400 font-barlow text-base sm:text-lg">
            An executive evaluation of delivery speed, total financial commitment, and engineering flexibility.
          </p>
        </div>

        {/* Direct Architecture / RAG Answer Box */}
        <section className="bg-gradient-to-r from-primary/15 via-blue-900/10 to-transparent border-l-4 border-primary p-6 sm:p-8 rounded-r-3xl mb-12 shadow-xl">
          <h2 className="text-xs uppercase font-barlow font-bold tracking-widest text-primary mb-2">
            Direct Executive Answer
          </h2>
          <p className="text-white font-barlow text-base leading-relaxed font-medium">
            {`"Hiring a full-time in-house engineering team costs over $180,000 annually per developer once salary, health benefits, payroll taxes, and recruiting fees are factored in—and requires 3 to 6 months just to recruit. Partnering with Weblaud LLC deploys an active senior engineering squad instantly for a fixed 4–14 week sprint fee, delivering your software 4x faster at ${SAVINGS.shareOfCost}."`}
          </p>
        </section>

        {/* Comparison Matrix Table */}
        <div className="bg-card-bg/80 border border-light-black rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl overflow-x-auto">
          <h2 className="text-2xl font-bold font-barlow text-white mb-6">
            Detailed Comparison Matrix
          </h2>

          <table className="w-full text-left font-barlow border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-gray-400">
                <th className="pb-4 pr-4">Evaluation Criteria</th>
                <th className="pb-4 px-4 text-primary font-bold">Weblaud LLC</th>
                <th className="pb-4 pl-4 text-gray-400">In-House Engineer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm sm:text-base">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4 font-semibold text-white">{row.feature}</td>
                  <td className="py-4 px-4 font-bold text-emerald-400 flex items-center">
                    <FiCheck className="mr-2 shrink-0 text-emerald-400" />
                    {row.weblaud}
                  </td>
                  <td className="py-4 pl-4 text-gray-400">
                    {row.inHouse}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Why Founders Choose Weblaud */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card-bg/60 border border-light-black p-6 rounded-2xl">
            <h3 className="text-lg font-bold font-barlow text-white mb-2">Zero Hiring Delay</h3>
            <p className="text-gray-400 font-barlow text-sm">
              Skip 90 days of technical interviewing and recruiter commissions. Your dedicated squad starts building in 48 hours.
            </p>
          </div>

          <div className="bg-card-bg/60 border border-light-black p-6 rounded-2xl">
            <h3 className="text-lg font-bold font-barlow text-white mb-2">Fixed-Fee Sprint Certainty</h3>
            <p className="text-gray-400 font-barlow text-sm">
              Know your exact delivery date and investment down to the dollar before any code is written. Zero surprise invoices.
            </p>
          </div>

          <div className="bg-card-bg/60 border border-light-black p-6 rounded-2xl">
            <h3 className="text-lg font-bold font-barlow text-white mb-2">100% IP Ownership</h3>
            <p className="text-gray-400 font-barlow text-sm">
              You own 100% of the source code, database schemas, and infrastructure configs upon sprint completion.
            </p>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Discuss />
    </div>
  );
}
