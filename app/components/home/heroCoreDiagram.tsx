import { useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import {
  BrainCircuit,
  ChartLine,
  CircleCheck,
  ClipboardList,
  Database,
  FileCog,
  FileText,
  GitCompareArrows,
  LayoutGrid,
  PhoneCall,
  RefreshCw,
  Share2,
  Smartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { HERO_EASE, TiltCard } from "./heroMotion";
import ParticleOrb from "./particleOrb";

/*
 * The hero's "AI & Software Core": a glowing orb wired to six capability
 * cards by circuit traces. Everything is drawn on a 120×100 grid; the box
 * keeps that aspect ratio, so SVG units and the cards' % positions agree.
 */
const VB_W = 120;
const VB_H = 100;

type Fx = "spin" | "pulse" | "wiggle" | "wave" | "chart";
type Tile = { icon?: LucideIcon; fx?: Fx };
type Point = readonly [number, number];

interface CoreNode {
  id: string;
  title: string;
  tiles: Tile[];
  /** Card centre, in grid units. */
  at: Point;
  /** Centre line of the trace, orb → card; drawn as three parallel strands. */
  spine: Point[];
}

export const CORE_NODES: CoreNode[] = [
  {
    id: "crm",
    title: "CRM & ERP Sync",
    tiles: [{ icon: Workflow }, { icon: RefreshCw, fx: "spin" }, { icon: Database, fx: "pulse" }],
    at: [60, 11],
    spine: [[60, 35], [60, 19]],
  },
  {
    id: "voice",
    title: "24/7 Voice AI",
    tiles: [{ fx: "wave" }, { icon: PhoneCall, fx: "wiggle" }],
    at: [102, 31],
    spine: [[73, 41.6], [80, 41.6], [80, 31], [86, 31]],
  },
  {
    id: "rag",
    title: "RAG Knowledge",
    tiles: [{ icon: FileText }, { icon: BrainCircuit, fx: "pulse" }, { icon: Database, fx: "pulse" }],
    at: [102, 69],
    spine: [[73, 58.4], [80, 58.4], [80, 69], [86, 69]],
  },
  {
    id: "mobile",
    title: "Mobile Apps",
    tiles: [{ icon: Smartphone }, { icon: Share2, fx: "pulse" }, { icon: Database, fx: "pulse" }],
    at: [60, 89],
    spine: [[60, 65], [60, 81]],
  },
  {
    id: "saas",
    title: "B2B SaaS",
    tiles: [{ fx: "chart" }, { icon: CircleCheck, fx: "pulse" }, { icon: ClipboardList }],
    at: [18, 69],
    spine: [[47, 58.4], [40, 58.4], [40, 69], [34, 69]],
  },
  {
    id: "ops",
    title: "Operations Portal",
    tiles: [{ icon: LayoutGrid }, { icon: GitCompareArrows, fx: "spin" }, { icon: FileCog }],
    at: [18, 31],
    spine: [[47, 41.6], [40, 41.6], [40, 31], [34, 31]],
  },
];

const STRAND_OFFSETS = [-2.2, 0, 2.2];

/** Offsets an orthogonal polyline sideways by `d`, mitring the corners. */
function offsetPolyline(points: Point[], d: number): Point[] {
  const normals = points.slice(1).map((p, i) => {
    const [x0, y0] = points[i];
    const len = Math.hypot(p[0] - x0, p[1] - y0) || 1;
    return [-(p[1] - y0) / len, (p[0] - x0) / len] as const;
  });
  return points.map(([x, y], i) => {
    const a = normals[Math.max(0, i - 1)];
    const b = normals[Math.min(normals.length - 1, i)];
    const k = 1 + a[0] * b[0] + a[1] * b[1];
    return [x + ((a[0] + b[0]) / k) * d, y + ((a[1] + b[1]) / k) * d] as const;
  });
}

const toPath = (points: Point[]) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");

const polylineLength = (points: Point[]) =>
  points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]), 0);

const NODE_STRANDS = CORE_NODES.map((node) =>
  STRAND_OFFSETS.map((offset) => {
    const points = offsetPolyline(node.spine, offset);
    return { d: toPath(points), length: polylineLength(points) };
  }),
);

/** Length of a travelling data pulse, in grid units. */
const PULSE = 2.6;

/*
 * Faint decorative traces fanning out of the orb: radial, a small jog, radial
 * again, ending in a dot. Seeded by index (no Math.random) so the server and
 * client render the same paths.
 */
