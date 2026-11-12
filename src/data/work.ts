export type WorkItem = {
  id: string;
  title: string;
  role: string;
  summary: string;
  preview?: string; // path in /public, 4:3
  href?: string;
};

export const work: WorkItem[] = [
  {
    id: "landers",
    title: "LANDERS",
    role: "UI/UX Designer",
    summary: "Blockchain-based land trading platform",
    preview: "/landers.webp",
    href: "https://app.notion.com/p/LANDERS-Naskah-Perancangan-Design-Paper-4143b195586781888710ce9f271c23f7", // TODO: ganti ke halaman case study saat sudah ada
  },
  {
    id: "kusmadi",
    title: "KUSMADI",
    role: "Case study",
    summary: "Green Energy for Data Center, AI, and Humanoid Robots Power Supply",
    preview: "/Kusmadi.jpeg",
    href: "https://kusmadi.vercel.app"
  },
  {
    id: "soon-1",
    title: "Coming soon",
    role: "-",
    summary: "On progress",
  },
];
