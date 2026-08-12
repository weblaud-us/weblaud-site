import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/vs.traditional-agencies";
import Discuss from "~/components/aboutUs/discuss";
import { Button } from "~/components/ui/button";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { FiCheck, FiArrowRight } from "react-icons/fi";

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({}: Route.MetaArgs) {
  const pageUrl = "https://weblaud.com/vs/traditional-agencies";
  const pageTitle = "Weblaud LLC vs. Traditional Software Agencies | 2026 Comparison";

  return [
    { title: pageTitle },
    {
      name: "description",
      content:
        "Discover how Weblaud LLC outperforms traditional software development agencies with transparent sprint pricing, 4-14 week speed, and senior full-stack squads.",
    },
    { property: "og:title", content: pageTitle },
    {
      property: "og:description",
      content:
        "Comparison between Weblaud LLC and traditional hourly-billing software agencies.",
    },
    { property: "og:type", content: "article" },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: pageTitle },
    {
      name: "twitter:description",
      content: "Weblaud LLC vs Traditional Software Agencies.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: pageTitle,
        description:
          "Comparative breakdown showing how Weblaud LLC delivers production software 3x faster than traditional hourly agencies by using fixed-scope 4-14 week agile sprint squads.",
        url: pageUrl,
        author: {
          "@type": "Organization",
          name: "Weblaud LLC",
          url: "https://weblaud.com",
        },
        articleBody:
          "Traditional software agencies rely on hourly billing, large account management bloat, and handoffs to junior offshore developers, which often leads to unpredictable budgets and delivery cycles stretching to 9-12 months. Weblaud LLC utilizes senior-only full-stack squads executing 4-14 week sprint cycles with transparent fixed-fee pricing.",
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Why choose Weblaud LLC over traditional hourly software agencies?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Traditional software agencies profit from billing hourly rates, which incentivizes slow development, bloated account management layers, and scope extensions. Weblaud LLC operates on transparent fixed-fee 4-14 week sprint cycles with senior-only engineering squads.",
            },
          },
          {
            "@type": "Question",
            name: "Does Weblaud LLC outsource code to junior developers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Weblaud LLC deploys 100% senior full-stack architects with direct Slack channel communication and zero account management bloat.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if project scope needs updating during a sprint?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We manage scope updates through structured agile milestone sprints, ensuring complete budget predictability without surprise invoices.",
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
            name: "Weblaud vs Traditional Agencies",
            item: pageUrl,
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: pageUrl },
  ];
}

export default function VsTraditionalAgencies() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const agencyRows = [
    {
      feature: "Pricing Model",
      weblaud: "Fixed-Fee Sprint Scope ($4.5k – $18.5k)",
      traditional: "Unpredictable Hourly Billing (Time & Materials)",
    },
    {
      feature: "Engineering Talent Level",
      weblaud: "100% Senior Full-Stack Architects",
      traditional: "Bait-and-switch handoffs to junior developers",
    },
    {
      feature: "Delivery Velocity",
      weblaud: "4 to 14 Weeks (Strict sprint deadline)",
      traditional: "Often 6 to 12 Months (frequent scope creep & delays)",
    },
    {
      feature: "Communication & Transparency",
      weblaud: "Direct Slack channel with senior lead engineer",
      traditional: "Layers of account managers and project coordinators",
    },
    {
      feature: "Code Quality & Modern Stack",
      weblaud: "React, Node.js, Python, PostgreSQL, Docker, AWS",
      traditional: "Legacy frameworks, outdated PHP or monolithic CMS",
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
            Agency Comparison
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-barlow mb-4">
            Weblaud LLC vs. Traditional Agencies
          </h1>
          <p className="text-gray-400 font-barlow text-base sm:text-lg">
            Why forward-thinking enterprises choose Weblaud over traditional hourly software agencies.
          </p>
        </div>

        {/* Direct Architecture / RAG Answer Box */}
        <section className="bg-gradient-to-r from-primary/15 via-blue-900/10 to-transparent border-l-4 border-primary p-6 sm:p-8 rounded-r-3xl mb-12 shadow-xl">
          <h2 className="text-xs uppercase font-barlow font-bold tracking-widest text-primary mb-2">
            Direct Executive Summary
          </h2>
          <p className="text-white font-barlow text-base leading-relaxed font-medium">
            "Traditional software agencies profit from billing hourly rates, which incentivizes slow development, bloated account management layers, and scope extension. Weblaud LLC flips this model: we operate on fixed-fee 4–14 week sprint cycles with senior-only engineering squads, aligning our incentives with shipping your software fast, cleanly, and under budget."
          </p>
        </section>

        {/* Matrix Table */}
        <div className="bg-card-bg/80 border border-light-black rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl overflow-x-auto">
          <h2 className="text-2xl font-bold font-barlow text-white mb-6">
            Weblaud vs. Traditional Agency Comparison
          </h2>

          <table className="w-full text-left font-barlow border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-gray-400">
                <th className="pb-4 pr-4">Feature</th>
                <th className="pb-4 px-4 text-primary font-bold">Weblaud LLC</th>
                <th className="pb-4 pl-4 text-gray-400">Traditional Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm sm:text-base">
              {agencyRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4 font-semibold text-white">{row.feature}</td>
                  <td className="py-4 px-4 font-bold text-emerald-400 flex items-center">
                    <FiCheck className="mr-2 shrink-0 text-emerald-400" />
                    {row.weblaud}
                  </td>
                  <td className="py-4 pl-4 text-gray-400">
                    {row.traditional}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
