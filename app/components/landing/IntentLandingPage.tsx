import type { ReactNode } from "react";
import { Link } from "react-router";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import Discuss from "~/components/aboutUs/discuss";
import type { LandingPageConfig } from "~/lib/types";

/**
 * Renders one intent landing page from a LandingPageConfig. The markup and
 * styling are lifted from the original hardcoded /vs/* pages so the design is
 * unchanged; the difference is that every page — comparison, use-case, hub, or
 * guide — now flows from data. `children` lets a route inject extra sections
 * (e.g. the hub's directory of links, or the cost guide's price tables) between
 * the matrix and the FAQ.
 */
export default function IntentLandingPage({
  config,
  children,
}: {
  config: LandingPageConfig;
  children?: ReactNode;
}) {
  const columns = config.matrixColumns ?? { weblaud: "Weblaud LLC", other: "Alternative" };

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
            {config.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-barlow mb-4">{config.h1}</h1>
          <p className="text-gray-400 font-barlow text-base sm:text-lg">{config.subhead}</p>

          {config.ctaLink && (
            <Link
              to={config.ctaLink.to}
              className="group mt-8 inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-barlow font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 hover:scale-[1.03]"
            >
              <span>{config.ctaLink.label}</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Direct / RAG Answer Box */}
        <section className="bg-gradient-to-r from-primary/15 via-blue-900/10 to-transparent border-l-4 border-primary p-6 sm:p-8 rounded-r-3xl mb-12 shadow-xl">
          <h2 className="text-xs uppercase font-barlow font-bold tracking-widest text-primary mb-2">
            {config.ragHeading}
          </h2>
          <p className="text-white font-barlow text-base leading-relaxed font-medium">
            {config.ragAnswer}
          </p>
        </section>

        {/* Comparison Matrix (optional) */}
        {config.matrixRows && config.matrixRows.length > 0 && (
          <div className="bg-card-bg/80 border border-light-black rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl overflow-x-auto">
            <h2 className="text-2xl font-bold font-barlow text-white mb-6">
              {config.matrixTitle ?? "Comparison Matrix"}
            </h2>

            <table className="w-full text-left font-barlow border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-gray-400">
                  <th className="pb-4 pr-4">Evaluation Criteria</th>
                  <th className="pb-4 px-4 text-primary font-bold">{columns.weblaud}</th>
                  <th className="pb-4 pl-4 text-gray-400">{columns.other}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm sm:text-base">
                {config.matrixRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-4 font-semibold text-white">{row.feature}</td>
                    <td className="py-4 px-4 font-bold text-emerald-400 flex items-center">
                      <FiCheck className="mr-2 shrink-0 text-emerald-400" />
                      {row.weblaud}
                    </td>
                    <td className="py-4 pl-4 text-gray-400">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Highlight cards (optional) */}
        {config.featureCards && config.featureCards.length > 0 && (
          <div className="mb-16">
            {config.cardsTitle && (
              <h2 className="text-2xl font-bold font-barlow text-white mb-6">{config.cardsTitle}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.featureCards.map((card, idx) => (
                <div key={idx} className="bg-card-bg/60 border border-light-black p-6 rounded-2xl">
                  <h3 className="text-lg font-bold font-barlow text-white mb-2">{card.title}</h3>
                  <p className="text-gray-400 font-barlow text-sm">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Route-injected custom sections (hub directory, cost tables, etc.) */}
        {children}

        {/* Visible FAQ — mirrors the FAQPage JSON-LD so the answers are real
            on-page text for both readers and crawlers, not schema-only. */}
        {config.faqs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-barlow text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {config.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-card-bg/60 border border-light-black rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold font-barlow text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 font-barlow text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Discuss />
    </div>
  );
}
