# Portfolio — Brandon

Next.js (App Router) · Tailwind CSS v4 · Framer Motion · Plus Jakarta Sans (self-hosted)

## Run
    npm install
    npm run dev      # http://localhost:3000
    npm run build

## Structure
- `src/app/globals.css` — design tokens from design.md (color, type scale, spacing, focus, reduced motion)
- `src/lib/motion.ts` — spring, reveal and cursor constants (design.md §5)
- `src/data/content.ts` — approved copy (hero, work, services, about)
- `public/work/landers.webp` — 4:3 preview for the Work section

## Tailwind utilities from tokens
bg-bg · text-ink · text-ink-muted · border-line · bg-accent
text-hero · text-work · text-h2 · text-body · .label
max-w-page · py-section · py-section-sm · rounded-cta
