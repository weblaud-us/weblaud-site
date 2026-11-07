import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";
import { cn } from "~/lib/utils";

export const HERO_EASE = [0.22, 1, 0.36, 1] as const;

const POINTER_SPRING = { stiffness: 120, damping: 20, mass: 0.6 };
const MAGNET_SPRING = { stiffness: 220, damping: 16, mass: 0.4 };
const TILT_SPRING = { stiffness: 200, damping: 18 };

/**
 * useReducedMotion reads matchMedia on the client's first render, but the
 * server always renders "no preference"; branching on it straight away
 * breaks hydration. This reports false until mounted, then the real value.
 */
export function useSafeReducedMotion(): boolean {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!prefersReduced;
}

export interface HeroPointer {
  /** Pointer position across the hero, -1…1 on each axis, sprung. */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  /** Raw pixel position inside the hero, for the background spotlight. */
  px: MotionValue<number>;
  py: MotionValue<number>;
  spotOpacity: MotionValue<number>;
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

/**
 * Tracks a mouse over the hero section. Touch and pen are ignored, and so is
 * everything when motion is reduced, so the values simply stay at rest.
 */
export function useHeroPointer(enabled: boolean): HeroPointer {
  const nx = useSpring(0, POINTER_SPRING);
  const ny = useSpring(0, POINTER_SPRING);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spotOpacity = useSpring(0, { stiffness: 80, damping: 20 });

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    px.set(x);
    py.set(y);
    nx.set((x / rect.width) * 2 - 1);
    ny.set((y / rect.height) * 2 - 1);
    spotOpacity.set(1);
  };
  const onPointerLeave = () => {
    nx.set(0);
    ny.set(0);
    spotOpacity.set(0);
  };

  return { nx, ny, px, py, spotOpacity, onPointerMove, onPointerLeave };
}

/**
 * Pulls its child a few pixels toward the cursor and springs back on leave.
 * It also broadcasts a "hover" variant, so motion children (the arrow bubble)
 * can react without their own listeners.
 */
export function Magnetic({
  children,
  enabled,
  strength = 6,
  className,
}: {
  children: ReactNode;
  enabled: boolean;
  strength?: number;
  className?: string;
}) {
  const x = useSpring(0, MAGNET_SPRING);
  const y = useSpring(0, MAGNET_SPRING);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 2 * strength);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 2 * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x, y }}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn("flex", className)}
    >
      {children}
    </motion.div>
  );
}

/** The round arrow badge inside a CTA; turns and grows with its Magnetic parent. */
export function ArrowBubble({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      variants={{ hover: { rotate: 45, scale: 1.08 } }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

/**
 * Tilts toward the cursor in 3D with a sheen that follows it. Mouse only;
 * with `enabled` false it is a plain wrapper.
 */
export function TiltCard({
  children,
  enabled,
  className,
}: {
  children: ReactNode;
  enabled: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const sheen = useMotionTemplate`radial-gradient(160px circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.14), transparent 65%)`;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    rotateY.set((fx - 0.5) * 16);
    rotateX.set(-(fy - 0.5) * 16);
    gx.set(fx * 100);
    gy.set(fy * 100);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
      className={cn("group/tilt relative", className)}
    >
      {children}
      {enabled && (
        <motion.span
          aria-hidden="true"
          style={{ background: sheen }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        />
      )}
    </motion.div>
  );
}
