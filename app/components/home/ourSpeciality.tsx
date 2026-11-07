import {
  Layers,
  GitBranch,
  TrendingUp,
  CalendarCheck,
  LayoutDashboard,
  Smartphone,
  Boxes,
  Server,
  Globe,
  Bot,
  ShieldCheck,
  CloudCog,
  Activity,
  Users,
  Workflow,
  RefreshCw,
  Cpu,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedGridBg from "../ui/animated-grid-bg";
import VerticalTabs from "../ui/vertical-tabs";
import { HomeSectionHeading } from "./homeSectionHeading";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { useScrollSteps } from "~/hooks/useScrollSteps";
import { getBlurAnimationClasses } from "~/lib/animations";
import { processArt } from "./processIllustrations";

interface FeatureItem {
  name: string;
  icon: LucideIcon;
}

interface TabContent {
  id: number;
  title: string;
  description: string;
  features: FeatureItem[];
  color: string;
}

const tabsData: TabContent[] = [
  {
    id: 1,
    title: "STRATEGY",
    description:
      "We audit your operational bottlenecks and product goals to map out a high-ROI technical roadmap. You get clear data schemas, model selections, and fixed-scope sprint milestones before a single line of code is written.",
    features: [
      { name: "AI & system architecture design", icon: Layers },
      { name: "Operational workflow & ROI mapping", icon: GitBranch },
      { name: "LLM cost, latency & security scoping", icon: TrendingUp },
      { name: "Fixed-scope milestone planning", icon: CalendarCheck },
    ],
    color: "#0a84ff",
  },
  {
    id: 2,
    title: "DESIGN",
    description:
      "Complex AI and operational tools only succeed when people love using them. We design interactive Figma prototypes, design systems, and frictionless user journeys across dark and light themes.",
    features: [
      { name: "Interactive Figma UI/UX prototypes", icon: LayoutDashboard },
      { name: "Component-driven design systems", icon: Boxes },
      { name: "Human-in-the-loop AI review flows", icon: Users },
      { name: "Mobile-first & accessible layouts", icon: Smartphone },
    ],
    color: "#ff7a00",
  },
  {
    id: 3,
    title: "DEVELOPMENT",
    description:
      "Our senior engineers build your frontend, backend APIs, database schemas, and AI pipelines in parallel. You review working software in staging every week with full visibility into progress.",
    features: [
      { name: "Type-safe Next.js, NestJS & FastAPI codebases", icon: Server },
      { name: "Custom LLM, RAG, Voice & Vision integration", icon: Bot },
      { name: "PostgreSQL relational & vector data modeling", icon: Globe },
      { name: "Automated CI/CD & staging deployments", icon: Workflow },
    ],
    color: "#00f5d4",
  },
  {
    id: 4,
    title: "MAINTAIN",
    description:
      "We test far beyond the happy path—benchmarking API throughput, database queries, and AI hallucination guardrails so your platform performs reliably under real production load.",
    features: [
      { name: "AI output evaluations & confidence checks", icon: ShieldCheck },
      { name: "Real-time error & uptime monitoring", icon: Activity },
      { name: "Automated database backups & security patching", icon: CloudCog },
      { name: "SLA-backed post-launch engineering", icon: Users },
    ],
    color: "#22c55e",
  },
  {
    id: 5,
    title: "SCALE",
    description:
      "Launch with zero lock-in. You own 100% of the source code, infrastructure, and custom prompts from day one, with optional sprint capacity whenever you are ready to ship new features.",
    features: [
      { name: "Complete GitHub & cloud handover", icon: GitBranch },
      { name: "Multi-tenant & high-concurrency scaling", icon: Cpu },
      { name: "Fine-tuning & API cost optimization", icon: RefreshCw },
      { name: "On-demand feature expansion sprints", icon: Boxes },
    ],
    color: "#a855f7",
  },
];

const OurSpeciality = () => {
  // On desktop the section pins and scrolling walks Strategy → Scale.
  const { trackRef, index, goTo } = useScrollSteps<HTMLElement>(tabsData.length);
  const activeTab = tabsData[index].id;
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();

  const activeContent = tabsData[index];
  const ActiveArt = processArt[activeContent.id];

  const handleTabChange = (id: number) => {
    if (id === activeTab) return;
    goTo(tabsData.findIndex((t) => t.id === id));
  };

  return (
    // Pinned: a 100svh + 5 × 40svh track (see useScrollSteps) with a sticky
    // panel. overflow-clip, not overflow-hidden: a hidden overflow makes the
    // section a scroll container and the panel would never stick.
    <section
      ref={trackRef}
      id="process"
      className="relative scroll-mt-24 bg-black text-white py-16 sm:py-20 md:py-24 px-4 md:px-6 overflow-clip pin:h-[300svh] pin:py-0"
    >
      <div className="relative pin:sticky pin:top-0 pin:flex pin:h-svh pin:flex-col pin:justify-center pin:pt-20 pin:pb-8 pin-compact:pb-3">
        {/* Ambient section glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-700 ease-out"
          style={{
            background: `radial-gradient(ellipse 65% 45% at 65% 50%, ${activeContent.color}15 0%, transparent 70%)`,
          }}
        />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <HomeSectionHeading
            eyebrow="Full-Cycle Execution"
            title="How We Turn Bottlenecks Into Production Systems"
            pinned
          />

          {/* Main Content Row */}
          <div
            ref={containerRef}
            className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center w-full"
          >
            {/* Left: Vertical Tabs */}
            <div className="w-full lg:w-auto lg:shrink-0">
              <VerticalTabs
                tabs={tabsData}
                activeTab={activeTab}
                onTabChange={(id) => handleTabChange(id as number)}
                className={`pin-compact:gap-1.5 ${getBlurAnimationClasses(isVisible)}`}
              />
            </div>

            {/* Right: Content Card with 3D Stack Effect */}
            <div className="w-full lg:flex-1 min-w-0 relative">
              {/* Physical stacked card deck shadow layers */}
              <div
                className="absolute -bottom-2.5 left-3 right-3 h-full rounded-2xl md:rounded-3xl border border-white/[0.05] bg-white/[0.015] pointer-events-none transition-all duration-500 z-0"
                style={{ transform: "scale(0.98)" }}
              />
              <div
                className="absolute -bottom-5 left-6 right-6 h-full rounded-2xl md:rounded-3xl border border-white/[0.025] bg-white/[0.008] pointer-events-none transition-all duration-500 z-0"
                style={{ transform: "scale(0.96)" }}
              />

              {/* No backdrop-blur: behind the card is only a smooth gradient, so
                  it changed nothing visible but re-blurred on every step change. */}
              <div className="relative z-10 rounded-2xl md:rounded-3xl overflow-hidden w-full border border-white/[0.09] bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                <AnimatedGridBg />

                {/* Ambient glows: radial gradients of currentColor rather than
                    blur filters, so the colour can still ease between steps
                    without re-rasterising a 100px blur every frame. */}
                <div
                  className="absolute -top-48 -left-48 w-[32rem] h-[32rem] rounded-full pointer-events-none transition-colors duration-700 ease-out bg-[radial-gradient(circle,currentColor_0%,transparent_70%)]"
                  style={{ color: `${activeContent.color}35` }}
                />
                <div
                  className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full pointer-events-none transition-colors duration-700 ease-out bg-[radial-gradient(circle,currentColor_0%,transparent_70%)]"
                  style={{ color: `${activeContent.color}25` }}
                />

                {/* Framer Motion animated card content with smooth GPU transitions */}
                <div className="relative z-10 p-6 md:p-8 lg:p-9 min-h-[420px] md:min-h-[400px] pin-compact:p-6 pin-compact:min-h-0 flex flex-col justify-center overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeContent.id}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.28,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        transition: {
                          duration: 0.16,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }}
                      className="w-full flex flex-col justify-center transform-gpu"
                    >
                      {/* Title + Description */}
                      <div className="mb-5 md:mb-6 pin-compact:mb-4">
                        <h3
                          className="font-barlow font-bold text-xl md:text-2xl pin-compact:text-xl mb-2 transition-colors duration-300 tracking-wide"
                          style={{ color: activeContent.color }}
                        >
                          {activeContent.title}
                        </h3>
                        <p className="text-gray-300/90 text-sm md:text-base pin-compact:text-sm leading-relaxed max-w-2xl font-normal">
                          {activeContent.description}
                        </p>
                      </div>

                      {/* Features + Image Grid */}
                      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                        <div className="flex flex-col gap-2.5">
                          {activeContent.features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                              <div
                                key={feature.name}
                                className="feature-card group relative flex items-center justify-between gap-3.5 py-3 pin-compact:py-2 px-4 rounded-xl md:rounded-2xl border border-white/[0.1] bg-white/[0.06] hover:bg-white/[0.1] transition-all duration-300 cursor-default select-none overflow-hidden hover:-translate-y-[1px] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                                style={
                                  {
                                    "--active-color": activeContent.color,
                                  } as React.CSSProperties
                                }
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 border"
                                    style={{
                                      backgroundColor: `${activeContent.color}15`,
                                      borderColor: `${activeContent.color}40`,
                                      color: activeContent.color,
                                      boxShadow: `0 0 12px ${activeContent.color}20`,
                                    }}
                                  >
                                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                  </div>
                                  <span className="text-gray-100 text-sm font-medium group-hover:text-white transition-colors duration-300 truncate">
                                    {feature.name}
                                  </span>
                                </div>
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0"
                                  style={{
                                    backgroundColor: `${activeContent.color}25`,
                                    color: activeContent.color,
                                    boxShadow: `0 0 8px ${activeContent.color}40`,
                                  }}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="hidden md:flex items-center justify-center">
                          <div className="relative w-full max-w-[320px] pin-compact:max-w-[230px] mx-auto transform-gpu">
                            <div
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-20 pointer-events-none bg-[radial-gradient(circle,currentColor_0%,transparent_70%)]"
                              style={{ color: activeContent.color }}
                            />
                            <div className="relative z-10">
                              <ActiveArt color={activeContent.color} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Mobile Pagination */}
                <div className="flex justify-center gap-2 pb-6 lg:hidden">
                  {tabsData.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                        activeTab === tab.id
                          ? "w-7"
                          : "bg-white/20 hover:bg-white/40 w-2.5"
                      }`}
                      style={
                        activeTab === tab.id
                          ? {
                              backgroundColor: tab.color,
                              boxShadow: `0 0 10px ${tab.color}`,
                            }
                          : {}
                      }
                      aria-label={`Go to ${tab.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSpeciality;

