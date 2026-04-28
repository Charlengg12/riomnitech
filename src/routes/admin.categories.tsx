import { createFileRoute } from "@tanstack/react-router";
import { Tags } from "lucide-react";
import { products } from "@/data/products";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Tags className="h-5 w-5" /></div>
        <div>
          <h1 className="font-display text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize your catalog into categories.</p>
        </div>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
        {Object.entries(counts).map(([cat, count]) => (
          <li key={cat} className="flex items-center justify-between p-4">
            <span className="font-medium">{cat}</span>
            <span className="text-sm text-muted-foreground">{count} {count === 1 ? "product" : "products"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
