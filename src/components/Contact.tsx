"use client";

import { useEffect, useRef } from "react";
import { nav } from "@/data/content";
import { contact } from "@/data/contact";
import Reveal from "@/components/Reveal";

const GLOW = 520; // px

export default function Contact() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const glow = glowRef.current!;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const place = (x: number, y: number) => {
      glow.style.transform = `translate3d(${x - GLOW / 2}px, ${y - GLOW / 2}px, 0)`;
    };
    const start = () => {
      const r = wrap.getBoundingClientRect();
      return { x: r.width * 0.72, y: r.height * 0.3 };
    };

    const pos = start();
    const target = { ...pos };
    place(pos.x, pos.y);
    if (!fine || reduce) return;

    let raf = 0;
    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = wrap.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
    };
    const tick = () => {
      if (visible) {
        pos.x += (target.x - pos.x) * 0.08;
        pos.y += (target.y - pos.y) * 0.08;
        place(pos.x, pos.y);
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(wrap);
    wrap.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative isolate overflow-hidden bg-ink text-bg">
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -z-10 rounded-full"
        style={{
          width: GLOW,
          height: GLOW,
          background:
            "radial-gradient(circle, rgba(196, 81, 45, 0.38) 0%, rgba(196, 81, 45, 0) 65%)",
        }}
      />

      <section
        id="contact"
        className="mx-auto max-w-page px-6 py-section-sm md:px-16 md:py-section"
      >
        <Reveal>
          <p className="label text-bg/60">Contact</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-hero">{nav.cta}</h2>
        </Reveal>

        <Reveal delay={0.2}>
          <a
            href={`mailto:${contact.email}`}
            className="mt-10 inline-block text-[clamp(1.25rem,4vw,3.5rem)] font-semibold leading-tight underline decoration-accent decoration-2 underline-offset-8 wrap-anywhere"
          >
            {contact.email}
          </a>
        </Reveal>

        <Reveal delay={0.3}>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {contact.links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-bg/60 transition-colors hover:text-accent"
                >
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <footer className="mx-auto max-w-page border-t border-bg/15 px-6 py-8 md:px-16">
        <p className="label text-bg/60">© 2026 Brandon</p>
      </footer>
    </div>
  );
}
