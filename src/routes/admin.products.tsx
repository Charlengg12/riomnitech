import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { getProducts, saveProducts } from "@/lib/store";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const categories: Product["category"][] = ["Microcontrollers", "Sensors", "Robotics Kits", "Components", "Tools"];

type Draft = Omit<Product, "highlights" | "specs"> & { highlights?: string[]; specs?: Record<string, string> };

const empty = (): Draft => ({
  id: crypto.randomUUID(),
  slug: "",
  name: "",
  category: "Components",
  price: 0,
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  description: "",
  inStock: true,
  stockCount: 0,
  sku: "",
});

function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);

  useEffect(() => {
    setItems(getProducts());
  }, []);

  const persist = (next: Product[]) => {
    setItems(next);
    saveProducts(next);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const exists = items.some((i) => i.id === editing.id);
    const slug = editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const next = exists
      ? items.map((i) => (i.id === editing.id ? { ...editing, slug } : i))
      : [{ ...editing, slug }, ...items];
    persist(next);
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return;
    persist(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">{items.length} items in catalog</p>
        </div>
        <Button onClick={() => setEditing(empty())} className="gap-2">
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.sku ?? p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-right tabular-nums">${p.price}</td>
                <td className="px-4 py-3 text-right">
                  {p.inStock ? (
                    <span className="text-xs">{p.stockCount ?? "—"}</span>
                  ) : (
                    <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-xs text-destructive">Out</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing({ ...p })} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(p.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No products. Add your first.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSubmit}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-glow)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">
                {items.some((i) => i.id === editing.id) ? "Edit product" : "New product"}
              </h3>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input id="price" type="number" min={0} step="0.01" required value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value as Product["category"] })}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={editing.sku ?? ""} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock count</Label>
                  <Input id="stock" type="number" min={0} value={editing.stockCount ?? 0}
                    onChange={(e) => setEditing({ ...editing, stockCount: Number(e.target.value), inStock: Number(e.target.value) > 0 })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" required value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} required value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.inStock}
                  onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                />
                In stock
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit">Save product</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
