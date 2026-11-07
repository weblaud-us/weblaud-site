import { useId, useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Code,
  Cpu,
  Database,
  FileText,
  LayoutDashboard,
  PhoneIncoming,
  RefreshCw,
  Rocket,
  Sheet,
  Smartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import SectionBadge from "~/components/ui/section-badge";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { useScrollSteps } from "~/hooks/useScrollSteps";
import { getBlurAnimationClasses } from "~/lib/animations";
import { BOTTLENECKS } from "~/data/home-content";
import { AUTOMATION, TIMELINE } from "~/lib/constants";
import { RoiCta } from "./roiCta";

/** Figures that are published claims elsewhere on the site are read, not retyped. */
const VALUE_SOURCES = {
  automationShare: AUTOMATION.percentLabel,
  deliveryRange: TIMELINE.rangeShort,
} as const;

type Option = (typeof BOTTLENECKS.options)[number];

function metricValue(option: Option) {
  return "valueFrom" in option.metric ? VALUE_SOURCES[option.metric.valueFrom] : option.metric.value;
}

/** The pill's icon, then one icon per workflow step (input, engine, outcome). */
const ICONS: Record<Option["id"], { pill: LucideIcon; path: readonly [LucideIcon, LucideIcon, LucideIcon] }> = {
  voice: { pill: PhoneIncoming, path: [PhoneIncoming, Cpu, CalendarCheck] },
  docs: { pill: FileText, path: [FileText, Cpu, RefreshCw] },
  portal: { pill: LayoutDashboard, path: [Sheet, LayoutDashboard, Database] },
  product: { pill: Smartphone, path: [ClipboardList, Code, Rocket] },
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Pick an operational bottleneck on the left; the outcome card on the right
 *  shows the automated path that replaces it. Shares its card shell with
 *  RoiCalculatorWidget. */
const BottleneckSelector = () => {
  const options = BOTTLENECKS.options;
  // On desktop the section pins and scrolling walks through each option.
  const { trackRef, index: activeIndex, goTo } = useScrollSteps<HTMLElement>(options.length);
  const [cardRef, isCardVisible] = useBlurAnimation<HTMLDivElement>();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = options[activeIndex];
  const icons = ICONS[active.id];

  const selectTab = (index: number, focus = false) => {
    goTo(index);
    if (focus) tabRefs.current[index]?.focus({ preventScroll: true });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowDown: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      ArrowUp: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      selectTab(moves[event.key], true);
    }
  };

  return (
    // Pinned: a 100svh + 4 × 40svh track (see useScrollSteps) with a sticky panel.
    <section
      ref={trackRef}
      id="bottlenecks"
      aria-labelledby="bottlenecks-title"
      className="scroll-mt-24 bg-black px-4 md:px-6 py-16 sm:py-20 md:py-24 pin:h-[260svh] pin:py-0"
    >
      <div className="pin:sticky pin:top-0 pin:flex pin:h-svh pin:flex-col pin:justify-center pin:pt-20 pin:pb-6 pin-compact:pb-3">
        <div
          ref={cardRef}
          className={`mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-[var(--bg-surface,#12151A)] p-8 sm:p-12 pin-compact:p-7 ${getBlurAnimationClasses(isCardVisible)}`}
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
            <div>
              <SectionBadge
                icon={<Workflow className="w-3.5 h-3.5" />}
                text={BOTTLENECKS.badge}
                badgeLabel={BOTTLENECKS.badgeLabel}
                color="#0a84ff"
                className="mb-4"
              />
              <h2
                id="bottlenecks-title"
                className="text-white font-barlow text-2xl md:text-4xl pin-compact:text-3xl font-bold tracking-tight text-balance"
              >
                {BOTTLENECKS.heading}
              </h2>
              <p className="mt-4 mb-8 pin-compact:mt-3 pin-compact:mb-5 max-w-2xl text-gray-400 text-sm md:text-base leading-relaxed">
                {BOTTLENECKS.subheading}
              </p>

              {/* Stacked on every breakpoint: four short pills fit at 375px, and a
                  horizontal strip would hide options off-screen. */}
              <div
                role="tablist"
                aria-orientation="vertical"
                aria-labelledby="bottlenecks-title"
                onKeyDown={onKeyDown}
                className="flex flex-col gap-2"
              >
                {options.map((option, index) => {
                  const isActive = index === activeIndex;
                  const Icon = ICONS[option.id].pill;
                  return (
                    <button
                      key={option.id}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${baseId}-tab-${option.id}`}
                      aria-selected={isActive}
                      aria-controls={`${baseId}-panel`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => selectTab(index)}
                      className={`relative flex min-h-13 pin-compact:min-h-11 w-full cursor-pointer items-center gap-3 rounded-full border px-5 py-2 text-left font-barlow text-sm sm:text-base font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        isActive ? "border-transparent" : "border-white/10 hover:border-primary/50"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="bottleneckActive"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full border border-[#0066FF]/60 bg-[#0066FF]/15 shadow-[0_0_20px_rgba(0,102,255,0.15)]"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <Icon
                        aria-hidden="true"
                        className={`relative size-4 shrink-0 ${isActive ? "text-primary" : "text-gray-500"}`}
                      />
                      <span className={`relative transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400"}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${active.id}`}
              className="overflow-hidden rounded-2xl border border-[#0066FF]/30 bg-gradient-to-br from-[#0066FF]/15 to-transparent p-6 sm:p-8"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_OUT } }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.16, ease: EASE_OUT } }}
                >
                  <p className="font-mono text-xs tracking-[0.08em] text-gray-400">HOW IT FLOWS</p>

                  {/* A column of steps on phones, a row from sm up, so the path
                      never overflows at 375px. */}
                  <ol className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row">
                    {active.path.map((step, i) => {
                      const StepIcon = icons.path[i];
                      const engine = i === 1;
                      return (
                        <li key={step} className="flex flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                          {i > 0 && (
                            <span aria-hidden="true" className="flex shrink-0 justify-center text-primary">
                              <ArrowDown className="size-4 sm:hidden" />
                              <ArrowRight className="hidden size-4 sm:block" />
                            </span>
                          )}
                          <span
                            className={`flex min-h-13 flex-1 items-center gap-2.5 self-stretch rounded-xl border px-3 py-2.5 font-barlow text-sm font-semibold sm:flex-col sm:justify-center sm:gap-2 sm:text-center ${
                              engine
                                ? "border-[#0066FF] bg-[#0066FF] text-white shadow-[0_4px_20px_rgba(0,102,255,0.35)]"
                                : "border-white/10 bg-black/40 text-white"
                            }`}
                          >
                            <StepIcon aria-hidden="true" className={`size-4 shrink-0 ${engine ? "text-white" : "text-primary"}`} />
                            <span className="leading-snug">{step}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ol>

                  <div className="mt-8 border-t border-white/10 pt-6 pin-compact:mt-5 pin-compact:pt-4">
                    <p className="font-barlow text-4xl font-bold tracking-tight text-primary sm:text-5xl pin-compact:text-4xl">
                      {metricValue(active)}
                    </p>
                    <p className="mt-1 font-barlow text-sm font-semibold text-white">{active.metric.label}</p>
                    <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">{active.summary}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <RoiCta to="/calculator" className="mt-8 pin-compact:mt-5 w-full sm:w-auto">
                {BOTTLENECKS.cta}
              </RoiCta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottleneckSelector;