const DECOR_COUNT = 30;
const DECOR = Array.from({ length: DECOR_COUNT }, (_, k) => {
  const a = ((k * 360) / DECOR_COUNT + ((k * 37) % 9) - 4) * (Math.PI / 180);
  const bend = (k % 2 ? 1 : -1) * (4 + (k % 3) * 2) * (Math.PI / 180);
  const r0 = 17.5;
  const r1 = 21 + ((k * 7) % 5);
  const r2 = r1 + 4 + ((k * 5) % 4) * 1.5;
  // Rounded: Node and the browser can disagree on the last digit of
  // Math.sin, which would break hydration on the raw cx/cy attributes.
  const round = (v: number) => Math.round(v * 100) / 100;
  const pt = (r: number, ang: number): Point => [round(60 + r * Math.cos(ang)), round(50 + r * Math.sin(ang))];
  const end = pt(r2, a + bend);
  return { d: toPath([pt(r0, a), pt(r1, a), pt(r1 + 1.5, a + bend), end]), end };
});

/** Screen-space unit vector from the orb to each card; drives the orb's flare. */
const NODE_DIRS: Record<string, readonly [number, number]> = Object.fromEntries(
  CORE_NODES.map((node) => {
    const dx = node.at[0] - VB_W / 2;
    const dy = node.at[1] - VB_H / 2;
    const len = Math.hypot(dx, dy) || 1;
    return [node.id, [dx / len, dy / len] as const];
  }),
);

const ORB_IN = 0.15;
const traceDelay = (i: number) => 0.55 + i * 0.09;
const cardDelay = (i: number) => traceDelay(i) + 0.45;

interface HeroCoreDiagramProps {
  /** Loops run only while the hero is on screen and motion is allowed. */
  live: boolean;
  reduce: boolean;
  /** Advances the auto-highlight; owned by the hero so the stack line can follow it. */
  tick: number;
  pointer: { nx: MotionValue<number>; ny: MotionValue<number> };
  interactive: boolean;
}

