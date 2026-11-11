"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import { about } from "@/data/content";
import Reveal from "@/components/Reveal";

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.85;
  const opacity = useTransform(progress, [start, start + 0.15], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  const words = about.bio.split(" ");

  return (
    <section
      id="about"
      className="mx-auto max-w-page px-6 py-section-sm md:px-16 md:py-section"
    >
      <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
        <Reveal>
          <p className="label text-ink-muted">About</p>
        </Reveal>
        <p ref={ref} className="max-w-3xl text-h2" style={{ fontWeight: 500 }}>
          {reduce
            ? about.bio
            : words.map((w, i) => (
                <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
              ))}
        </p>
      </div>
    </section>
  );
}
