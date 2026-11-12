"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { work } from "@/data/work";
import Reveal from "@/components/Reveal";

const PREVIEW_W = 360; // 4:3
const PREVIEW_H = 270;
const OFFSET = 32;
const LEAVE_DELAY = 120; // ms, avoids flicker when the cursor crosses gaps

export default function WorkList() {
  const [activeId, setActiveId] = useState<string | null>(null);
  // "focus" drives the page-wide blur. It lags slightly on leave (no flicker).
  const [focus, setFocus] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preview follows the cursor with a soft lag
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = previewRef.current!;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      // Flip to the left side if it would overflow the viewport.
      const flip = e.clientX + OFFSET + PREVIEW_W > window.innerWidth;
      target.current.x = flip ? e.clientX - OFFSET - PREVIEW_W : e.clientX + OFFSET;
      target.current.y = e.clientY - PREVIEW_H / 2;
    };
    const tick = () => {
      const k = reduce ? 1 : 0.14;
      pos.current.x += (target.current.x - pos.current.x) * k;
      pos.current.y += (target.current.y - pos.current.y) * k;
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Tell the rest of the page to blur (see globals.css: [data-work-focus]).
  useEffect(() => {
    const root = document.documentElement;
    if (focus) root.setAttribute("data-work-focus", "true");
    else root.removeAttribute("data-work-focus");
    return () => root.removeAttribute("data-work-focus");
  }, [focus]);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    [],
  );

  const handleEnter = (e: React.PointerEvent, id: string, hasPreview: boolean) => {
    if (e.pointerType !== "mouse") return;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveId(id);
    if (hasPreview) setFocus(true);
  };

  const handleLeave = () => {
    setActiveId(null);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setFocus(false), LEAVE_DELAY);
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLAnchorElement>,
    id: string,
    hasPreview: boolean,
  ) => {
    // Keyboard navigation only; mouse clicks are already handled by pointer events.
    if (!e.currentTarget.matches(":focus-visible")) return;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);

    // No cursor position on keyboard focus, so place the preview at the right side of the row.
    const r = e.currentTarget.getBoundingClientRect();
    target.current.x = r.right - PREVIEW_W;
    target.current.y = r.top + r.height / 2 - PREVIEW_H / 2;

    setActiveId(id);
    if (hasPreview) setFocus(true);
  };

  return (
    <section
      id="work"
      data-work-root
      className="mx-auto max-w-page px-6 py-section-sm md:px-16 md:py-section"
    >
      <div className={`transition-[filter,opacity] duration-500 ${focus ? "blur-[3px] opacity-60" : ""}`}>
        <Reveal>
          <p className="label text-ink-muted">Selected work</p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <ul className="mt-10 border-t border-line">
          {work.map((item, i) => {
            const isActive = activeId === item.id;
            const dimmed = activeId !== null && !isActive;
            const content = (
              <>
                <span className="flex items-baseline gap-5 md:gap-8">
                  <span
                    className={`label w-6 shrink-0 transition-colors duration-300 ${isActive ? "text-accent" : "text-ink-muted"
                      }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-work transition-transform duration-500 ease-out ${isActive ? "translate-x-3" : "translate-x-0"
                      }`}
                  >
                    {item.title}
                    {item.href && (
                      <span
                        aria-hidden
                        className={`ml-3 inline-block transition-colors duration-300 ${isActive ? "text-accent" : "text-ink-muted"
                          }`}
                      >
                        ↗
                      </span>
                    )}
                  </span>
                </span>
                <span className="hidden text-right md:block">
                  <span className="label block text-ink-muted">{item.role}</span>
                  {item.detail && (
                    <span className="label block text-ink">{item.detail}</span>
                  )}
                  <span className="block text-body text-ink-muted">{item.summary}</span>
                </span>
              </>
            );

            return (
              <li
                key={item.id}
                className={`relative border-b border-line transition-[opacity,filter] duration-500 ${dimmed ? "opacity-40 blur-[3px]" : "opacity-100"
                  }`}
              >
                {/* Terracotta line that sweeps in under the active row */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-out ${isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                />
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title}, open case study (new tab)`}
                    onPointerEnter={(e) => handleEnter(e, item.id, Boolean(item.preview))}
                    onPointerLeave={handleLeave}
                    onFocus={(e) => handleFocus(e, item.id, Boolean(item.preview))}
                    onBlur={handleLeave}
                    className="flex items-baseline justify-between gap-8 py-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex items-baseline justify-between gap-8 py-8 text-ink-muted">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Reveal>

      {/* Preview stays OUTSIDE Reveal: a transformed ancestor would break position: fixed. */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40"
        style={{ width: PREVIEW_W, height: PREVIEW_H }}
      >
        <div
          className={`relative h-full w-full overflow-hidden rounded-[4px] transition duration-300 ${activeId ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
        >
          {work
            .filter((w) => w.preview)
            .map((w) => (
              <Image
                key={w.id}
                src={w.preview!}
                alt=""
                fill
                sizes={`${PREVIEW_W}px`}
                className={`object-cover transition-opacity duration-200 ${activeId === w.id ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