export default function HeroCoreDiagram({ live, reduce, tick, pointer, interactive }: HeroCoreDiagramProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeId = hoveredId ?? CORE_NODES[tick % CORE_NODES.length].id;

  // Depth: the orb barely moves, traces a little, cards the most.
  const orbX = useTransform(pointer.nx, (v) => v * 4);
  const orbY = useTransform(pointer.ny, (v) => v * 4);
  const traceX = useTransform(pointer.nx, (v) => v * 6);
  const traceY = useTransform(pointer.ny, (v) => v * 6);
  const cardX = useTransform(pointer.nx, (v) => v * 10);
  const cardY = useTransform(pointer.ny, (v) => v * 10);

  const t = (s: number) => (reduce ? 0 : s);
  const d = (s: number) => (reduce ? 0 : s);

  return (
    <div
      role="img"
      aria-label="Custom AI and software core connected to CRM and ERP sync, 24/7 voice AI, RAG knowledge, mobile apps, B2B SaaS and operations portals"
      className="wl-hero-core relative aspect-[6/5] w-full select-none"
    >
      <div aria-hidden="true" className="absolute inset-0">
        {/* Traces */}
        <motion.svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          style={{ x: traceX, y: traceY }}
          fill="none"
        >
          {DECOR.map((p, k) => (
            <g key={k}>
              <motion.path
                d={p.d}
                stroke="var(--core-trace)"
                strokeWidth={0.22}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0.55 : 0 }}
                animate={{ pathLength: 1, opacity: 0.55 }}
                transition={{ duration: t(0.8), delay: d(0.35 + (k % 10) * 0.04), ease: HERO_EASE }}
              />
              <motion.circle
                cx={p.end[0]}
                cy={p.end[1]}
                r={0.45}
                fill="var(--core-trace-hot)"
                initial={{ opacity: 0 }}
                animate={live ? { opacity: [0.15, 0.8, 0.15] } : { opacity: 0.4 }}
                transition={
                  live
                    ? { duration: 2.4 + (k % 5) * 0.4, repeat: Infinity, delay: 1.2 + (k % 7) * 0.3 }
                    : { duration: t(0.4), delay: d(1.1) }
                }
              />
            </g>
          ))}

          {CORE_NODES.map((node, i) => {
            const active = node.id === activeId;
            return (
              <g key={node.id}>
                {NODE_STRANDS[i].map((strand, s) => (
                  <g key={s}>
                    <motion.path
                      d={strand.d}
                      stroke="var(--core-trace)"
                      strokeWidth={0.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: t(0.6), delay: d(traceDelay(i) + s * 0.06), ease: HERO_EASE }}
                    />
                    {/* Hot copy: lights the whole trace while its card is active. */}
                    <motion.path
                      d={strand.d}
                      stroke="var(--core-trace-hot)"
                      strokeWidth={0.45}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ opacity: active ? 0.85 : 0 }}
                      transition={{ duration: t(0.35) }}
                    />
                    {/* Data pulse travelling orb → card. */}
                    {live && (
                      <motion.path
                        key={active ? "fast" : "slow"}
                        d={strand.d}
                        stroke="var(--core-trace-hot)"
                        strokeWidth={active ? 1 : 0.7}
                        strokeLinecap="round"
                        strokeDasharray={`${PULSE} ${strand.length + PULSE}`}
                        initial={{ strokeDashoffset: PULSE, opacity: 0 }}
                        animate={{ strokeDashoffset: -strand.length, opacity: [0, 1, 1, 0] }}
                        transition={{
                          duration: active ? 0.9 : 2.2,
                          ease: "linear",
                          repeat: Infinity,
                          repeatDelay: active ? 0.05 : 0.9,
                          delay: active ? s * 0.18 : 1.4 + i * 0.25 + s * 0.4,
                        }}
                      />
                    )}
                  </g>
                ))}
                {/* Junction dots where the middle strand turns. */}
                {node.spine.slice(1, -1).map(([x, y]) => (
                  <motion.circle
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    r={0.7}
                    fill="var(--core-trace-hot)"
                    initial={{ scale: reduce ? 1 : 0 }}
                    animate={{ scale: active ? 1.5 : 1 }}
                    transition={{ duration: t(0.3), delay: active ? 0 : d(traceDelay(i) + 0.3) }}
                  />
                ))}
              </g>
            );
          })}
        </motion.svg>

        {/* Orb */}
        <motion.div
          className="absolute left-1/2 top-1/2 aspect-square w-[28%] -translate-x-1/2 -translate-y-1/2"
          style={{ x: orbX, y: orbY }}
        >
          <Orb live={live} reduce={reduce} activeId={activeId} interactive={interactive} />
        </motion.div>

        {/* Cards */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ x: cardX, y: cardY }}>
          {CORE_NODES.map((node, i) => (
            <div
              key={node.id}
              className="pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(node.at[0] / VB_W) * 100}%`, top: `${(node.at[1] / VB_H) * 100}%` }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHoveredId(node.id)}
              onPointerLeave={() => setHoveredId(null)}
            >
              <CoreCard
                node={node}
                index={i}
                active={node.id === activeId}
                live={live}
                reduce={reduce}
                interactive={interactive}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Orb({
  live,
  reduce,
  activeId,
  interactive,
}: {
  live: boolean;
  reduce: boolean;
  activeId: string;
  interactive: boolean;
}) {
  const t = (s: number) => (reduce ? 0 : s);

  return (
    <div className="relative h-full w-full">
      {/* Breathing halo */}
      <motion.div
        className="pointer-events-none absolute -inset-[45%] rounded-full"
        style={{ background: "radial-gradient(circle, var(--core-glow) 0%, transparent 62%)" }}
        initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
        animate={live ? { opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] } : { opacity: 0.85, scale: 1 }}
        transition={live ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: t(0.8), delay: t(ORB_IN) }}
      />

      {/* Ping waves */}
      {live &&
        [0, 1.5].map((delay) => (
          <motion.span
            key={delay}
            className="pointer-events-none absolute inset-0 rounded-full border border-primary/40"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.8 + delay }}
          />
        ))}

      {/* Burst toward the newly active card */}
      {live && (
        <motion.span
          key={activeId}
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-[var(--core-trace-hot)]"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.45, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      )}

      {/* Entrance shockwave, timed with the particles landing */}
      {!reduce && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border border-[var(--core-trace-hot)]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 2.4, opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.2, delay: ORB_IN + 0.6, ease: "easeOut" }}
        />
      )}

      {/* Energy glow inside the sphere, darker at the very centre so the label reads in both themes */}
      <div
        className="pointer-events-none absolute inset-[4%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 22, 51, 0.92) 0%, rgba(8, 40, 100, 0.75) 32%, rgba(10, 132, 255, 0.28) 58%, transparent 74%)",
        }}
      />

      {/* Particle sphere: slightly larger than the orb box so swell and flare have room */}
      <div className="absolute -inset-[18%]">
        <ParticleOrb
          live={live}
          reduce={reduce}
          interactive={interactive}
          activeDir={NODE_DIRS[activeId]}
          fallback={
            <div
              className="absolute inset-[13%] rounded-full border border-cyan-300/40 shadow-[0_0_40px_rgba(10,132,255,0.55),inset_0_0_30px_rgba(90,209,255,0.35)]"
              style={{ background: "radial-gradient(circle at 50% 38%, #1f74ff 0%, #0b3a8c 48%, #061633 100%)" }}
            />
          }
        />
      </div>

      <motion.span
        className="wl-on-accent pointer-events-none absolute inset-0 flex items-center justify-center px-2 text-center font-barlow text-[9px] font-semibold leading-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] sm:text-xs lg:text-sm"
        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: t(ORB_IN + 0.9), ease: HERO_EASE }}
      >
        AI &amp;
        <br />
        Software
        <br />
        Core
      </motion.span>
    </div>
  );
}

