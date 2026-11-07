import { Link } from "react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TIMELINE } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import HeroCoreDiagram from "./heroCoreDiagram";
import { ArrowBubble, Magnetic, useHeroPointer, useSafeReducedMotion } from "./heroMotion";

// Short enough that each line holds at lg; the last line carries the gradient.
const HEADLINE_LINES = ["Stop Running Your", "Business on Manual", "Work. Run It on"];
const HEADLINE_ACCENT = "Custom AI & Software.";
const STACK_LINE = ["OpenAI", "Anthropic", "ElevenLabs", "React", "Next.js", "NestJS", "FastAPI", "Flutter", "PostgreSQL"];
/** How often the diagram (and stack line) moves its highlight on. */
const CYCLE_MS = 2800;

/** CSS entrance (never a Framer initial state: the h1 is the LCP element). */
const rise = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

const BannerHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();
  const inView = useInView(sectionRef, { amount: 0.15 });
  const live = inView && !reduce;

  // Mouse-only effects; also off for touch, where onPointerMove ignores them.
  const pointer = useHeroPointer(!reduce);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${pointer.px}px ${pointer.py}px, rgba(10, 132, 255, 0.11), transparent 65%)`;

  // As the hero scrolls away the diagram recedes and the copy drifts up.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const diagramY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const diagramScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.9]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -30]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.35]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setTick((n) => n + 1), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [live]);
  const stackIndex = tick % STACK_LINE.length;

  return (
    <section
      ref={sectionRef}
      onPointerMove={pointer.onPointerMove}
      onPointerLeave={pointer.onPointerLeave}
      className="relative bg-black text-white overflow-hidden min-h-screen flex flex-col justify-center"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_60%_45%,black_10%,transparent_65%)]" />
        <motion.div
          className="absolute -top-24 right-[-10%] size-[34rem] rounded-full bg-blue-500/15 blur-3xl"
          animate={live ? { x: [0, -60, 30, 0], y: [0, 40, -20, 0], scale: [1, 1.12, 0.95, 1] } : { x: 0, y: 0, scale: 1 }}
          transition={live ? { duration: 22, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
        />
        <motion.div
          className="absolute bottom-[-6rem] right-[20%] size-[26rem] rounded-full bg-teal-400/10 blur-3xl"
          animate={live ? { x: [0, 50, -40, 0], y: [0, -30, 20, 0], scale: [1, 0.92, 1.1, 1] } : { x: 0, y: 0, scale: 1 }}
          transition={live ? { duration: 18, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
        />
        <motion.div className="absolute inset-0" style={{ background: spotlight, opacity: pointer.spotOpacity }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 lg:gap-8 items-center">
          <motion.div className="space-y-5 sm:space-y-6" style={{ y: copyY, opacity: copyOpacity }}>
            <p
              className="wl-hero-rise relative inline-flex max-w-full items-center gap-2 overflow-hidden rounded-2xl sm:rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase leading-relaxed tracking-[0.08em] text-gray-200 sm:text-[11px] sm:tracking-[0.1em]"
              style={rise(0)}
            >
              <span aria-hidden="true" className="relative flex size-1.5 shrink-0">
                {live && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary"
                    animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <span className="relative size-1.5 rounded-full bg-primary" />
              </span>
              <span>AI-First Software Engineering · {TIMELINE.min}–{TIMELINE.max} Week Sprints</span>
              {live && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/15 to-transparent"
                  initial={{ x: "-120%" }}
                  animate={{ x: "380%" }}
                  transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 5, delay: 1.2 }}
                />
              )}
            </p>

            <h1 className="font-barlow text-[2.1rem] sm:text-5xl lg:text-[3.4rem] xl:text-6xl font-bold leading-[1.04] tracking-tight">
              {HEADLINE_LINES.map((line, i) => (
                <span key={line} className="wl-hero-rise block" style={rise(60 + i * 70)}>
                  {line}
                </span>
              ))}
              <span className="wl-hero-rise block" style={rise(270)}>
                <motion.span
                  className="wl-hero-gradient inline-block pb-1"
                  animate={live ? { backgroundPosition: ["0% 50%", "100% 50%"] } : undefined}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                >
                  {HEADLINE_ACCENT}
                </motion.span>
              </span>
            </h1>

            <p
              className="wl-hero-rise max-w-xl text-[15px] sm:text-base md:text-lg text-gray-300/90 leading-relaxed"
              style={rise(360)}
            >
              We build production AI workflows, 24/7 voice and RAG agents, custom operations platforms, and full-stack
              web &amp; mobile apps for high-growth teams. Fixed-scope sprints shipped in {TIMELINE.range} with 100% IP
              ownership.
            </p>

            <div className="wl-hero-rise flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap" style={rise(440)}>
              <Magnetic enabled={!reduce}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex flex-1 min-h-13 cursor-pointer items-center justify-between gap-4 rounded-full bg-primary-solid hover:bg-primary-solid-hover py-1.5 pl-6 pr-1.5 font-barlow text-sm font-semibold text-white shadow-[0_4px_20px_rgba(10,132,255,0.35)] hover:shadow-[0_6px_32px_rgba(10,132,255,0.55)] transition-[background-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Book a Discovery Call
                  <ArrowBubble className="flex size-10 items-center justify-center rounded-full bg-white text-primary-solid">
                    <ArrowUpRight className="size-4" />
                  </ArrowBubble>
                </button>
              </Magnetic>
              <Magnetic enabled={!reduce}>
                <Link
                  to="/calculator"
                  className="inline-flex flex-1 min-h-13 items-center justify-between gap-4 rounded-full border border-white/15 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08] py-1.5 pl-6 pr-1.5 font-barlow text-sm font-semibold text-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Get a 2-Min Estimate
                  <ArrowBubble className="flex size-10 items-center justify-center rounded-full bg-white/[0.08] text-white">
                    <ArrowUpRight className="size-4" />
                  </ArrowBubble>
                </Link>
              </Magnetic>
            </div>

            <p className="wl-hero-rise pt-2 font-mono text-[11px] sm:text-xs text-gray-400 leading-relaxed" style={rise(520)}>
              {STACK_LINE.map((name, i) => (
                <span key={name}>
                  {i > 0 && <span aria-hidden="true"> · </span>}
                  <span
                    className={cn(
                      "relative inline-block transition-colors duration-500",
                      live && i === stackIndex && "text-primary",
                    )}
                  >
                    {name}
                    {live && i === stackIndex && (
                      <motion.span
                        layoutId="hero-stack-highlight"
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 right-0 h-px rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 260, damping: 28 }}
                      />
                    )}
                  </span>
                </span>
              ))}
            </p>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-[400px] sm:max-w-[540px] lg:max-w-none"
            style={{ y: diagramY, scale: diagramScale }}
          >
            <HeroCoreDiagram live={live} reduce={reduce} tick={tick} pointer={pointer} interactive={!reduce} />
          </motion.div>
        </div>
      </div>

      {/* Scroll mouse indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
        animate={live ? { y: [0, 6, 0] } : { y: 0 }}
        transition={live ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
      >
        <div className="w-[22px] h-[34px] rounded-full border-2 border-white/50 flex justify-center pt-[5px]">
          <div className="w-[3px] h-[6px] bg-white rounded-full animate-scroll-dot" />
        </div>
        <span className="text-[9px] uppercase tracking-[0.15em] text-white/50 font-barlow">Scroll</span>
      </motion.div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default BannerHome;
