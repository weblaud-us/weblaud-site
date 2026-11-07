import {
  createContext,
  useContext,
  useRef,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/*
 * Neon line-art illustrations for the process section (ourSpeciality.tsx),
 * one per step. Each is a single-colour stroke drawing; the glow comes from
 * drawing the art three times (two wide, faint halo passes under a crisp
 * one) rather than an SVG blur filter, which would re-rasterise on every
 * frame of the gear and connector animations.
 */

export type ProcessArt = ComponentType<{ color: string }>;

// Loops run only while the art is on screen and the visitor allows motion.
const MotionOn = createContext(false);

// Card fill so a shape can hide the lines behind it; follows the light theme.
const SURFACE = "var(--color-black, #000)";

function NeonFrame({ color, children }: { color: string; children: ReactNode }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduce = useReducedMotion();

  return (
    <MotionOn.Provider value={inView && !reduce}>
      <svg
        ref={ref}
        viewBox="0 0 320 240"
        aria-hidden="true"
        className="wl-process-art w-full h-auto overflow-visible text-(--art-color)"
        style={{ "--art-color": color } as CSSProperties}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g strokeWidth={7} opacity={0.08}>
          {children}
        </g>
        <g strokeWidth={3.5} opacity={0.22}>
          {children}
        </g>
        <g strokeWidth={1.6}>{children}</g>
      </svg>
    </MotionOn.Provider>
  );
}

const loop = (duration: number) => ({
  duration,
  ease: "linear" as const,
  repeat: Infinity,
});

function Spin({
  duration = 16,
  reverse = false,
  children,
}: {
  duration?: number;
  reverse?: boolean;
  children: ReactNode;
}) {
  const on = useContext(MotionOn);
  return (
    <motion.g
      animate={on ? { rotate: reverse ? -360 : 360 } : undefined}
      transition={loop(duration)}
    >
      {children}
    </motion.g>
  );
}

function Float({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  const on = useContext(MotionOn);
  return (
    <motion.g
      animate={on ? { y: [0, -5, 0] } : undefined}
      transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, delay }}
    >
      {children}
    </motion.g>
  );
}

// Dashed connector whose dashes travel along the path. The offset per cycle
// is a whole number of dash periods, so the loop is seamless.
function Flow({
  d,
  dash = "3 6",
  period = 9,
  duration = 1.2,
  opacity,
}: {
  d: string;
  dash?: string;
  period?: number;
  duration?: number;
  opacity?: number;
}) {
  const on = useContext(MotionOn);
  return (
    <motion.path
      d={d}
      strokeDasharray={dash}
      opacity={opacity}
      animate={on ? { strokeDashoffset: [0, -period * 2] } : undefined}
      transition={loop(duration)}
    />
  );
}

// A waveform that redraws itself left to right.
function Trace({ points }: { points: string }) {
  const on = useContext(MotionOn);
  return (
    <motion.polyline
      points={points}
      initial={false}
      animate={on ? { pathLength: [0, 1, 1], opacity: [1, 1, 0] } : undefined}
      transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, times: [0, 0.7, 1] }}
    />
  );
}

function gearPath(cx: number, cy: number, r: number, teeth: number) {
  const inner = r * 0.8;
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    for (const [da, rad] of [
      [-0.27, inner],
      [-0.13, r],
      [0.13, r],
      [0.27, inner],
    ]) {
      const t = a + da * step;
      pts.push(`${(cx + rad * Math.cos(t)).toFixed(1)} ${(cy + rad * Math.sin(t)).toFixed(1)}`);
    }
  }
  return `M${pts.join("L")}Z`;
}

function Gear({
  cx,
  cy,
  r,
  teeth,
  reverse,
  duration,
}: {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <Spin reverse={reverse} duration={duration}>
      <path d={gearPath(cx, cy, r, teeth)} />
      <circle cx={cx} cy={cy} r={r * 0.36} />
    </Spin>
  );
}

function Dot({ x, y, r = 2.2 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill="currentColor" />;
}

function Cursor({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0 0V16L4.4 12.2L7.4 18.6L10 17.4L7 11H12.6Z"
      fill={SURFACE}
    />
  );
}

// Browser-style window: frame, title bar and the three traffic-light dots.
function Window({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={7} fill={SURFACE} />
      <path d={`M${x} ${y + 14}H${x + w}`} />
      <Dot x={x + 9} y={y + 7} r={1.6} />
      <Dot x={x + 16} y={y + 7} r={1.6} />
      <Dot x={x + 23} y={y + 7} r={1.6} />
    </>
  );
}

// Image placeholder: a box with an X through it.
function Placeholder({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={3} />
      <path d={`M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}`} opacity={0.6} />
    </>
  );
}

// Isometric cube, top vertex at (x, y), edge length s.
function Cube({ x, y, s }: { x: number; y: number; s: number }) {
  const dx = s * 0.866;
  const half = s / 2;
  return (
    <>
      <path
        d={`M${x} ${y}L${x + dx} ${y + half}V${y + half + s}L${x} ${y + 2 * s}L${x - dx} ${y + half + s}V${y + half}Z`}
        fill={SURFACE}
      />
      <path d={`M${x - dx} ${y + half}L${x} ${y + s}L${x + dx} ${y + half}M${x} ${y + s}V${y + 2 * s}`} />
    </>
  );
}

function Cylinder({ cx, cy, rx, h }: { cx: number; cy: number; rx: number; h: number }) {
  const ry = rx / 3;
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      <path d={`M${cx - rx} ${cy}V${cy + h}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + h}V${cy}`} />
      <path d={`M${cx - rx} ${cy + h / 2}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + h / 2}`} opacity={0.6} />
    </>
  );
}

