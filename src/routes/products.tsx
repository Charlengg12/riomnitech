import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

const categories = ["All", "Microcontrollers", "Sensors", "Robotics Kits", "Components", "Tools"] as const;
type Category = (typeof categories)[number];
const sortOptions = ["featured", "price-asc", "price-desc", "name"] as const;
type SortOption = (typeof sortOptions)[number];

type ProductSearch = {
  q: string;
  category: Category;
  inStock: boolean;
  maxPrice: number;
  sort: SortOption;
};

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    const cat = search.category as Category;
    const sort = search.sort as SortOption;
    const maxPrice = Number(search.maxPrice);
    return {
      q: typeof search.q === "string" ? search.q : "",
      category: (categories as readonly string[]).includes(cat) ? cat : "All",
      inStock: search.inStock === true || search.inStock === "true",
      maxPrice: Number.isFinite(maxPrice) && maxPrice >= 0 ? maxPrice : 0,
      sort: (sortOptions as readonly string[]).includes(sort) ? sort : "featured",
    };
  },
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

const PRICE_CEILING = Math.ceil(Math.max(...products.map((p) => p.price)) / 50) * 50;

function ProductsPage() {
  const { q, category, inStock, maxPrice, sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });

  const effectiveMax = maxPrice > 0 ? maxPrice : PRICE_CEILING;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const result = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (inStock && !p.inStock) return false;
      if (p.price > effectiveMax) return false;
      if (query) {
        const haystack = [
          p.name,
          p.description,
          p.sku ?? "",
          p.category,
          ...(p.highlights ?? []),
          ...Object.entries(p.specs ?? {}).flatMap(([k, v]) => [k, v]),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "name":
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result;
    }
  }, [q, category, inStock, effectiveMax, sort]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of categories) map.set(c, 0);
    map.set("All", products.length);
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, []);

  const update = (patch: Partial<{ q: string; category: typeof category; inStock: boolean; maxPrice: number; sort: typeof sort }>) => {
    navigate({ search: (prev: ProductSearch) => ({ ...prev, ...patch }) });
  };

  const resetAll = () => navigate({ search: { q: "", category: "All", inStock: false, maxPrice: 0, sort: "featured" } });

  const hasActiveFilters = q !== "" || category !== "All" || inStock || maxPrice > 0 || sort !== "featured";

  const sortLabels: Record<SortOption, string> = { featured: "Featured", "price-asc": "Price ↑", "price-desc": "Price ↓", name: "Name" };
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (q) activeChips.push({ key: "q", label: `Search: "${q}"`, onRemove: () => update({ q: "" }) });
  if (category !== "All") activeChips.push({ key: "category", label: category, onRemove: () => update({ category: "All" }) });
  if (inStock) activeChips.push({ key: "inStock", label: "In stock only", onRemove: () => update({ inStock: false }) });
  if (maxPrice > 0) activeChips.push({ key: "maxPrice", label: `Under $${maxPrice}`, onRemove: () => update({ maxPrice: 0 }) });
  if (sort !== "featured") activeChips.push({ key: "sort", label: `Sort: ${sortLabels[sort as SortOption]}`, onRemove: () => update({ sort: "featured" }) });

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Shop</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">All products</h1>
        <p className="mt-3 text-muted-foreground">
          Hand-picked robotics, electronics and tooling — curated by engineers.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filters */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div>
            <label htmlFor="search" className="text-sm font-semibold">Search</label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                type="search"
                value={q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search products, specs, SKU…"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">Category</p>
            <ul className="mt-3 space-y-1">
              {categories.map((c) => {
                const isActive = category === c;
                return (
                  <li key={c}>
                    <button
                      onClick={() => update({ category: c })}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <span>{c}</span>
                      <span className={`text-xs ${isActive ? "text-background/70" : "text-muted-foreground/70"}`}>
                        {counts.get(c) ?? 0}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Availability</p>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={inStock}
                onCheckedChange={(v) => update({ inStock: v === true })}
              />
              In stock only
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Max price</p>
              <span className="text-sm tabular-nums text-muted-foreground">
                ${effectiveMax}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={PRICE_CEILING}
              step={10}
              value={effectiveMax}
              onChange={(e) => update({ maxPrice: Number(e.target.value) })}
              className="mt-3 w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>${PRICE_CEILING}</span>
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ search: { q: "", category: "All", inStock: false, maxPrice: 0, sort: "featured" } })}
              className="gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              Clear all
            </Button>
          )}
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Sort by</span>
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value as typeof sort })}
                className="rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-16 rounded-lg border border-dashed border-border py-20 text-center">
              <p className="text-lg font-medium">No products match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing the search or widening your filters.</p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => navigate({ search: { q: "", category: "All", inStock: false, maxPrice: 0, sort: "featured" } })}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
