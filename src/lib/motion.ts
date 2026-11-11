// Motion constants from design.md §5 — single source of truth.
export const cursorSpring = { type: "spring", stiffness: 150, damping: 20 } as const;

export const revealEase = [0.22, 1, 0.36, 1] as const;

export const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: revealEase },
  },
};

export const dot = {
  size: 10,
  sizeHover: 40,
  hoverTransition: { duration: 0.2, ease: "easeOut" },
} as const;

export const preview = {
  width: 320,
  height: 240,
  fadeDuration: 0.15,
  offset: { x: 24, y: 24 }, // keep image from covering the hovered title
} as const;
