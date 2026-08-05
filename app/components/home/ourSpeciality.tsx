import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import AnimatedGridBg, { type AnimatedGridBgRef } from "../ui/animated-grid-bg";
import VerticalTabs from "../ui/vertical-tabs";
import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import strategyImg from "~/assets/strategy.png";
import designImg from "~/assets/design.png";
import developmentImg from "~/assets/development.png";
import maintainImg from "~/assets/maintain.png";
import scaleImg from "~/assets/scale.png";

import productPlanningIcon from "~/assets/product-planning.svg";
import leanDevelopmentIcon from "~/assets/lean-development.svg";
import valueEngineeringIcon from "~/assets/value-engineering.svg";
import accessibilityIcon from "~/assets/accessibility-complience.svg";
import uiUxIcon from "~/assets/ui-ux.svg";
import prototypingIcon from "~/assets/prototyping.svg";
import threeDDesignsIcon from "~/assets/3d-designs.svg";
import customSoftwareIcon from "~/assets/custom-software.svg";
import webApplicationIcon from "~/assets/web-application.svg";
import virtualRealityIcon from "~/assets/virtual-reality.svg";
import augmentedRealityIcon from "~/assets/augmented-reality.svg";
import cloudManagementIcon from "~/assets/cloud-management.svg";
import dedicatedTeamsIcon from "~/assets/dedicated-teams.svg";
import ciCdIcon from "~/assets/ci-cd.svg";
import devopsIcon from "~/assets/devops.svg";
import softwareArchitectureIcon from "~/assets/software-archotecture.svg";

interface FeatureItem {
  name: string;
  icon: string;
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
      { name: "Product & system architecture", icon: productPlanningIcon },
      { name: "Operational workflow mapping", icon: leanDevelopmentIcon },
      { name: "Technical feasibility & ROI", icon: valueEngineeringIcon },
      { name: "Fixed-scope milestone planning", icon: accessibilityIcon },
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
      { name: "Admin & Operations UI/UX", icon: uiUxIcon },
      { name: "High-fidelity prototyping", icon: prototypingIcon },
      { name: "Design systems & component libraries", icon: threeDDesignsIcon },
      { name: "Micro-animations & motion polish", icon: valueEngineeringIcon },
    ],
    image: designImg,
    color: "#9d4edd",
  },
  {
    id: 3,
    title: "DEVELOPMENT",
    description:
      "We engineer custom operations platforms, scalable web applications, and mobile apps built on resilient cloud infrastructure. Shipped with clean code, automated tests, and zero engineering compromises.",
    features: [
      { name: "Custom operations platforms & ERPs", icon: customSoftwareIcon },
      { name: "Scalable web apps & SaaS engineering", icon: webApplicationIcon },
      { name: "Cross-platform mobile apps (Flutter)", icon: customSoftwareIcon },
      { name: "Production AI & LLM integrations", icon: productPlanningIcon },
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
      { name: "Software support & SLA maintenance", icon: customSoftwareIcon },
      { name: "Cloud infrastructure & DevOps", icon: cloudManagementIcon },
      { name: "Real-time monitoring & security", icon: webApplicationIcon },
      { name: "Dedicated senior engineering pods", icon: dedicatedTeamsIcon },
    ],
    image: maintainImg,
    color: "#3a86ff",
  },
  {
    id: 5,
    title: "SCALE",
    description:
      "We architect systems built for high concurrency, large datasets, and enterprise scale. We refactor legacy codebases, implement automated CI/CD pipelines, and optimize database performance.",
    features: [
      { name: "Automated CI/CD pipelines", icon: ciCdIcon },
      { name: "Legacy software modernization", icon: productPlanningIcon },
      { name: "DevOps & cloud infrastructure", icon: devopsIcon },
      { name: "Enterprise software architecture", icon: softwareArchitectureIcon },
    ],
    image: scaleImg,
    color: "#ff007f",
  },
];

