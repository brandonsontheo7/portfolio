// Step 1 copy (approved). English only, no location in bio.
export const hero = {
  headline: "Transforming problems into solutions.",
  sub: "An AI-UX design studio turning complex problems into beautiful interfaces people understand.",
};

export type CaseStudy = {
  slug: string;
  title: string;
  role: string;
  summary: string;
  description: string;
  image?: string; // 4:3 preview, omit for placeholders
  alt?: string;
};

export const work: CaseStudy[] = [
  {
    slug: "landers",
    title: "LANDERS",
    role: "UI/UX Designer, Personal Project",
    summary:
      "A land marketplace on a blockchain database, built for Indonesia's 2028 move to blockchain-based land records.",
    description:
      "Buying land involves trust, paperwork, and a lot of uncertainty. LANDERS explores a marketplace backed by a blockchain database, aligned with the government's 2028 plan for blockchain-based land records.",
    image: "/work/landers.webp",
    alt: "LANDERS dispute detail screen showing two overlapping land claims on a map",
  },
  {
    slug: "coming-soon-1",
    title: "Coming soon",
    role: "",
    summary: "",
    description: "",
  },
  {
    slug: "coming-soon-2",
    title: "Coming soon",
    role: "",
    summary: "",
    description: "",
  },
];

export const services = [
  {
    name: "AI Product Design",
    text: "Interfaces for AI-powered products, from first concept to polished screens.",
  },
  {
    name: "UX Research",
    text: "Understanding users and their context before anything is designed.",
  },
  {
    name: "Data-Heavy Interface Design",
    text: "Dashboards and platforms where complexity must feel simple.",
  },
  {
    name: "Design Systems",
    text: "Consistent tokens and components, ready for developer handoff.",
  },
];

export const about = {
  bio: "I'm Brandon, an Information Systems student and AI-UX Designer. I focus on AI products and data-heavy platforms, and I'm building an AI-UX studio to help teams make complex problems into simple and easy-to-use products.",
};

export const nav = { cta: "Let's talk" };
