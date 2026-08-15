import { useState, useRef, useLayoutEffect, type ReactNode } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import IconTile from "~/components/ui/icon-tile";
import SectionBadge from "~/components/ui/section-badge";
import Discuss from "~/components/aboutUs/discuss";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import type { LandingPageConfig } from "~/lib/types";
import {
  Scale,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Layers,
  Zap,
  ShieldCheck,
  Clock,
  TrendingUp,
  Calendar,
  Calculator,
} from "lucide-react";

const PLUS_TRANSITION: Transition = {
  type: "spring",
  duration: 0.42,
  bounce: 0.28,
};

const CONTENT_OPEN_TRANSITION: Transition = {
  type: "spring",
  duration: 0.58,
  bounce: 0.32,
};

const CONTENT_CLOSE_TRANSITION: Transition = {
  type: "spring",
  duration: 0.46,
  bounce: 0.26,
};

function IntentFaqItem({
  item,
  number,
  isOpen,
  onToggle,
}: {
  item: { question: string; answer: string };
  number: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const updateHeight = () => setContentHeight(node.offsetHeight);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.li
      layout="position"
      initial={false}
      className={`rounded-2xl border bg-[#0e0e0e] transition-colors duration-300 overflow-hidden list-none ${
        isOpen ? "border-primary/50" : "border-[#1f1f1f] hover:border-white/15"
      }`}
    >
      <div className="p-4 md:p-6">
        <div
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 cursor-pointer select-none"
        >
          <div className="flex items-center gap-4 min-w-0">
            <IconTile size="lg" className="shrink-0">
              <span
                className={`font-semibold text-xl transition-colors duration-300 ${
                  isOpen ? "text-primary" : "text-white"
                }`}
              >
                {number}
              </span>
            </IconTile>

            <span
              className={`font-medium font-barlow text-sm md:text-lg transition-colors duration-300 ${
                isOpen ? "text-primary" : "text-white"
              }`}
            >
              {item.question}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors duration-300 cursor-pointer ${
              isOpen
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            }`}
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={reduce ? { duration: 0 } : PLUS_TRANSITION}
              className="inline-flex"
            >
              <FiPlus className="text-lg md:text-xl" />
            </motion.span>
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isOpen ? contentHeight : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : isOpen
              ? CONTENT_OPEN_TRANSITION
              : CONTENT_CLOSE_TRANSITION
          }
          className="overflow-hidden"
        >
          <motion.div
            ref={contentRef}
            animate={{
              opacity: isOpen ? 1 : 0,
              y: isOpen ? 0 : -8,
            }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 md:pl-[4.5rem]"
          >
            <p className="text-sm md:text-[15px] text-gray-400 font-barlow leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.li>
  );
}


export default function IntentLandingPage({
  config,
  children,
}: {
  config: LandingPageConfig;
  children?: ReactNode;
}) {
  const columns = config.matrixColumns ?? { weblaud: "Weblaud LLC", other: "Alternative" };
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [heroRef, isHeroVisible] = useBlurAnimation<HTMLDivElement>();
  const [ragRef, isRagVisible] = useBlurAnimation<HTMLDivElement>();
  const [matrixRef, isMatrixVisible] = useBlurAnimation<HTMLDivElement>();
  const [cardsRef, areCardsVisible] = useBlurAnimation<HTMLDivElement>();
  const [faqRef, isFaqVisible] = useBlurAnimation<HTMLDivElement>();

  const getFeatureIcon = (idx: number) => {
    const icons = [Zap, ShieldCheck, Clock, TrendingUp, Sparkles];
    const IconComponent = icons[idx % icons.length];
    return <IconComponent className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="bg-black text-white pt-28 sm:pt-32 md:pt-36 pb-20 min-h-screen relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 sm:space-y-20 md:space-y-24">
        {/* Hero Section */}
        <div
          ref={heroRef}
          className={`text-center max-w-3xl mx-auto ${getBlurAnimationClasses(isHeroVisible)}`}
        >
          <SectionBadge
            icon={<Scale className="w-3.5 h-3.5" />}
            text="Executive Comparison"
            badgeLabel={config.badge}
            color="#0a84ff"
            className="mb-4"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-barlow text-white tracking-tight leading-[1.1] mb-5">
            {config.h1}
          </h1>
          <p className="text-gray-400 font-barlow text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {config.subhead}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {config.ctaLink ? (
              <Link
                to={config.ctaLink.to}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-barlow font-semibold text-xs sm:text-sm hover:bg-blue-600 transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5"
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90" />
                <span>{config.ctaLink.label}</span>
              </Link>
            ) : (
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-barlow font-semibold text-xs sm:text-sm hover:bg-blue-600 transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5"
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90" />
                <span>Book Technical Discovery</span>
              </Link>
            )}

            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-white font-barlow font-semibold text-xs sm:text-sm border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90" />
              <span>Estimate Project Scope</span>
            </Link>
          </div>
        </div>

        {/* Direct / RAG Answer Box */}
        {config.ragAnswer && (
          <section
            ref={ragRef}
            className={`bg-gradient-to-r from-primary/15 via-blue-900/10 to-transparent border-l-4 border-primary p-6 sm:p-8 rounded-r-3xl shadow-xl ${getBlurAnimationClasses(isRagVisible)}`}
          >
            <h2 className="text-xs uppercase font-barlow font-bold tracking-widest text-primary mb-2">
              {config.ragHeading}
            </h2>
            <p className="text-white font-barlow text-base leading-relaxed font-medium">
              {config.ragAnswer.replace(/^"|"$/g, "")}
            </p>
          </section>
        )}

        {/* Comparison Matrix */}
        {config.matrixRows && config.matrixRows.length > 0 && (
          <div
            ref={matrixRef}
            className={`space-y-6 ${getBlurAnimationClasses(isMatrixVisible)}`}
          >
            <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
              <div>
                <SectionBadge
                  icon={<Layers className="w-3.5 h-3.5" />}
                  text="Side-By-Side Breakdown"
                  badgeLabel="Evaluation"
                  color="#0a84ff"
                  className="mb-3"
                />
                <h2 className="text-2xl sm:text-3xl font-bold font-barlow text-white tracking-tight">
                  {config.matrixTitle ?? "Detailed Comparison Matrix"}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono self-center sm:self-auto">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-white font-medium">{columns.weblaud}</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-500" />
                  <span className="text-gray-400">{columns.other}</span>
                </div>
              </div>
            </div>

            {/* Desktop Comparison Table */}
            <div className="hidden md:block rounded-2xl bg-[#0e0e0e] border border-[#1f1f1f] overflow-hidden shadow-2xl">
              <table className="w-full text-left font-barlow border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                    <th className="py-4.5 px-6 text-xs font-mono font-bold uppercase tracking-wider text-gray-400 w-1/3">
                      Evaluation Dimension
                    </th>
                    <th className="py-4.5 px-6 text-sm font-bold text-white w-1/3 bg-primary/[0.05] border-x border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-primary">{columns.weblaud}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                          Recommended
                        </span>
                      </div>
                    </th>
                    <th className="py-4.5 px-6 text-xs font-mono font-bold uppercase tracking-wider text-gray-400 w-1/3">
                      {columns.other}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-sm">
                  {config.matrixRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-white/[0.02] transition-colors duration-200"
                    >
                      <td className="py-4.5 px-6 font-semibold text-white">
                        {row.feature}
                      </td>
                      <td className="py-4.5 px-6 font-medium text-white bg-primary/[0.03] border-x border-primary/15">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="leading-snug">{row.weblaud}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-gray-400 leading-snug">
                        {row.other}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="grid md:hidden gap-3.5">
              {config.matrixRows.map((row, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-[#0e0e0e] border border-[#1f1f1f] space-y-3.5"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                    <h3 className="font-bold text-sm text-white font-barlow">
                      {row.feature}
                    </h3>
                    <span className="font-mono text-[10px] text-white/30 font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Weblaud Column */}
                  <div className="p-3.5 rounded-xl bg-primary/[0.06] border border-primary/20 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-primary">
                      <span>{columns.weblaud}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20">OUR MODEL</span>
                    </div>
                    <div className="flex items-start gap-2 pt-1 text-xs sm:text-sm text-white font-medium font-barlow">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{row.weblaud}</span>
                    </div>
                  </div>

                  {/* Alternative Column */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-[11px] font-mono text-gray-400 font-semibold block">
                      {columns.other}
                    </span>
                    <p className="text-xs text-gray-400 font-barlow leading-relaxed">
                      {row.other}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature / Highlight Cards */}
        {config.featureCards && config.featureCards.length > 0 && (
          <div
            ref={cardsRef}
            className={`space-y-6 ${getBlurAnimationClasses(areCardsVisible)}`}
          >
            {config.cardsTitle && (
              <div>
                <SectionBadge
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  text="Key Advantages"
                  badgeLabel="Why Founders Choose Us"
                  color="#0a84ff"
                  className="mb-3"
                />
                <h2 className="text-2xl sm:text-3xl font-bold font-barlow text-white tracking-tight">
                  {config.cardsTitle}
                </h2>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {config.featureCards.map((card, idx) => (
                <div
                  key={idx}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                  className="rounded-2xl p-6 sm:p-7 bg-[#0e0e0e] border border-[#1f1f1f] hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] group-hover:border-primary/30 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                        {getFeatureIcon(idx)}
                      </div>
                      <span className="font-mono text-xs font-bold text-white/20 group-hover:text-primary transition-colors">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-barlow text-white mb-2 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 font-barlow text-xs sm:text-sm leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Route Children */}
        {children}

        {/* FAQ Section */}
        {config.faqs && config.faqs.length > 0 && (
          <div
            ref={faqRef}
            className={`space-y-6 ${getBlurAnimationClasses(isFaqVisible)}`}
          >
            <div>
              <SectionBadge
                icon={<HelpCircle className="w-3.5 h-3.5" />}
                text="Executive Clarity"
                badgeLabel="Common Questions"
                color="#0a84ff"
                className="mb-3"
              />
              <h2 className="text-2xl sm:text-3xl font-bold font-barlow text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
            <ul className="space-y-4">
              {config.faqs.map((faq, idx) => (
                <IntentFaqItem
                  key={idx}
                  item={faq}
                  number={`0${idx + 1}`}
                  isOpen={openFaq === idx}
                  onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      <Discuss />
    </div>
  );
}
