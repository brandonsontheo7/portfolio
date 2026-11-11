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
    id: "soon-1",
    title: "Coming soon",
    role: "Case study",
    summary: "In progress",
  },
  {
    id: "soon-2",
    title: "Coming soon",
    role: "Case study",
    summary: "In progress",
  },
];
