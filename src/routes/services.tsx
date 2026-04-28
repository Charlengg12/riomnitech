import { createFileRoute, Link } from "@tanstack/react-router";
import { Cpu, Bot, Wrench, Code2, GraduationCap, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — RIO Robotics & Innovation" },
      { name: "description", content: "Custom robotics development, IoT prototyping, electronics design, training and consultation services from RIO." },
      { property: "og:title", content: "Services — RIO Robotics & Innovation" },
      { property: "og:description", content: "From rapid prototyping to production-grade builds — engineering services tailored to your project." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Bot,
    title: "Custom Robotics Development",
    body: "Mechanical design, motion planning and SDK delivery for arms, AGVs and inspection robots — tailored to your spec.",
    bullets: ["Mechanical + electrical design", "ROS 2 integration", "Production-ready firmware"],
  },
  {
    icon: Cpu,
    title: "IoT & Embedded Prototyping",
    body: "ESP32, RP2040 and STM32 prototypes with cloud connectivity, OTA updates and hardened security.",
    bullets: ["Cloud connectivity (MQTT/HTTP)", "OTA firmware updates", "Battery & power optimization"],
  },
  {
    icon: Code2,
    title: "Web & Dashboard Development",
    body: "Real-time dashboards, fleet management UIs and admin panels — built on a modern stack.",
    bullets: ["React + TypeScript", "Real-time telemetry", "Role-based access control"],
  },
  {
    icon: Wrench,
    title: "PCB Design & Assembly",
    body: "From schematic to assembled boards. Small-batch and pilot runs with full documentation.",
    bullets: ["KiCad / Altium designs", "DFM & BOM optimization", "Small-batch assembly"],
  },
  {
    icon: GraduationCap,
    title: "Training & Workshops",
    body: "Onsite and remote workshops on Arduino, robotics and embedded engineering for schools and teams.",
    bullets: ["Curriculum design", "Hands-on labs", "Educator resources"],
  },
  {
    icon: Sparkles,
    title: "Consultation",
    body: "Architecture reviews, BOM cost reduction and technical due diligence for early-stage products.",
    bullets: ["Technical due diligence", "Cost & supply review", "Roadmap planning"],
  },
];

function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-background">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">What We Do</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              Services <span className="text-accent">We Offer</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Let us help you bring innovative projects to life with our comprehensive range of engineering services.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">Get a Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/projects">See Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              <ul className="mt-4 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-16 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Have a project in mind?</h2>
            <p className="mt-2 max-w-xl text-primary-foreground/70">Tell us what you're building. We'll reply within one business day.</p>
          </div>
          <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/contact">Start a conversation <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
