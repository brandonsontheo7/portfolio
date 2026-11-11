import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Cursor from "@/components/Cursor";

// Self-hosted Plus Jakarta Sans (variable, weights 200–800, latin).
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brandon Studio — AI-UX Design Studio",
  description:
    "An AI-UX design studio turning complex systems into interfaces people understand.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} antialiased`}>
      <body className="min-h-screen">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
