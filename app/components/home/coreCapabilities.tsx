import { useId, useRef } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import { ArrowDown, ArrowLeftRight, ArrowUpRight, Check, CircleDot, Minus, Plus, Quote } from "lucide-react";
import { AUTOMATION, TIMELINE } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { useScrollSteps } from "~/hooks/useScrollSteps";
import { HomeSectionHeading } from "./homeSectionHeading";

type Preview = "workflow" | "voice" | "rag" | "ops" | "saas" | "mobile";

interface Capability {
  id: string;
  number: string;
  title: string;
  /** Vertical label on the collapsed desktop strip. */
  shortTitle: string;
  description: string;
  /** Outcomes only, never guarantees: figures come from lib/constants. */
  outcome: string;
  stack: string[];
  preview: Preview;
}

const CAPABILITIES: Capability[] = [
  {
    id: "ai-workflows",
    number: "01",
    title: "AI Workflow Automation & Agents",
    shortTitle: "AI Workflows",
    description:
      "Replace repetitive back-office bottlenecks with autonomous multi-step agents, omnichannel lead triage, and automated CRM/ERP synchronization.",
    outcome: `${AUTOMATION.percentLabel} Time Saved`,
    stack: ["LangChain", "OpenAI", "Custom Pipelines"],
    preview: "workflow",
  },
  {
    id: "voice-ai",
    number: "02",
    title: "24/7 AI Voice Receptionists & Audio AI",
    shortTitle: "Voice AI",
    description:
      "Deploy ultra-low-latency voice agents that answer calls, qualify leads, book appointments, and sync directly with your calendar and database 24/7.",
    outcome: "24/7 Call Capture",
    stack: ["ElevenLabs", "Twilio", "WebSockets"],
    preview: "voice",
  },
  {
    id: "rag-search",
    number: "03",
    title: "RAG Knowledge Assistants & Vision AI",
    shortTitle: "RAG & Vision AI",
    description:
      "Turn scattered PDFs, invoices, Slack threads, and SQL databases into instant, citation-backed internal search and automated document extraction pipelines.",
    outcome: "Cited Answers",
    stack: ["Vector DBs", "OCR", "Vision LLMs"],
    preview: "rag",
  },
  {
    id: "operations",
    number: "04",
    title: "Custom Operations Platforms & Portals",
    shortTitle: "Ops Platforms",
    description:
      "Retire fragile spreadsheets with centralized admin dashboards, role-based team portals, inventory systems, and automated reporting built around your workflows.",
    outcome: "One Source of Truth",
    stack: ["React", "Next.js", "PostgreSQL"],
    preview: "ops",
  },
  {
    id: "b2b-saas",
    number: "05",
    title: "B2B SaaS & Full-Stack Web Applications",
    shortTitle: "B2B SaaS",
    description:
      "Launch multi-tenant SaaS products from MVP to enterprise scale—complete with subscription billing, RBAC permissions, and high-throughput APIs.",
    outcome: `${TIMELINE.min}–${TIMELINE.max} Wk Launch`,
    stack: ["NestJS", "FastAPI", "Stripe"],
    preview: "saas",
  },
  {
    id: "mobile-apps",
    number: "06",
    title: "Cross-Platform Mobile Applications",
    shortTitle: "Mobile Apps",
    description:
      "Ship sleek, native-feeling iOS and Android apps powered by real-time backends, offline sync, push notifications, and embedded AI features.",
    outcome: "Unified Codebase",
    stack: ["Flutter", "React Native"],
    preview: "mobile",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const ROW = "flex items-center justify-between gap-3 whitespace-nowrap rounded-lg border border-white/[0.06] bg-[var(--bg-surface,#12151A)] px-3 py-2";
const HIGHLIGHT_ROW = "flex items-center justify-between gap-3 whitespace-nowrap rounded-lg border border-primary/30 bg-primary/10 px-3 py-2";

/** A small sketch of what each build does once it is live. Decorative copy of
 *  the description, so it is hidden from assistive tech. */
function MicroPreview({ kind }: { kind: Preview }) {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[180px] pin-compact:min-h-[150px] flex-col justify-center rounded-2xl border border-white/[0.08] bg-black p-4 font-mono text-[11px] xl:p-5 xl:text-xs text-white shadow-inner"
    >
      {kind === "workflow" && (
        <div className="space-y-2.5">
          <div className={ROW}>
            <span className="text-gray-400">Lead Ingestion</span>
            <span className="inline-flex items-center gap-1 text-emerald-400"><Check className="size-3" /> Verified</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-primary"><ArrowDown className="size-3" /> AI Extraction</div>
          <div className={HIGHLIGHT_ROW}>
            <span>CRM &amp; ERP Sync</span>
            <span className="font-bold text-primary">Auto-Routed</span>
          </div>
        </div>
      )}

      {kind === "voice" && (
        <div className="space-y-4 text-center">
          <div className="flex h-10 items-center justify-center gap-1.5">
            {[40, 70, 100, 50, 80, 30, 90, 60].map((height, i) => (
              <span
                key={i}
                className="wl-wave w-1.5 rounded-full bg-primary"
                style={{ height: `${height}%`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-400/15 px-2.5 py-1 text-[10px] text-emerald-400">
            <CircleDot className="size-3" /> Active Call: Appointment Booked
          </span>
        </div>
      )}

      {kind === "rag" && (
        <div className="space-y-2.5">
          <div className={ROW}>
            <span className="truncate">Invoice_Q3_Audit.pdf</span>
            <span className="shrink-0 text-primary">Vectorized</span>
          </div>
          <div className={cn(HIGHLIGHT_ROW, "flex-col items-start gap-1")}>
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400"><Quote className="size-3" /> Citation Result</span>
            <span className="truncate">“Matched clause in Section 4.2”</span>
          </div>
        </div>
      )}

      {kind === "ops" && (
        <div className="space-y-2">
          {[
            ["PO-2041 · Inventory", "Approved"],
            ["PO-2042 · Field team", "Approved"],
            ["PO-2043 · Finance", "In review"],
          ].map(([label, status]) => (
            <div key={label} className={ROW}>
              <span className="truncate text-gray-400">{label}</span>
              <span className={cn("shrink-0", status === "Approved" ? "text-emerald-400" : "text-primary")}>{status}</span>
            </div>
          ))}
        </div>
      )}

      {kind === "saas" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Active Workspaces</span>
            <span className="font-bold text-emerald-400">128 Tenants</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface,#12151A)]">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>
          <p className="inline-flex items-center justify-end gap-1 text-right text-[10px] text-gray-400">
            Stripe Billing Active <Check className="size-3 text-emerald-400" />
          </p>
        </div>
      )}

      {kind === "mobile" && (
        <div className="flex items-center justify-center gap-4">
          {["iOS App", "Android App"].map((platform, i) => (
            <div key={platform} className="contents">
              {i === 1 && <ArrowLeftRight className="size-4 text-primary" />}
              <div className="rounded-lg border border-white/10 bg-[var(--bg-surface,#12151A)] px-3 py-2 text-center">
                <p className="text-[10px] text-gray-400">{platform}</p>
                <p className="font-bold text-emerald-400">Synced</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StackChips({ stack }: { stack: string[] }) {
  return (
    <ul aria-label="Built with" className="flex flex-wrap gap-2">
      {stack.map((tool) => (
        <li
          key={tool}
          className="rounded-md border border-white/[0.08] bg-[var(--bg-elevated,#1A1E26)] px-3 py-1 font-mono text-xs text-white"
        >
          {tool}
        </li>
      ))}
    </ul>
  );
}

function ExploreLink({ className }: { className?: string }) {
  return (
    <Link
      to="/calculator"
      className={cn(
        "group inline-flex min-h-11 items-center gap-1.5 font-barlow text-sm font-semibold text-primary hover:underline underline-offset-4",
        className,
      )}
    >
      Explore solution
      <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px" />
    </Link>
  );
}

const CoreCapabilities = () => {
  // On desktop the section pins and scrolling opens 01–06 in turn.
  const { trackRef, index, goTo } = useScrollSteps<HTMLElement>(CAPABILITIES.length);
  const active = CAPABILITIES[index];
  const setActiveId = (id: string) => goTo(CAPABILITIES.findIndex((c) => c.id === id));
  const baseId = useId();
  const focusPending = useRef(false);

  // The strip that was pressed is replaced by the open card's content, so focus
  // follows it to the new heading. A ref callback focuses the heading the
  // moment it mounts, rather than guessing at the animation timing.
  const openFromStrip = (id: string) => {
    focusPending.current = true;
    setActiveId(id);
  };
  const titleRef = (el: HTMLHeadingElement | null) => {
    if (el && focusPending.current) {
      focusPending.current = false;
      el.focus({ preventScroll: true });
    }
  };

  // flexGrow is not a transform, so MotionConfig's reducedMotion="user" in
  // root.tsx does not cover it; every transition here checks for itself.
  const reduce = useReducedMotion();
  // flexGrow animates layout every frame, so the spring is kept short: when
  // scroll drives the steps, content has to keep up with the wheel.
  const widthSpring: Transition = reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 40 };
  // The open card's content waits for the width to get going, then rises in
  // row by row; it leaves with a quick fade so collapsing feels snappy.
  const contentVariants: Variants = {
    hidden: {},
    show: { transition: { delayChildren: reduce ? 0 : 0.08, staggerChildren: reduce ? 0 : 0.04 } },
    exit: { opacity: 0, transition: { duration: reduce ? 0 : 0.1 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.28, ease: EASE } },
  };
  const previewVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0 : 0.32, ease: EASE } },
  };

  return (
    // Pinned: a 100svh + 6 × 40svh track (see useScrollSteps) with a sticky panel.
    <section
      ref={trackRef}
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="scroll-mt-24 bg-black px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 pin:h-[340svh] pin:py-0"
    >
      <div className="max-w-7xl mx-auto pin:sticky pin:top-0 pin:flex pin:h-svh pin:flex-col pin:justify-center pin:pt-20 pin:pb-6 pin-compact:pb-3">
        <HomeSectionHeading
          eyebrow="What We Build"
          title="Autonomous AI & Full-Stack Engineering Under One Roof"
          titleId="capabilities-title"
          subtitle="Every build is engineered around your operational logic, combining frontier AI intelligence with type-safe backend systems."
          pinned
        />

        {/* Desktop: a horizontal accordion that keeps 01–06 in order. Every
            item is a 64px strip; the open one grows into the remaining width,
            so the strips before it sit on its left and the rest on its right.
            Pinned, it shrinks to fit a 768px-tall laptop under the heading. */}
        <ul
          aria-label="Capabilities"
          className="hidden h-[560px] w-full gap-2 lg:flex pin:h-[clamp(400px,calc(100svh-340px),560px)] pin-compact:h-[clamp(330px,calc(100svh-250px),560px)]"
        >
          {CAPABILITIES.map((cap, index) => {
            const isOpen = cap.id === active.id;
            const panelId = `${baseId}-desk-${cap.id}`;
            return (
              <motion.li
                key={cap.id}
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24, flexGrow: isOpen ? 1 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                animate={{ flexGrow: isOpen ? 1 : 0 }}
                transition={{
                  flexGrow: widthSpring,
                  opacity: { duration: reduce ? 0 : 0.5, ease: EASE, delay: reduce ? 0 : index * 0.06 },
                  y: { duration: reduce ? 0 : 0.5, ease: EASE, delay: reduce ? 0 : index * 0.06 },
                }}
                style={{ flexBasis: 64, minWidth: 0 }}
                className={cn(
                  "relative overflow-hidden rounded-3xl border bg-[var(--bg-surface,#12151A)] transition-[border-color,box-shadow] duration-300",
                  isOpen ? "border-primary/40 shadow-2xl shadow-black/40" : "border-white/[0.08] hover:border-primary/50",
                )}
              >
                {/* Glow on the open card. A radial gradient, not a blur filter:
                    a blurred layer re-rasterises on every frame of the width
                    spring, a gradient is nearly free to repaint. */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.4 } }}
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 size-[32rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary)_10%,transparent)_0%,transparent_70%)]"
                  />
                )}

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    // Wider than the item while it grows, so text never reflows
                    // mid-animation; overflow-hidden on the item clips it.
                    <motion.div
                      key="open"
                      id={panelId}
                      role="region"
                      aria-labelledby={`${panelId}-title`}
                      variants={contentVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="absolute inset-y-0 left-0 z-10 flex w-full min-w-[560px] flex-col justify-between p-8 xl:min-w-[780px] xl:p-10 pin-compact:p-6 xl:pin-compact:p-7"
                    >
                      <motion.div variants={itemVariants} className="flex items-center justify-between">
                        <span className="font-mono text-3xl font-bold text-primary">{cap.number}</span>
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                          {cap.outcome}
                        </span>
                      </motion.div>

                      <div className="my-auto grid grid-cols-12 items-center gap-8 pin-compact:gap-6">
                        <div className="col-span-6 space-y-4 xl:col-span-7 pin-compact:space-y-3">
                          <motion.h3
                            variants={itemVariants}
                            id={`${panelId}-title`}
                            ref={titleRef}
                            tabIndex={-1}
                            className="font-barlow text-2xl font-bold tracking-tight text-white outline-none xl:text-3xl pin-compact:xl:text-2xl"
                          >
                            {cap.title}
                          </motion.h3>
                          <motion.p variants={itemVariants} className="text-sm leading-relaxed text-gray-400 xl:text-base">
                            {cap.description}
                          </motion.p>
                          <motion.div variants={itemVariants} className="pt-2">
                            <StackChips stack={cap.stack} />
                          </motion.div>
                        </div>
                        <motion.div variants={previewVariants} className="col-span-6 xl:col-span-5">
                          <MicroPreview kind={cap.preview} />
                        </motion.div>
                      </div>

                      <motion.div
                        variants={itemVariants}
                        className="flex items-center justify-between border-t border-white/[0.08] pt-6 pin-compact:pt-3"
                      >
                        <span className="font-mono text-xs text-gray-400">Scoped &amp; shipped in {TIMELINE.rangeShort}</span>
                        <ExploreLink />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="strip"
                      type="button"
                      onClick={() => openFromStrip(cap.id)}
                      aria-label={`Show ${cap.title}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0.15 } }}
                      exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.1 } }}
                      whileHover="hover"
                      whileTap={reduce ? undefined : { scale: 0.98 }}
                      className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-between px-2 py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                    >
                      <span className="font-mono text-sm font-bold text-gray-400 transition-colors duration-200 group-hover:text-primary">
                        {cap.number}
                      </span>
                      <motion.span
                        variants={{ hover: { y: reduce ? 0 : -2 } }}
                        className="rotate-180 whitespace-nowrap py-4 font-barlow text-sm font-semibold tracking-wide text-white [writing-mode:vertical-rl]"
                      >
                        {cap.shortTitle}
                      </motion.span>
                      <motion.span
                        variants={{ hover: { scale: reduce ? 1 : 1.5 } }}
                        className="size-2 rounded-full bg-[var(--bg-elevated,#1A1E26)] transition-colors duration-200 group-hover:bg-primary"
                      />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>

        {/* Below lg: a stacked accordion with one card open at a time. */}
        <ul className="space-y-3 lg:hidden">
          {CAPABILITIES.map((cap) => {
            const isOpen = cap.id === active.id;
            const panelId = `${baseId}-${cap.id}`;
            return (
              <li
                key={cap.id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-[var(--bg-surface,#12151A)] transition-colors duration-200",
                  isOpen ? "border-primary/40" : "border-white/[0.08]",
                )}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setActiveId(cap.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 p-5 text-left font-barlow font-bold text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-sm text-primary">{cap.number}</span>
                      <span className="text-base">{cap.title}</span>
                    </span>
                    {isOpen ? (
                      <Minus aria-hidden="true" className="size-5 shrink-0 text-primary" />
                    ) : (
                      <Plus aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                    )}
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <div className="space-y-4 border-t border-white/[0.08] px-5 pb-5 pt-4">
                        <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                          {cap.outcome}
                        </span>
                        <p className="text-sm leading-relaxed text-gray-400">{cap.description}</p>
                        <MicroPreview kind={cap.preview} />
                        <StackChips stack={cap.stack} />
                        <ExploreLink />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default CoreCapabilities;
