import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Shop — RIO" },
      { name: "description", content: "Browse robotics kits, microcontrollers, sensors, components and tools at RIO." },
      { property: "og:title", content: "Shop — RIO" },
      { property: "og:description", content: "Browse robotics kits, microcontrollers, sensors and tools." },
    ],
  }),
  component: ProductsPage,
});

const categories = ["All", "Microcontrollers", "Sensors", "Robotics Kits", "Components", "Tools"] as const;

function ProductsPage() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const filtered = useMemo(
    () => (active === "All" ? products : products.filter((p) => p.category === active)),
    [active],
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Shop</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">All products</h1>
        <p className="mt-3 text-muted-foreground">
          Hand-picked robotics, electronics and tooling — curated by engineers.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === c
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
