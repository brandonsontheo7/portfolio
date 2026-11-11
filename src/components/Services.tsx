import { services } from "@/data/content";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";

export default function Services() {
  return (
    <section
      id="services"
      className="mx-auto max-w-page px-6 py-section-sm md:px-16 md:py-section"
    >
      <Reveal>
        <p className="label text-ink-muted">Services</p>
      </Reveal>

      <ul className="mt-10 grid border-t border-line md:grid-cols-2">
        {services.map((s, i) => (
          <li key={s.name} className="group border-b border-line py-10 md:pr-12">
            <Reveal delay={(i % 2) * 0.1 + Math.floor(i / 2) * 0.05}>
              <div className="flex items-start justify-between gap-6">
                <span className="label text-accent">{String(i + 1).padStart(2, "0")}</span>
                <ServiceIcon index={i} delay={0.2} />
              </div>
              <h3 className="mt-6 text-h2">{s.name}</h3>
              <p className="mt-3 max-w-md text-body text-ink-muted">{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
