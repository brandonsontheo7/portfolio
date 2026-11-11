"use client";

import { motion, useReducedMotion } from "framer-motion";

// Simple line icons (48×48). Each is a list of path strings that "draw" on scroll.
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

// Line between the edges of two circles.
const link = (ax: number, ay: number, ar: number, bx: number, by: number, br: number) => {
  const d = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / d;
  const uy = (by - ay) / d;
  const f = (n: number) => n.toFixed(2);
  return `M${f(ax + ux * ar)} ${f(ay + uy * ar)} L${f(bx - ux * br)} ${f(by - uy * br)}`;
};

const ICONS: string[][] = [
  // AI Product Design: connected nodes
  [
    circle(24, 24, 5),
    circle(8, 10, 3),
    circle(40, 10, 3),
    circle(24, 42, 3),
    link(24, 24, 5, 8, 10, 3),
    link(24, 24, 5, 40, 10, 3),
    link(24, 24, 5, 24, 42, 3),
  ],
  // UX Research: magnifier
  [circle(21, 21, 12), "M30 30 L42 42"],
  // Data-Heavy Interface Design: bars
  ["M6 42 H42", "M9 42 V28 H17 V42", "M20 42 V10 H28 V42", "M31 42 V20 H39 V42"],
  // Design Systems: components
  ["M8 8 H22 V22 H8 Z", "M26 8 H40 V22 H26 Z", "M8 26 H22 V40 H8 Z", circle(33, 33, 7)],
];

export default function ServiceIcon({ index, delay = 0 }: { index: number; delay?: number }) {
  const reduce = useReducedMotion();
  const paths = ICONS[index % ICONS.length];

  return (
    <svg
      viewBox="0 0 48 48"
      width={48}
      height={48}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="text-ink transition-colors duration-300 group-hover:text-accent"
    >
      {paths.map((d, i) =>
        reduce ? (
          <path key={i} d={d} />
        ) : (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 1.1, delay: delay + i * 0.12, ease: "easeInOut" }}
          />
        ),
      )}
    </svg>
  );
}
