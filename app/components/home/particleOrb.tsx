import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { animate, useMotionValue, useSpring } from "framer-motion";

/*
 * The hero's particle orb: a few thousand points on a sphere, drawn with raw
 * WebGL (one gl.POINTS call) so it stays smooth without a 3D library.
 * Framer Motion owns the springs (entrance, hover swell, press squeeze,
 * active-card flare, cursor tilt); a single rAF loop reads them each frame.
 *
 * Interactions (mouse/touch): hover swells it, drag spins it and a flick
 * throws it, pressing squeezes it.
 */

const VERT = `
attribute vec3 aPos;
attribute vec3 aScatter;
attribute float aSeed;
uniform mat3 uRot;
uniform float uTime;
uniform float uAssemble;
uniform float uSwell;
uniform float uSqueeze;
uniform float uFlare;
uniform vec3 uFlareDir;
uniform float uSize;
uniform float uRadius;
varying float vDepth;
varying float vTwinkle;
varying float vFlare;
void main() {
  vec3 rp = uRot * aPos;
  float facing = max(dot(normalize(rp), uFlareDir), 0.0);
  float flare = uFlare * pow(facing, 4.0);
  float breathe = 1.0 + 0.035 * sin(uTime * 1.6 + aSeed * 6.2831);
  vec3 sphere = rp * breathe * uSwell * uSqueeze * (1.0 + 0.32 * flare);
  vec3 pos = mix(aScatter, sphere, uAssemble);
  float persp = 2.6 / (2.6 - pos.z);
  gl_Position = vec4(pos.xy * uRadius * persp, 0.0, 1.0);
  vDepth = clamp(rp.z * 0.5 + 0.5, 0.0, 1.0);
  vTwinkle = 0.78 + 0.22 * sin(uTime * 2.6 + aSeed * 40.0);
  vFlare = flare;
  gl_PointSize = uSize * (0.5 + 0.95 * vDepth) * persp * (1.0 + 0.9 * flare);
}`;

const FRAG = `
precision mediump float;
uniform float uLight;
varying float vDepth;
varying float vTwinkle;
varying float vFlare;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float soft = smoothstep(0.5, 0.05, d);
  vec3 deep = mix(vec3(0.04, 0.52, 1.0), vec3(0.0, 0.32, 0.72), uLight);
  vec3 hot = mix(vec3(0.62, 0.92, 1.0), vec3(0.0, 0.5, 0.86), uLight);
  vec3 col = mix(deep, hot, clamp(vDepth * 0.85 + vFlare, 0.0, 1.0));
  float alpha = soft * (0.22 + 0.78 * vDepth) * vTwinkle;
  gl_FragColor = vec4(col, alpha);
}`;