const StrategyArt: ProcessArt = ({ color }) => (
  <NeonFrame color={color}>
    {/* Path from the plan into the roadmap */}
    <Flow d="M38 112V188Q38 204 54 204H112" />
    <Dot x={38} y={112} r={3} />
    <Gear cx={136} cy={200} r={20} teeth={9} />
    <Gear cx={168} cy={218} r={10} teeth={7} reverse duration={10} />
    <Flow d="M158 184Q182 172 206 180" />

    {/* Dashboard window with a rising chart */}
    <Window x={50} y={30} w={170} h={118} />
    <rect x={62} y={58} width={92} height={74} rx={4} />
    <polyline points="70,122 84,108 96,114 110,94 124,101 144,72" />
    <path d="M135 72H144V81" />
    <path d="M166 62H208" />
    <path d="M166 72H194" opacity={0.6} />
    <rect x={166} y={86} width={42} height={46} rx={3} />
    <path d="M175 124V114M183 124V104M191 124V109M199 124V96" />

    <Gear cx={250} cy={44} r={22} teeth={10} />
    <Gear cx={285} cy={80} r={13} teeth={8} reverse duration={11} />

    {/* KPI card */}
    <rect x={208} y={158} width={78} height={52} rx={6} fill={SURFACE} />
    <polyline points="216,198 230,186 242,192 256,175 276,170" />
    <Cursor x={258} y={184} />
  </NeonFrame>
);

const DesignArt: ProcessArt = ({ color }) => (
  <NeonFrame color={color}>
    {/* Guide from the mobile wireframe to the desktop one */}
    <Flow d="M86 54V30H138" />

    {/* Mobile wireframe */}
    <rect x={40} y={54} width={92} height={134} rx={9} fill={SURFACE} />
    <Placeholder x={52} y={68} w={68} h={46} />
    <path d="M52 128H120" />
    <path d="M52 140H108M52 152H96" opacity={0.6} />
    <rect x={52} y={164} width={40} height={12} rx={6} />
    <Cursor x={104} y={150} scale={0.9} />

    {/* Desktop wireframe with selection marks */}
    <path d="M140 46V34H152M286 34H298V46M298 148V160H286M152 160H140V148" />
    <Window x={150} y={42} w={140} h={110} />
    <Placeholder x={162} y={66} w={116} h={46} />
    <path d="M162 126H200" />
    <path d="M162 137H190" opacity={0.6} />
    <rect x={232} y={122} width={34} height={18} rx={4} />
    <text
      x={249}
      y={135}
      textAnchor="middle"
      fontSize={10}
      fontWeight={700}
      fill="currentColor"
      stroke="none"
      fontFamily="inherit"
    >
      AI
    </text>

    <Cursor x={258} y={172} scale={1.4} />
  </NeonFrame>
);

const DevelopmentArt: ProcessArt = ({ color }) => (
  <NeonFrame color={color}>
    {/* Circuit traces: a faint fixed line with packets moving along it */}
    {[
      "M113 110H102V66H90",
      "M113 130H102V172H74",
      "M207 110H214V98H226",
      "M207 130H214V178H228",
      "M160 72V40H229",
      "M160 168V206",
      "M118 206H202",
    ].map((d) => (
      <g key={d}>
        <path d={d} opacity={0.5} />
        <Flow d={d} dash="3 15" period={18} duration={1.8} />
      </g>
    ))}
    <Dot x={118} y={206} r={3} />
    <Dot x={202} y={206} r={3} />

    {/* Core */}
    <circle cx={160} cy={120} r={48} opacity={0.55} />
    <Gear cx={160} cy={120} r={34} teeth={12} duration={20} />

    {/* Code windows */}
    <Window x={18} y={40} w={72} h={52} />
    <path d="M28 66H60M36 75H78" />
    <path d="M36 84H56" opacity={0.6} />
    <Window x={226} y={72} w={72} h={52} />
    <path d="M236 98H270M244 107H288" />
    <path d="M244 116H264" opacity={0.6} />

    <Gear cx={246} cy={40} r={16} teeth={8} reverse duration={10} />

    {/* Databases */}
    <Cylinder cx={56} cy={160} rx={18} h={30} />
    <Cylinder cx={250} cy={168} rx={22} h={32} />
  </NeonFrame>
);

