import { motion } from "framer-motion";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { Zap, Users, ShieldCheck, Clock } from "lucide-react";
import { TIMELINE } from "~/lib/constants";
import { HomeSectionHeading } from "./homeSectionHeading";

const reasons = [
  {
    tag: "Innovation",
    title: "AI-Native + Full-Stack Depth",
    description:
      "Most AI agencies can't build scalable backends, and traditional dev shops bolt AI on as an afterthought. We architect production software and autonomous AI under one roof.",
    icon: Zap,
    number: "01",
    highlightLabel: "Focus",
    highlightValue: "Cloud, AI & Full-Stack",
  },
  {
    tag: "Collaboration",
    title: "Direct Engineer Access",
    description:
      "Skip account managers and game-of-telephone delays. Work directly with senior engineers via dedicated Slack channels, transparent trackers, and weekly live demos.",
    icon: Users,
    number: "02",
    highlightLabel: "Cadence",
    highlightValue: "Weekly Live Demos",
  },
  {
    tag: "Excellence",
    title: "Clean, Type-Safe Architecture",
    description:
      "Strict engineering benchmarks, modular microservices, automated CI/CD test suites, and maintainable production codebases built to pass technical due diligence.",
    icon: ShieldCheck,
    number: "03",
    highlightLabel: "Standard",
    highlightValue: "Zero Tech Debt",
  },
  {
    tag: "Reliable Delivery",
    title: "Fast, Predictable Turnaround",
    description:
      "Fixed-scope milestone planning with predictable shipping sprints and guaranteed turnaround timelines—no runaway hourly billing.",
    icon: Clock,
    number: "04",
    highlightLabel: "Timeline",
    highlightValue: `${TIMELINE.min}–${TIMELINE.max} Week Sprints`,
  },
];

const WhyChooseUs = () => {
  const [cardsRef, areCardsVisible] = useBlurAnimation();

  return (
    <section id="why-weblaud" className="scroll-mt-24 bg-black px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <HomeSectionHeading eyebrow="Our Edge" title="Why High-Growth Teams Choose Weblaud" />

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                style={{ transitionDelay: `${index * 90}ms` }}
                className={`group relative rounded-2xl p-6 lg:p-7 bg-[#0e0e0e] border border-[#1f1f1f] hover:border-primary/40 transition-all duration-700 hover:-translate-y-1 flex flex-col justify-between cursor-default ${getBlurAnimationClasses(areCardsVisible)}`}
              >
                <div>
                  {/* Top Row: Icon Box + Step Index */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] group-hover:border-primary/30 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-all duration-300">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-white/20 group-hover:text-primary transition-colors duration-300">
                      {reason.number}
                    </span>
                  </div>

                  {/* Category Tag */}
                  <span className="text-[11px] font-mono tracking-wider uppercase text-primary block mb-1 sm:mb-2 font-medium">
                    {reason.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-barlow text-white tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
                    {reason.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 font-barlow text-sm leading-relaxed mb-4">
                    {reason.description}
                  </p>
                </div>

                {/* Structured Metadata Bottom Bar */}
                <div className="pt-3 sm:pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-white/35 uppercase tracking-wider text-[11px]">
                    {reason.highlightLabel}
                  </span>
                  <span className="text-primary font-medium tracking-wide text-[11px]">
                    {reason.highlightValue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;