/** Small seeded PRNG so the cloud is the same on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fibonacci-sphere shell plus a sparser inner cloud for volume. */
function buildParticles(count: number) {
  const rand = mulberry32(7);
  const shell = Math.round(count * 0.8);
  const pos = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number;
    if (i < shell) {
      y = 1 - (i / (shell - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      x = Math.cos(golden * i) * r;
      z = Math.sin(golden * i) * r;
    } else {
      const u = rand() * 2 - 1;
      const th = rand() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      const k = 0.35 + rand() * 0.55;
      x = Math.cos(th) * r * k;
      y = u * k;
      z = Math.sin(th) * r * k;
    }
    pos.set([x, y, z], i * 3);
    // Entrance: each point starts flung outward, a little off its own ray.
    const m = 1.12 + rand() * 0.32;
    scatter.set([x * m + (rand() - 0.5) * 0.5, y * m + (rand() - 0.5) * 0.5, z * m], i * 3);
    seed[i] = rand();
  }
  return { pos, scatter, seed };
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return sh;
  if (import.meta.env.DEV) console.warn("ParticleOrb shader:", gl.getShaderInfoLog(sh));
  return null;
}

const isLightTheme = () =>
  document.documentElement.getAttribute("data-theme") === "light" && !document.body.classList.contains("dark");

interface ParticleOrbProps {
  /** The rAF loop runs only while live; otherwise one still frame is drawn. */
  live: boolean;
  reduce: boolean;
  interactive: boolean;
  /** Screen-space direction (x right, y down) from the orb to the active card. */
  activeDir: readonly [number, number];
  /** Shown instead when WebGL is unavailable. */
  fallback: ReactNode;
}

export default function ParticleOrb({ live, reduce, interactive, activeDir, fallback }: ParticleOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  const assemble = useMotionValue(0);
  const flare = useMotionValue(0);
  const swell = useSpring(1, { stiffness: 170, damping: 13 });
  const squeeze = useSpring(1, { stiffness: 420, damping: 11 });
  const tiltX = useSpring(0, { stiffness: 90, damping: 16 });
  const tiltY = useSpring(0, { stiffness: 90, damping: 16 });

  // Mutable per-frame state that never needs a re-render.
  const sim = useRef({
    rotY: 0,
    dragX: 0,
    throwVel: 0,
    hovering: false,
    dragging: false,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    vel: 0,
    flareDir: [0, 1, 0.35] as [number, number, number],
    draw: null as null | ((time: number) => void),
    entered: false,
  });

  // GL setup, resize and theme tracking.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) {
      setFailed(true);
      return;
    }
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    if (!vs || !fs) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (import.meta.env.DEV) console.warn("ParticleOrb link:", gl.getProgramInfoLog(prog));
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    let count = 0;
    const upload = (n: number) => {
      if (n === count) return;
      count = n;
      const { pos, scatter, seed } = buildParticles(n);
      const bind = (name: string, data: Float32Array, size: number) => {
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, name);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      };
      bind("aPos", pos, 3);
      bind("aScatter", scatter, 3);
      bind("aSeed", seed, 1);
    };

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      rot: u("uRot"),
      time: u("uTime"),
      assemble: u("uAssemble"),
      swell: u("uSwell"),
      squeeze: u("uSqueeze"),
      flare: u("uFlare"),
      flareDir: u("uFlareDir"),
      size: u("uSize"),
      radius: u("uRadius"),
      light: u("uLight"),
    };

    let light = isLightTheme();
    let cssSize = 0;
    const applyBlend = () => {
      gl.enable(gl.BLEND);
      if (light) gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      else gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
    };
    applyBlend();

    const s = sim.current;
    s.draw = (time: number) => {
      const rx = 0.22 * Math.sin(time * 0.4) + tiltY.get() + s.dragX;
      const ry = s.rotY + tiltX.get();
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      // Column-major Rx · Ry.
      gl.uniformMatrix3fv(U.rot, false, [cy, sx * sy, -cx * sy, 0, cx, sx, sy, -sx * cy, cx * cy]);
      gl.uniform1f(U.time, time);
      gl.uniform1f(U.assemble, assemble.get());
      gl.uniform1f(U.swell, swell.get());
      gl.uniform1f(U.squeeze, squeeze.get());
      gl.uniform1f(U.flare, flare.get());
      gl.uniform3fv(U.flareDir, s.flareDir);
      gl.uniform1f(U.size, cssSize * 0.0125 * Math.min(window.devicePixelRatio || 1, 2));
      gl.uniform1f(U.radius, 0.7);
      gl.uniform1f(U.light, light ? 1 : 0);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssSize = canvas.clientWidth;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      upload(cssSize < 170 ? 1100 : 1900);
      s.draw?.(performance.now() / 1000);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const mo = new MutationObserver(() => {
      light = isLightTheme();
      applyBlend();
      s.draw?.(performance.now() / 1000);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      ro.disconnect();
      mo.disconnect();
      s.draw = null;
    };
  }, [assemble, flare, swell, squeeze, tiltX, tiltY]);

  // Entrance: particles fly in from a scattered cloud the first time the hero is live.
  useEffect(() => {
    const s = sim.current;
    if (reduce) {
      assemble.jump(1);
      s.entered = true;
    } else if (live && !s.entered) {
      s.entered = true;
      animate(assemble, 1, { type: "spring", stiffness: 38, damping: 11, delay: 0.15 });
    }
  }, [live, reduce, assemble]);

  // Flare toward whichever card just became active.
  useEffect(() => {
    const [dx, dy] = activeDir;
    const len = Math.hypot(dx, dy, 0.35) || 1;
    sim.current.flareDir = [dx / len, -dy / len, 0.35 / len];
    if (live) animate(flare, [0, 1, 0], { duration: 0.9, ease: "easeOut" });
  }, [activeDir, live, flare]);

  // The frame loop: only while live. Otherwise draw a single still frame.
  useEffect(() => {
    const s = sim.current;
    if (!live) {
      s.draw?.(performance.now() / 1000);
      return;
    }
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      if (!s.dragging) {
        const base = s.hovering ? 0.55 : 0.28;
        s.rotY += (base + s.throwVel) * dt;
        s.throwVel *= Math.exp(-dt * 1.5);
        s.dragX *= Math.exp(-dt * 1.4);
      }
      s.draw?.(now / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  const enabled = interactive && !reduce;

  const onPointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType !== "mouse") return;
    sim.current.hovering = true;
    swell.set(1.12);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const s = sim.current;
    if (s.dragging) {
      const now = performance.now();
      const dx = (e.clientX - s.lastX) * 0.012;
      const dy = (e.clientY - s.lastY) * 0.012;
      s.rotY += dx;
      s.dragX = Math.max(-0.9, Math.min(0.9, s.dragX + dy));
      const dt = Math.max((now - s.lastT) / 1000, 0.001);
      s.vel = s.vel * 0.6 + (dx / dt) * 0.4;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.lastT = now;
      return;
    }
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set(((e.clientX - rect.left) / rect.width - 0.5) * 0.7);
    tiltY.set(((e.clientY - rect.top) / rect.height - 0.5) * 0.7);
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const s = sim.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    s.dragging = true;
    s.throwVel = 0;
    s.vel = 0;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.lastT = performance.now();
    squeeze.set(0.86);
  };
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    if (!s.dragging) return;
    s.dragging = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    s.throwVel = Math.max(-14, Math.min(14, s.vel));
    squeeze.set(1);
  };
  const onPointerLeave = () => {
    const s = sim.current;
    s.hovering = false;
    swell.set(1);
    tiltX.set(0);
    tiltY.set(0);
  };

  if (failed) return <>{fallback}</>;

  return (
    <div
      className={enabled ? "absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing" : "pointer-events-none absolute inset-0"}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={onPointerLeave}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
    </div>
  );
}