function CoreCard({
  node,
  index,
  active,
  live,
  reduce,
  interactive,
}: {
  node: CoreNode;
  index: number;
  active: boolean;
  live: boolean;
  reduce: boolean;
  interactive: boolean;
}) {
  const delay = reduce ? 0 : cardDelay(index);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
    >
      {/* Idle bob, each card on its own phase. */}
      <motion.div
        animate={live ? { y: [0, -4, 0, 4, 0] } : { y: 0 }}
        transition={live ? { duration: 5 + (index % 3), repeat: Infinity, ease: "easeInOut", delay: index * 0.6 } : { duration: 0.3 }}
      >
        <motion.div
          animate={{ y: active && !reduce ? -4 : 0, scale: active && !reduce ? 1.04 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <TiltCard
            enabled={interactive}
            className="wl-core-card rounded-lg px-2 py-1.5 shadow-[0_0_24px_rgba(10,132,255,0.16)] backdrop-blur-md sm:rounded-xl sm:px-3 sm:py-2.5"
          >
            {/* Active glow */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-[inherit] border border-primary shadow-[0_0_28px_rgba(10,132,255,0.55)]"
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
            />
            <p className="relative whitespace-nowrap text-center font-barlow text-[10px] font-semibold text-white sm:text-xs lg:text-sm">
              {node.title}
            </p>
            <motion.div
              className="relative mt-2 hidden justify-center gap-1.5 sm:flex"
              initial={reduce ? false : "hidden"}
              animate="show"
              variants={{ show: { transition: { delayChildren: delay + 0.15, staggerChildren: 0.07 } } }}
            >
              {node.tiles.map((tile, i) => (
                <motion.span
                  key={i}
                  variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1 } }}
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                  className={cn(
                    "flex h-7 items-center justify-center rounded-md border bg-white/[0.04] text-primary transition-colors duration-300 lg:h-8 lg:rounded-lg",
                    tile.fx === "wave" ? "w-14 lg:w-16" : "w-7 lg:w-8",
                    active ? "border-primary/50" : "border-white/10",
                  )}
                >
                  <TileGlyph tile={tile} live={live} active={active} />
                </motion.span>
              ))}
            </motion.div>
          </TiltCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const WAVE_BARS = [0.45, 0.8, 0.55, 1, 0.7, 0.9, 0.5, 0.75, 0.4];

function TileGlyph({ tile, live, active }: { tile: Tile; live: boolean; active: boolean }) {
  if (tile.fx === "wave") {
    return (
      <span className="flex h-4 items-center gap-[2px]">
        {WAVE_BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-current"
            style={{ height: `${h * 100}%`, originY: 0.5 }}
            animate={live ? { scaleY: [0.35, 1, 0.5, 0.9, 0.35] } : { scaleY: 1 }}
            transition={live ? { duration: active ? 0.8 : 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 } : { duration: 0.2 }}
          />
        ))}
      </span>
    );
  }

  if (tile.fx === "chart") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v16a2 2 0 0 0 2 2h16" strokeOpacity={0.6} />
        <motion.path
          d="m7 15 4-5 3 3 5-6"
          initial={false}
          animate={live ? { pathLength: [0, 1, 1] } : { pathLength: 1 }}
          transition={live ? { duration: 2.4, times: [0, 0.5, 1], repeat: Infinity, ease: "easeOut" } : { duration: 0 }}
        />
      </svg>
    );
  }

  const Icon = tile.icon!;
  const glyph = <Icon className="size-3.5 lg:size-4" strokeWidth={1.8} />;
  if (!live || !tile.fx) return glyph;

  if (tile.fx === "spin") {
    return (
      <motion.span className="flex" animate={{ rotate: 360 }} transition={{ duration: active ? 1.6 : 4, repeat: Infinity, ease: "linear" }}>
        {glyph}
      </motion.span>
    );
  }
  if (tile.fx === "pulse") {
    return (
      <motion.span
        className="flex"
        animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: active ? 1 : 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {glyph}
      </motion.span>
    );
  }
  // wiggle: only while its card is active, like a ringing phone.
  return (
    <motion.span
      className="flex"
      animate={active ? { rotate: [0, -14, 12, -10, 8, 0] } : { rotate: 0 }}
      transition={active ? { duration: 0.7, repeat: Infinity, repeatDelay: 0.6 } : { duration: 0.2 }}
    >
      {glyph}
    </motion.span>
  );
}