const OurSpeciality = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [targetTab, setTargetTab] = useState(1);
  const lastStepTimeRef = useRef<number>(Date.now());
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();
  const gridBgRef = useRef<AnimatedGridBgRef>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLHeadingElement>();
  const [cardRef, isCardVisible] = useBlurAnimation<HTMLDivElement>();
  const [descriptionRef, isDescriptionVisible] =
    useBlurAnimation<HTMLParagraphElement>();
  const [featuresRef, isFeaturesVisible] = useBlurAnimation<HTMLDivElement>();
  const [imageRef, isImageVisible] = useBlurAnimation<HTMLDivElement>();

  const activeContent = tabsData.find((tab) => tab.id === activeTab) || tabsData[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.5,
    restDelta: 0.001,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) return;
    const numTabs = tabsData.length;
    const clampedProgress = Math.max(0, Math.min(0.999, latest));
    const rawTab = Math.floor(clampedProgress * numTabs) + 1;

    setTargetTab(rawTab);
  });

  // Enforce 450ms velocity-adaptive dwell time per tab step (1 -> 2 -> 3 -> 4 -> 5)
  useEffect(() => {
    if (isMobile) {
      setActiveTab(targetTab);
      return;
    }
    if (targetTab !== activeTab) {
      const now = Date.now();
      const elapsed = now - lastStepTimeRef.current;
      const STEP_DWELL_MS = 450; // 0.45s adaptive step dwell

      if (elapsed >= STEP_DWELL_MS) {
        const nextTab = targetTab > activeTab ? activeTab + 1 : activeTab - 1;
        setActiveTab(nextTab);
        lastStepTimeRef.current = Date.now();
      } else {
        const timer = setTimeout(() => {
          const nextTab = targetTab > activeTab ? activeTab + 1 : activeTab - 1;
          setActiveTab(nextTab);
          lastStepTimeRef.current = Date.now();
        }, STEP_DWELL_MS - elapsed);
        return () => clearTimeout(timer);
      }
    }
  }, [targetTab, activeTab, isMobile]);

  const handleTabChange = (id: number) => {
    setActiveTab(id);
    setTargetTab(id);
    lastStepTimeRef.current = Date.now();
    if (!isMobile && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const sectionTop = rect.top + scrollTop;
      const scrollableDistance =
        sectionRef.current.offsetHeight - window.innerHeight;
      if (scrollableDistance > 0) {
        const progressFraction = (id - 0.5) / tabsData.length;
        const targetY = sectionTop + progressFraction * scrollableDistance;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gridBgRef.current) {
      gridBgRef.current.handleMouseMove(e);
    }
  };

  const handleMouseLeave = () => {
    if (gridBgRef.current) {
      gridBgRef.current.handleMouseLeave();
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (!isMobile) return;
    const threshold = 100;
    if (info.offset.x > threshold && activeTab > 1) {
      setActiveTab(activeTab - 1);
    } else if (info.offset.x < -threshold && activeTab < tabsData.length) {
      setActiveTab(activeTab + 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative" }}
      className="bg-black text-white px-4 md:px-6 md:h-[400vh] h-auto overflow-visible"
    >
      {/* Ambient section-level glow that bleeds behind sticky container */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 70% 50%, ${activeContent.color}15 0%, transparent 70%)`,
        }}
      />

      <div
        ref={containerRef}
        className="md:sticky md:top-0 md:h-screen md:flex md:flex-col md:items-center md:justify-center py-10 md:py-0 max-w-7xl mx-auto w-full relative z-10"
      >
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <motion.span
            key={activeTab}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-[0.2em] uppercase mb-4"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: activeContent.color }}
            />
            <span style={{ color: activeContent.color }}>
              Step 0{activeTab}
            </span>
            <span className="text-white/30">of 0{tabsData.length}</span>
          </motion.span>
          <h2
            ref={titleRef}
            className={`font-barlow text-2xl md:text-4xl font-bold ${getBlurAnimationClasses(isTitleVisible)}`}
          >
            Our Specialty
          </h2>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center w-full">
          {/* Left: Vertical Tabs */}
          <div className="w-full lg:w-auto lg:shrink-0">
            <VerticalTabs
              tabs={tabsData}
              activeTab={activeTab}
              onTabChange={(id) => handleTabChange(id as number)}
              className={getBlurAnimationClasses(isVisible)}
            />
          </div>

          {/* Right: Content Card */}
          <div className="w-full lg:flex-1 min-w-0">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeContent.id}
                drag={isMobile ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 8, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.985 }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative rounded-2xl md:rounded-3xl overflow-hidden w-full"
              >
                {/* Card Glass Background */}
                <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl md:rounded-3xl" />

                {/* Signature Weblaud Animated Grid Background */}
                <AnimatedGridBg ref={gridBgRef} />

                {/* Dynamic Ambient Glow — Top Left */}
                <motion.div
                  className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
                  animate={{
                    opacity: [0.35, 0.55, 0.35],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ backgroundColor: activeContent.color }}
                />
                {/* Dynamic Ambient Glow — Bottom Right */}
                <motion.div
                  className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  style={{ backgroundColor: activeContent.color }}
                />

                {/* Card Content */}
                <div className="relative z-10 p-6 md:p-10 lg:p-12">
                  {/* Title + Description */}
                  <div className="mb-6 md:mb-8">
                    <motion.h3
                      key={`title-${activeContent.id}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.05 }}
                      className="font-barlow font-bold text-xl md:text-2xl mb-2"
                      style={{ color: activeContent.color }}
                    >
                      {activeContent.title}
                    </motion.h3>
                    <motion.p
                      key={`desc-${activeContent.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl"
                    >
                      {activeContent.description}
                    </motion.p>
                  </div>

                  {/* Features + Image Grid */}
                  <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                    {/* Feature Chips */}
                    <div className="flex flex-col gap-3">
                      {activeContent.features.map((feature, index) => (
                        <motion.div
                          key={feature.name}
                          initial={{
                            opacity: 0,
                            x: -16,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.35,
                            delay: 0.12 + index * 0.08,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          whileHover={{
                            x: 6,
                            transition: { duration: 0.2, ease: "easeOut" },
                          }}
                          className="flex items-center gap-3 group py-2.5 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300 cursor-default"
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 p-1.5"
                            style={{
                              backgroundColor: `${activeContent.color}20`,
                            }}
                          >
                            <img
                              src={feature.icon}
                              alt={feature.name}
                              className="w-full h-full object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                          <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-200">
                            {feature.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* 3D Image */}
                    <motion.div
                      key={`img-${activeContent.id}`}
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                        rotate: -8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="hidden md:flex items-center justify-center"
                    >
                      <div className="relative w-full max-w-[280px] mx-auto">
                        <motion.img
                          src={activeContent.image}
                          alt={activeContent.title}
                          className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                          whileHover={{ scale: 1.04, rotate: 2 }}
                          transition={{
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                        />
                        {/* Image accent glow */}
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] opacity-25 pointer-events-none"
                          style={{ backgroundColor: activeContent.color }}
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Pagination Dots */}
            {isMobile && (
              <div className="flex justify-center gap-2 mt-6 lg:hidden">
                {tabsData.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as number)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-primary w-6"
                        : "bg-white/20 hover:bg-white/40 w-2"
                    }`}
                    aria-label={`Go to ${tab.title}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSpeciality;

