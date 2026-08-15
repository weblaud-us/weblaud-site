import { motion } from "framer-motion";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import SectionBadge from "~/components/ui/section-badge";
import { Target, Zap, Users, ShieldCheck, Clock } from "lucide-react";

const reasons = [
  {
    tag: "Next-Gen Tech",
    title: "Innovation",
    description:
      "Pushing boundaries with modern AI workflows, resilient cloud infrastructure, and scalable system design.",
    icon: Zap,
    number: "01",
    highlightLabel: "Focus",
    highlightValue: "Cloud & AI Stacks",
  },
  {
    tag: "Direct Access",
    title: "Collaboration",
    description:
      "Direct engineer communication with dedicated Slack channels, weekly demos, and transparent roadmap visibility.",
    icon: Users,
    number: "02",
    highlightLabel: "Cadence",
    highlightValue: "Weekly Demos",
  },
  {
    tag: "Clean Architecture",
    title: "Excellence",
    description:
      "Strict engineering benchmarks, automated CI/CD test suites, and maintainable type-safe production codebases.",
    icon: ShieldCheck,
    number: "03",
    highlightLabel: "Standard",
    highlightValue: "Zero Tech Debt",
  },
  {
    tag: "Fast Turnaround",
    title: "Reliable Delivery",
    description:
      "Fixed-scope milestone planning with predictable shipping sprints and guaranteed turnaround timelines.",
    icon: Clock,
    number: "04",
    highlightLabel: "Timeline",
    highlightValue: "Fixed Milestones",
  },
];

const WhyChooseUs = () => {
  const [titleRef, isTitleVisible] = useBlurAnimation();
  const [cardsRef, areCardsVisible] = useBlurAnimation();

  return (
    <section className="bg-black px-4 sm:px-6 md:px-8 lg:px-6 xl:px-10 py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-12 md:mb-16 ${getBlurAnimationClasses(isTitleVisible)}`}
        >
          <SectionBadge
            icon={<Target className="w-3.5 h-3.5" />}
            text="The Weblaud Advantage"
            badgeLabel="Our Edge"
            color="#0a84ff"
            className="mb-4"
          />
          <h2 className="text-white font-barlow text-2xl md:text-4xl font-bold tracking-tight">
            Why Choose Us
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 bg-[#0e0e0e] border border-[#1f1f1f] hover:border-primary/40 transition-all duration-300 flex flex-col justify-between cursor-default"
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
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-wider uppercase text-primary block mb-1 sm:mb-2 font-medium">
                    {reason.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-white font-barlow font-bold text-base sm:text-lg md:text-xl mb-1.5 sm:mb-3 tracking-wide group-hover:text-white transition-colors duration-300">
                    {reason.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#8e8e93] font-barlow text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 group-hover:text-[#a1a1aa] transition-colors duration-300">
                    {reason.description}
                  </p>
                </div>

                {/* Structured Metadata Bottom Bar */}
                <div className="pt-3 sm:pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-white/35 uppercase tracking-wider text-[9px] sm:text-[11px]">
                    {reason.highlightLabel}
                  </span>
                  <span className="text-primary font-medium tracking-wide text-[9px] sm:text-[11px]">
                    {reason.highlightValue}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;




