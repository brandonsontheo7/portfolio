import { hero, nav } from "@/data/content";
import Reveal from "@/components/Reveal";
import HeroBackground from "@/components/HeroBackground";
import WorkList from "@/components/WorkList";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="page-root">
      <section className="relative isolate overflow-hidden">
        <HeroBackground />
        <main className="mx-auto flex min-h-screen max-w-page flex-col justify-center px-6 md:px-16">
          <Reveal>
            <p className="label text-ink-muted">Brandon Studio</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 max-w-[14ch] text-hero">{hero.headline}</h1>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-xl text-body text-ink-muted">{hero.sub}</p>
          </Reveal>
          <Reveal delay={0.4}>
            <a
              href="#contact"
              className="mt-12 block w-fit rounded-cta bg-accent px-6 py-3 font-medium text-white"
            >
              {nav.cta}
            </a>
          </Reveal>
        </main>
      </section>
      <WorkList />
      <Services />
      <About />
      <Contact />
    </div>
  );
}
