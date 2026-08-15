import { useState } from "react";
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
import SectionBadge from "../ui/section-badge";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import strategyImg from "~/assets/strategy.png";
import designImg from "~/assets/design.png";
import developmentImg from "~/assets/development.png";
import maintainImg from "~/assets/maintain.png";
import scaleImg from "~/assets/scale.png";

interface FeatureItem {
  name: string;
  icon: LucideIcon;
}

interface TabContent {
  id: number;
  title: string;
  description: string;
  features: FeatureItem[];
  image: string;
  color: string;
}

const tabsData: TabContent[] = [
  {
    id: 1,
    title: "STRATEGY",
    description:
      "We map your operational workflows into production-ready technical roadmaps. We identify clear milestones, scope data schemas, and design software architecture that aligns directly with your business goals.",
    features: [
      { name: "Product & system architecture", icon: Layers },
      { name: "Operational workflow mapping", icon: GitBranch },
      { name: "Technical feasibility & ROI", icon: TrendingUp },
      { name: "Fixed-scope milestone planning", icon: CalendarCheck },
    ],
    image: strategyImg,
    color: "#0a84ff",
  },
  {
    id: 2,
    title: "DESIGN",
    description:
      "We design intuitive admin interfaces, user dashboards, and mobile experiences engineered for maximum operational efficiency. Every screen is prototyped for speed, clarity, and zero user friction.",
    features: [
      { name: "Admin & Operations UI/UX", icon: LayoutDashboard },
      { name: "High-fidelity prototyping", icon: Smartphone },
      { name: "Design systems & component libraries", icon: Boxes },
      { name: "Micro-animations & motion polish", icon: Activity },
    ],
    image: designImg,
    color: "#ff7a00",
  },
  {
    id: 3,
    title: "DEVELOPMENT",
    description:
      "We engineer custom operations platforms, scalable web applications, and mobile apps built on resilient cloud infrastructure. Shipped with clean code, automated tests, and zero engineering compromises.",
    features: [
      { name: "Custom operations platforms & ERPs", icon: Server },
      { name: "Scalable web apps & SaaS engineering", icon: Globe },
      { name: "Cross-platform mobile apps (Flutter)", icon: Smartphone },
      { name: "Production AI & LLM integrations", icon: Bot },
    ],
    image: developmentImg,
    color: "#00f5d4",
  },
  {
    id: 4,
    title: "MAINTAIN",
    description:
      "We ensure your production systems run with 99.9% uptime and zero friction. We provide continuous support, cloud infrastructure management, security updates, and real-time system monitoring.",
    features: [
      { name: "Software support & SLA maintenance", icon: ShieldCheck },
      { name: "Cloud infrastructure & DevOps", icon: CloudCog },
      { name: "Real-time monitoring & security", icon: Activity },
      { name: "Dedicated senior engineering pods", icon: Users },
    ],
    image: maintainImg,
    color: "#22c55e",
  },
  {
    id: 5,
    title: "SCALE",
    description:
      "We architect systems built for high concurrency, large datasets, and enterprise scale. We refactor legacy codebases, implement automated CI/CD pipelines, and optimize database performance.",
    features: [
      { name: "Automated CI/CD pipelines", icon: Workflow },
      { name: "Legacy software modernization", icon: RefreshCw },
      { name: "DevOps & cloud infrastructure", icon: Cpu },
      { name: "Enterprise software architecture", icon: Boxes },
    ],
    image: scaleImg,
    color: "#a855f7",
  },
];

const OurSpeciality = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [direction, setDirection] = useState(1);
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLHeadingElement>();

  const activeContent = tabsData.find((t) => t.id === activeTab) || tabsData[0];

  const handleTabChange = (id: number) => {
    if (id === activeTab) return;
    setDirection(id > activeTab ? 1 : -1);
    setActiveTab(id);
  };

  return (
    <section className="relative bg-black text-white py-16 sm:py-20 md:py-24 px-4 md:px-6 overflow-hidden">
      {/* Ambient section glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 65% 45% at 65% 50%, ${activeContent.color}15 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <SectionBadge
            icon={<Layers className="w-3.5 h-3.5" />}
            text="Our Specialty"
            badgeLabel="Full-Cycle Execution"
            color="#0a84ff"
            className="mb-3"
          />
          <h2
            ref={titleRef}
            className={`font-barlow text-2xl md:text-4xl font-bold tracking-tight ${getBlurAnimationClasses(
              isTitleVisible
            )}`}
          >
            Our Specialty
          </h2>
        </div>

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
              className={getBlurAnimationClasses(isVisible)}
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

            <div className="relative z-10 rounded-2xl md:rounded-3xl overflow-hidden w-full border border-white/[0.09] bg-white/[0.03] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <AnimatedGridBg />

              {/* Ambient glows */}
              <div
                className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-colors duration-700 ease-out"
                style={{ backgroundColor: `${activeContent.color}35` }}
              />
              <div
                className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-[90px] pointer-events-none transition-colors duration-700 ease-out"
                style={{ backgroundColor: `${activeContent.color}25` }}
              />

              {/* Framer Motion animated card content with smooth GPU transitions */}
              <div className="relative z-10 p-6 md:p-8 lg:p-9 min-h-[420px] md:min-h-[400px] flex flex-col justify-center overflow-hidden">
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
                    <div className="mb-5 md:mb-6">
                      <h3
                        className="font-barlow font-bold text-xl md:text-2xl mb-2 transition-colors duration-300 tracking-wide"
                        style={{ color: activeContent.color }}
                      >
                        {activeContent.title}
                      </h3>
                      <p className="text-gray-300/90 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
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
                              className="feature-card group relative flex items-center justify-between gap-3.5 py-3 px-4 rounded-xl md:rounded-2xl border border-white/[0.1] bg-white/[0.06] hover:bg-white/[0.1] transition-all duration-300 cursor-default select-none overflow-hidden hover:-translate-y-[1px] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
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
                        <div className="relative w-full max-w-[250px] mx-auto transform-gpu">
                          <img
                            src={activeContent.image}
                            alt={activeContent.title}
                            loading="eager"
                            decoding="async"
                            className="relative z-10 w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
                          />
                          <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[70px] opacity-35 pointer-events-none transition-colors duration-500"
                            style={{ backgroundColor: activeContent.color }}
                          />
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
    </section>
  );
};

export default OurSpeciality;

