import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cpu, Bot, Zap, ShieldCheck } from "lucide-react";
import hero from "@/assets/hero-robotics.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RIO — Robotics & Innovation Omnitech" },
      { name: "description", content: "Engineering-grade robotics, microcontrollers, sensors and tools for makers and industry." },
      { property: "og:title", content: "RIO — Robotics & Innovation Omnitech" },
      { property: "og:description", content: "Engineering-grade components, kits and tools — built for innovators." },
    ],
  }),
  component: HomePage,
});

const categories = [
  { name: "Microcontrollers", icon: Cpu },
  { name: "Robotics Kits", icon: Bot },
  { name: "Sensors", icon: Zap },
  { name: "Tools", icon: ShieldCheck },
];

function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-28">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> New: RIO Arm v2 — now shipping
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Build what's <span className="text-primary">next.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Robotics & Innovation Omnitech engineers premium-grade components, kits and tools for the people pushing technology forward.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/products">
                  Shop the catalog <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Our mission</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              <div><dt className="text-2xl font-semibold tracking-tight">200+</dt><dd className="text-xs text-muted-foreground">Components in stock</dd></div>
              <div><dt className="text-2xl font-semibold tracking-tight">48h</dt><dd className="text-xs text-muted-foreground">Avg. dispatch</dd></div>
              <div><dt className="text-2xl font-semibold tracking-tight">5★</dt><dd className="text-xs text-muted-foreground">Engineer support</dd></div>
            </dl>
          </div>
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl bg-secondary shadow-[var(--shadow-soft)]">
              <img src={hero} alt="RIO robotics components arranged on a clean studio surface" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border lg:grid-cols-4 lg:px-0">
          {categories.map((c) => (
            <Link
              key={c.name}
              to="/products"
              className="group flex items-center gap-3 bg-background px-6 py-6 transition-colors hover:bg-accent/40"
            >
              <c.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{c.name}</span>
              <ArrowRight className="ml-auto h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Featured</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">This month's selection</h2>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-foreground hover:text-primary sm:inline-flex sm:items-center sm:gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-foreground px-8 py-14 text-background sm:px-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Engineering support, included.</h2>
              <p className="mt-4 max-w-lg text-base text-background/70">
                Every order is backed by our team of engineers. Need help selecting components, designing a circuit, or scaling a build? We're one message away.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/contact">Talk to an engineer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
