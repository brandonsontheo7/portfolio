"use client";

import { useEffect, useRef } from "react";

// Terracotta dot that eases toward the pointer. Hover-capable devices only.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = dotRef.current!;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      const interactive = (e.target as Element | null)?.closest("a, button");
      targetScale = interactive ? 2.2 : 1;
      el.style.opacity = interactive ? "0.35" : "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    const tick = () => {
      const k = reduce ? 1 : 0.2;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      scale += (targetScale - scale) * 0.2;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 size-3 rounded-full bg-accent opacity-0 transition-opacity duration-200"
    />
  );
}
