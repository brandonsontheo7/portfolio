"use client";

import { useEffect, useRef } from "react";

// "Chaos to order": a field of points joined to their grid neighbours.
// Far from the cursor the points drift out of place and the lines tangle.
// Near the cursor they ease back to the grid and turn terracotta.
//
// Tweak the feel here:
const SPACING = 56; // px between grid points
const RADIUS = 230; // size of the "order" zone around the cursor
const JITTER = 0.85; // how far points start from their grid slot (× spacing)
const DRIFT = 14; // px of slow idle movement
const EASE_POINT = 0.08; // how fast points snap to / leave the grid
const EASE_SPOT = 0.12; // how closely the zone follows the cursor

// design.md tokens (ink #141414, accent #c4512d)
const INK = [20, 20, 20] as const;
const ACCENT = [196, 81, 45] as const;

type Pt = {
  hx: number; // home (grid) position
  hy: number;
  jx: number; // chaos offset
  jy: number;
  ph: number; // drift phase
  sp: number; // drift speed
  o: number; // order 0..1
  x: number;
  y: number;
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const rgb = (k: number, alpha: number) =>
  `rgba(${Math.round(mix(INK[0], ACCENT[0], k))}, ${Math.round(
    mix(INK[1], ACCENT[1], k),
  )}, ${Math.round(mix(INK[2], ACCENT[2], k))}, ${alpha})`;

export default function HeroBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let pts: Pt[] = [];
    let raf = 0;
    let visible = true;
    const mouse = { x: 0, y: 0, active: false };
    const spot = { x: -9999, y: -9999, init: false };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / SPACING) + 2;
      rows = Math.ceil(h / SPACING) + 2;
      const ox = (w - (cols - 1) * SPACING) / 2;
      const oy = (h - (rows - 1) * SPACING) / 2;
      const rand = mulberry32(7);
      pts = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          pts.push({
            hx: ox + c * SPACING,
            hy: oy + r * SPACING,
            jx: (rand() - 0.5) * 2 * SPACING * JITTER,
            jy: (rand() - 0.5) * 2 * SPACING * JITTER,
            ph: rand() * Math.PI * 2,
            sp: 0.0003 + rand() * 0.0006,
            o: 0,
            x: 0,
            y: 0,
          });
        }
      }
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Where is the order zone?
      let tx: number;
      let ty: number;
      if (fine && mouse.active) {
        const rect = canvas.getBoundingClientRect();
        tx = mouse.x - rect.left;
        ty = mouse.y - rect.top;
      } else {
        // Touch / idle: a slow wandering zone keeps the hero alive.
        tx = w * (0.5 + 0.3 * Math.sin(t * 0.0003));
        ty = h * (0.5 + 0.25 * Math.sin(t * 0.00041 + 1));
      }
      if (!spot.init) {
        spot.x = tx;
        spot.y = ty;
        spot.init = true;
      } else {
        spot.x += (tx - spot.x) * EASE_SPOT;
        spot.y += (ty - spot.y) * EASE_SPOT;
      }

      // Update points
      for (const p of pts) {
        const d = Math.hypot(p.hx - spot.x, p.hy - spot.y);
        const k = Math.min(d / RADIUS, 1);
        const target = 1 - k * k * (3 - 2 * k); // 1 at cursor → 0 at edge
        p.o += (target - p.o) * EASE_POINT;
        const dx = p.jx + Math.sin(t * p.sp + p.ph) * DRIFT;
        const dy = p.jy + Math.cos(t * p.sp * 1.3 + p.ph) * DRIFT;
        p.x = p.hx + dx * (1 - p.o);
        p.y = p.hy + dy * (1 - p.o);
      }

      // Lines: each point to its right and bottom neighbour.
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = rgb(0, 0.1);
      const tinted: [Pt, Pt, number][] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = pts[r * cols + c];
          const neighbours = [
            c + 1 < cols ? pts[r * cols + c + 1] : null,
            r + 1 < rows ? pts[(r + 1) * cols + c] : null,
          ];
          for (const b of neighbours) {
            if (!b) continue;
            const o = (a.o + b.o) / 2;
            if (o < 0.05) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            } else {
              tinted.push([a, b, o]);
            }
          }
        }
      }
      ctx.stroke();
      for (const [a, b, o] of tinted) {
        ctx.beginPath();
        ctx.strokeStyle = rgb(o, 0.1 + 0.28 * o);
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Dots
      ctx.beginPath();
      ctx.fillStyle = rgb(0, 0.28);
      const hot: Pt[] = [];
      for (const p of pts) {
        if (p.o < 0.05) {
          ctx.moveTo(p.x + 1.6, p.y);
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        } else {
          hot.push(p);
        }
      }
      ctx.fill();
      for (const p of hot) {
        ctx.beginPath();
        ctx.fillStyle = rgb(p.o, 0.28 + 0.6 * p.o);
        ctx.arc(p.x, p.y, 1.6 + 1.4 * p.o, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (visible && !document.hidden) frame(t);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    build();
    const ro = new ResizeObserver(() => {
      build();
      if (reduce) frame(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    if (reduce) {
      // Static tangle, no animation.
      frame(0);
    } else {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      style={{
        maskImage: "linear-gradient(to bottom, #000 65%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 65%, transparent 100%)",
      }}
    />
  );
}
