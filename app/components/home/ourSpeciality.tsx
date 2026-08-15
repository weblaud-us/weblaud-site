import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import {
  Layers,
  GitBranch,
  TrendingUp,
  CalendarCheck,
  LayoutDashboard,
  Smartphone,
  Boxes,
  Sparkles,
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
import AnimatedGridBg from "../ui/animated-grid-bg";
import VerticalTabs from "../ui/vertical-tabs";
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
      { name: "Micro-animations & motion polish", icon: Sparkles },
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
    color: "#3a86ff",
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
    color: "#ff007f",
  },
];

const OurSpeciality = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [displayTab, setDisplayTab] = useState(1);
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLHeadingElement>();
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const animTlRef = useRef<gsap.core.Timeline | null>(null);

  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  const suppressScrollStepRef = useRef(false); // Prevents scroll-driven step changes during tab clicks

  const activeContent = tabsData.find((t) => t.id === displayTab) || tabsData[0];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ─── Stacked Card Peel Transition (Lenis-style) ───────────────────────────────
  const runTabTransition = useCallback((nextTab: number, dir: number) => {
    const el = contentRef.current;
    if (!el) {
      setDisplayTab(nextTab);
      return;
    }

    if (animTlRef.current) {
      animTlRef.current.kill();
      animTlRef.current = null;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        animTlRef.current = null;
        gsap.set(el, { clearProps: "rotationZ,rotationX" });
      },
    });
    animTlRef.current = tl;

    // ── Card peels away (lifts off the stack with rotation) ──
    tl.to(el, {
      opacity: 0,
      y: dir * -50,
      x: dir * -12,
      scale: 0.88,
      rotationZ: dir * -3,
      rotationX: dir * 4,
      duration: 0.22,
      ease: "power3.in",
    });

    // ── Swap content ──
    tl.add(() => {
      setDisplayTab(nextTab);
    });

    // ── New card emerges from behind the stack ──
    tl.fromTo(
      el,
      {
        opacity: 0,
        y: dir * 40,
        x: dir * 8,
        scale: 0.92,
        rotationZ: dir * 2,
        rotationX: dir * -3,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotationZ: 0,
        rotationX: 0,
        duration: 0.38,
        ease: "back.out(1.4)",
      }
    );
  }, []);

  // ─── Tab Click Handler (scrolls to matching position) ──────────────────────────
  const handleTabChange = useCallback(
    (id: number) => {
      if (id === activeTabRef.current) return;
      const dir = id > activeTabRef.current ? 1 : -1;
      activeTabRef.current = id;
      setActiveTab(id);
      runTabTransition(id, dir);

      // Scroll to the correct position in the 450vh section for this step
      const section = sectionRef.current;
      if (section && !isMobile) {
        suppressScrollStepRef.current = true;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const scrollableDistance = section.offsetHeight - window.innerHeight;
        const progress = (id - 1) / tabsData.length;
        const targetScroll = sectionTop - 64 + progress * scrollableDistance;

        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(targetScroll, {
            duration: 0.6,
            onComplete: () => { suppressScrollStepRef.current = false; },
          });
        } else {
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
          setTimeout(() => { suppressScrollStepRef.current = false; }, 700);
        }
      }
    },
    [runTabTransition, isMobile]
  );

  // ─── Scroll-Driven Step Detection (scrollbar moves naturally) ────────────────
  useEffect(() => {
    if (isMobile) return;

    const NAVBAR_HEIGHT = 64;
    let prevStep = activeTabRef.current;

    const onScroll = () => {
      if (suppressScrollStepRef.current) return;

      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const vh = window.innerHeight;
      const scrollableDistance = sectionHeight - vh;

      if (scrollableDistance <= 0) return;

      // Progress: 0 = section top at navbar, 1 = section bottom at viewport bottom
      const scrolled = NAVBAR_HEIGHT - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // Map progress to step 1-5
      const stepCount = tabsData.length;
      let newStep: number;
      if (progress >= 1) {
        newStep = stepCount;
      } else if (progress <= 0) {
        newStep = 1;
      } else {
        newStep = Math.min(stepCount, Math.floor(progress * stepCount) + 1);
      }

      if (newStep !== prevStep) {
        const dir = newStep > prevStep ? 1 : -1;
        prevStep = newStep;
        activeTabRef.current = newStep;
        setActiveTab(newStep);
        runTabTransition(newStep, dir);
      }
    };

    // Listen via both Lenis and native scroll for maximum compatibility
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.on("scroll", onScroll);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (lenis) {
        lenis.off("scroll", onScroll);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile, runTabTransition]);

  // ─── Mobile Touch Swipe ──────────────────────────────────────────────────────
  const touchStartXRef = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0 && activeTabRef.current < tabsData.length) {
        handleTabChange(activeTabRef.current + 1);
      } else if (deltaX > 0 && activeTabRef.current > 1) {
        handleTabChange(activeTabRef.current - 1);
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white px-4 md:px-6 lg:h-[450vh] h-auto overflow-visible"
    >
      {/* Ambient section glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 65% 45% at 65% 50%, ${activeContent.color}15 0%, transparent 70%)`,
        }}
      />

      {/* Sticky container: stays pinned below navbar while tall section scrolls */}
      <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:flex lg:flex-col lg:items-center lg:justify-center py-12 lg:py-0 max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-5 lg:mb-7">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-[0.2em] uppercase mb-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <span
              className="w-2 h-2 rounded-full animate-pulse transition-colors duration-500"
              style={{
                backgroundColor: activeContent.color,
                boxShadow: `0 0 10px ${activeContent.color}`,
              }}
            />
            <span
              className="transition-colors duration-500 font-semibold"
              style={{ color: activeContent.color }}
            >
              Step 0{activeTab}
            </span>
            <span className="text-white/30">of 0{tabsData.length}</span>
            <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-2 border-l border-white/10">
              {tabsData.map((tab) => (
                <span
                  key={tab.id}
                  className={`h-1.5 rounded-full transition-all duration-500 ${tab.id === activeTab
                      ? "w-4"
                      : tab.id < activeTab
                        ? "w-1.5 bg-white/40"
                        : "w-1.5 bg-white/15"
                    }`}
                  style={
                    tab.id === activeTab
                      ? {
                        backgroundColor: tab.color,
                        boxShadow: `0 0 8px ${tab.color}`,
                      }
                      : {}
                  }
                />
              ))}
            </div>
          </div>
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

          {/* Right: Content Card with 3D Perspective */}
          <div className="w-full lg:flex-1 min-w-0" style={{ perspective: "1200px" }}>
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden w-full border border-white/[0.09] bg-white/[0.03] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
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

              {/* GSAP-animated content wrapper */}
              <div
                ref={contentRef}
                className="relative z-10 p-6 md:p-8 lg:p-9 min-h-[420px] md:min-h-[400px] flex flex-col justify-center transform-gpu"
                style={{ willChange: "transform, opacity" }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Title + Description */}
                <div className="mb-5 md:mb-6">
                  <h3
                    className="font-barlow font-bold text-xl md:text-2xl mb-2 transition-colors duration-500 tracking-wide"
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
                          className="group relative flex items-center justify-between gap-3.5 py-2.5 px-3.5 rounded-xl md:rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300 backdrop-blur-sm cursor-default"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 border"
                              style={{
                                backgroundColor: `${activeContent.color}15`,
                                borderColor: `${activeContent.color}35`,
                                color: activeContent.color,
                                boxShadow: `0 0 12px ${activeContent.color}18`,
                              }}
                            >
                              <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors duration-300 truncate">
                              {feature.name}
                            </span>
                          </div>
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0"
                            style={{
                              backgroundColor: `${activeContent.color}20`,
                              color: activeContent.color,
                            }}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    <div className="relative w-full max-w-[250px] mx-auto">
                      <img
                        src={activeContent.image}
                        alt={activeContent.title}
                        className="relative z-10 w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
                      />
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[70px] opacity-35 pointer-events-none transition-colors duration-500"
                        style={{ backgroundColor: activeContent.color }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Pagination */}
              {isMobile && (
                <div className="flex justify-center gap-2 pb-6 lg:hidden">
                  {tabsData.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${activeTab === tab.id
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
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSpeciality;