const MaintainArt: ProcessArt = ({ color }) => (
  <NeonFrame color={color}>
    <Flow d="M128 66H150V76H170" />
    <Flow d="M128 118H166V140" />
    <path d="M80 156V176" opacity={0.6} />

    {/* Server rack */}
    <rect x={32} y={42} width={96} height={114} rx={6} opacity={0.5} />
    {[50, 76, 102, 128].map((y) => (
      <g key={y}>
        <rect x={40} y={y} width={80} height={20} rx={4} />
        <Dot x={50} y={y + 10} r={1.8} />
        <Dot x={58} y={y + 10} r={1.8} />
        <path d={`M70 ${y + 10}H110`} opacity={0.6} />
      </g>
    ))}

    {/* Uptime monitor */}
    <rect x={170} y={36} width={120} height={76} rx={6} fill={SURFACE} />
    <path d="M230 112V124M214 124H246" />
    <path d="M180 92H280" opacity={0.3} />
    <Trace points="180,78 200,78 208,64 216,94 224,56 232,88 238,78 280,78" />

    {/* Log card */}
    <rect x={30} y={176} width={100} height={40} rx={5} />
    <polyline points="40,198 60,198 66,188 72,208 78,192 84,198 120,198" />

    {/* Wrench and screwdriver */}
    <g transform="translate(222 176) rotate(-140)">
      <rect x={-48} y={-8} width={34} height={16} rx={5} fill={SURFACE} />
      <path d="M-40 -4V4M-32 -4V4M-24 -4V4" opacity={0.6} />
      <path d="M-14 -2.5H38L48 0L38 2.5H-14" />
    </g>
    <g transform="translate(222 176) rotate(-40)">
      <path d="M-44 -6H31.2M-44 6H31.2M-44 -6A6 6 0 0 0 -44 6" />
      <circle cx={46} cy={0} r={16} fill={SURFACE} />
      <path d="M53 0L49.5 6.1H42.5L39 0L42.5 -6.1H49.5Z" />
    </g>
  </NeonFrame>
);

// Hex ring around the hub (95, 82), radius 38.
const RING = [0, 60, 120, 180, 240, 300].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return [95 + 38 * Math.cos(a), 82 + 38 * Math.sin(a)] as const;
});

const ScaleArt: ProcessArt = ({ color }) => (
  <NeonFrame color={color}>
    {/* Service mesh */}
    <path
      d={`M${RING.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`}
      opacity={0.6}
    />
    {RING.map(([x, y]) => (
      <path key={`s${x}`} d={`M95 82L${x.toFixed(1)} ${y.toFixed(1)}`} />
    ))}
    <circle cx={95} cy={82} r={9} fill={SURFACE} />
    {RING.map(([x, y]) => (
      <circle key={`n${x}`} cx={x} cy={y} r={5} fill={SURFACE} />
    ))}

    {/* A second cluster joining the mesh */}
    <Flow d={`M${RING[2][0].toFixed(1)} ${RING[2][1].toFixed(1)}L46 176`} />
    <path d="M44 182L20 162M44 182L22 206M44 182L70 204" />
    <circle cx={44} cy={182} r={6} fill={SURFACE} />
    <circle cx={20} cy={162} r={4} fill={SURFACE} />
    <circle cx={22} cy={206} r={4} fill={SURFACE} />
    <circle cx={70} cy={204} r={4} fill={SURFACE} />

    <Flow d="M133 82C160 82 172 100 180 120" />

    {/* Growing workloads */}
    <Cube x={150} y={160} s={24} />
    <Cube x={210} y={108} s={46} />
    <Float>
      <Cube x={226} y={50} s={15} />
    </Float>
    <Float delay={1.1}>
      <Cube x={166} y={118} s={10} />
    </Float>

    {/* Growth arrows */}
    <Float delay={0.5}>
      <path d="M282 150V40M270 54L282 40L294 54" />
      <path d="M260 96V66M253 74L260 66L267 74" opacity={0.6} />
    </Float>

    {/* Server stack */}
    {[176, 190, 204].map((y) => (
      <g key={y}>
        <rect x={262} y={y} width={34} height={10} rx={2} />
        <Dot x={268} y={y + 5} r={1.3} />
      </g>
    ))}
  </NeonFrame>
);

// Keyed by step id in ourSpeciality.tsx.
export const processArt: Record<number, ProcessArt> = {
  1: StrategyArt,
  2: DesignArt,
  3: DevelopmentArt,
  4: MaintainArt,
  5: ScaleArt,
};
