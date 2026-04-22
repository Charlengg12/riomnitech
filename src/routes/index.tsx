import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cpu, Bot, Zap, ShieldCheck, Sparkles, Code2, Rocket, Wrench } from "lucide-react";
import hero from "@/assets/hero-robotics.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { Reveal } from "@/components/Reveal";
import { useParallax } from "@/hooks/useScrollReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RIO — Engineering the next generation of robotics" },
      { name: "description", content: "RIO designs and ships engineering-grade robotics, microcontrollers, sensors and tools — built for makers, researchers, and industry." },
      { property: "og:title", content: "RIO — Engineering the next generation of robotics" },
      { property: "og:description", content: "Premium robotics components, kits, and tools — built for innovators." },
    ],
  }),
  component: HomePage,
});

const pillars = [
  { icon: Cpu, title: "Compute", body: "ESP32, RP2040 and STM32 boards engineered for production." },
  { icon: Bot, title: "Robotics", body: "Arms, drives and platforms with first-party SDKs." },
  { icon: Zap, title: "Sensing", body: "LIDAR, IMU, vision and environmental modules." },
  { icon: Wrench, title: "Tooling", body: "Curated lab gear that lasts — soldering to oscilloscopes." },
];

const stats = [
  { value: "200+", label: "Components" },
  { value: "48h", label: "Avg. dispatch" },
  { value: "12k", label: "Engineers served" },
  { value: "5★", label: "Support rating" },
];

const workflow = [
  { icon: Sparkles, title: "Specify", body: "Tell us the build. We surface the right parts." },
  { icon: Code2, title: "Prototype", body: "Reference SDKs, schematics and starter projects." },
  { icon: Rocket, title: "Ship", body: "Production-grade components, ready to scale." },
];

function HomePage() {
  const featured = products.slice(0, 4);
  const parallaxY = useParallax(0.18);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(800px 400px at 80% 0%, oklch(0.68 0.13 228 / 0.15), transparent 60%), radial-gradient(600px 300px at 0% 30%, oklch(0.52 0.13 232 / 0.12), transparent 60%)",
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-32">
          <div className="lg:col-span-6">
            <Reveal tilt="left">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> RIO Arm v2 — now shipping worldwide
              </span>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Engineering the<br />
                <span className="bg-gradient-to-r from-primary to-[oklch(0.52_0.13_232)] bg-clip-text text-transparent">
                  next generation
                </span>
                <br />of robotics.
              </h1>
              <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
                From microcontrollers to fully programmable arms — every part in the RIO catalog is selected, tested,
                and supported by working engineers.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/products">
                    Explore the catalog <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">Our mission</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <div
              className="relative"
              style={{
                transform: `perspective(1400px) rotateY(-6deg) rotateX(4deg) translateY(${-parallaxY * 0.2}px)`,
                transformStyle: "preserve-3d",
                transition: "transform 80ms linear",
              }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-secondary shadow-[var(--shadow-glow)]">
                <img
                  src={hero}
                  alt="RIO robotics components arranged on a clean studio surface"
                  className="h-full w-full object-cover"
                  style={{ transform: `translateY(${parallaxY * 0.1}px) scale(1.06)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-background/90 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Live</p>
                <p className="mt-1 font-display text-lg font-semibold">98.4% uptime</p>
                <p className="text-xs text-muted-foreground">Across customer fleets</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <Reveal>
          <div className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-background px-6 py-6 text-center">
                  <dt className="font-display text-3xl font-semibold tracking-tight">{s.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      {/* PILLARS */}
      <section className="border-y border-border bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">What we build</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Four pillars. One precise stack.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} tilt={i % 2 === 0 ? "left" : "right"}>
                <Link
                  to="/products"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <p.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                    Browse <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              From idea to deployed system.
            </h2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {workflow.map((w, i) => (
            <Reveal key={w.title} delay={i * 100} tilt="up">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background to-secondary/40 p-8">
                <span className="font-display text-6xl font-semibold text-primary/15">0{i + 1}</span>
                <w.icon className="absolute right-6 top-6 h-6 w-6 text-primary" />
                <h3 className="mt-2 font-display text-xl font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-t border-border bg-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Featured</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">This month's selection</h2>
              </div>
              <Link to="/products" className="hidden text-sm font-medium text-foreground hover:text-primary sm:inline-flex sm:items-center sm:gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} tilt={i % 2 === 0 ? "left" : "right"}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal tilt="up">
          <div
            className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-background sm:px-14 sm:py-20"
            style={{
              backgroundImage:
                "radial-gradient(600px 300px at 90% 10%, oklch(0.68 0.13 228 / 0.35), transparent 60%), radial-gradient(500px 250px at 0% 90%, oklch(0.52 0.13 232 / 0.3), transparent 60%)",
            }}
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Engineering support, included.
                </h2>
                <p className="mt-4 max-w-lg text-base text-background/70">
                  Every order is backed by working engineers. Need help selecting components, designing a circuit, or
                  scaling a build? We're one message away.
                </p>
              </div>
              <div className="flex gap-3 lg:justify-end">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/contact">Talk to an engineer</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background">
                  <Link to="/products">Shop now</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
