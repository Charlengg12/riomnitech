import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import type { Product } from "@/data/products";
import { fetchProducts, upsertProduct, deleteProduct, fetchCategories, type Category } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type Draft = Product;

const empty = (defaultCategory: string): Draft => ({
  id: crypto.randomUUID(),
  slug: "",
  name: "",
  category: defaultCategory as Product["category"],
  price: 0,
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  description: "",
  inStock: true,
  stockCount: 0,
  sku: "",
  highlights: [],
  specs: {},
});

function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<{ draft: Draft; isNew: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([fetchProducts(), fetchCategories()]);
      setItems(p);
      setCategories(c);
    } catch (e) {
      toast.error("Failed to load products", { description: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const slug = editing.draft.slug || editing.draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setSaving(true);
    try {
      await upsertProduct({ ...editing.draft, slug }, editing.isNew);
      toast.success(editing.isNew ? "Product created" : "Product updated");
      setEditing(null);
      reload();
    } catch (err) {
      toast.error("Save failed", { description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      toast.error("Delete failed", { description: (err as Error).message });
    }
  };

  const catNames = categories.length ? categories.map((c) => c.name) : ["Microcontrollers", "Sensors", "Robotics Kits", "Components", "Tools"];
  const draft = editing?.draft;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">{items.length} items in catalog</p>
        </div>
        <Button onClick={() => setEditing({ draft: empty(catNames[0]), isNew: true })} className="gap-2">
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
                    <Button size="icon" variant="ghost" onClick={() => setEditing({ draft: { ...p }, isNew: false })} aria-label="Edit">
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
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "No products. Add your first."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSubmit}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-glow)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">
                {editing.isNew ? "New product" : "Edit product"}
              </h3>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={draft.name} onChange={(e) => setEditing({ ...editing, draft: { ...draft, name: e.target.value } })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input id="price" type="number" min={0} step="0.01" required value={draft.price}
                    onChange={(e) => setEditing({ ...editing, draft: { ...draft, price: Number(e.target.value) } })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={draft.category}
                    onChange={(e) => setEditing({ ...editing, draft: { ...draft, category: e.target.value as Product["category"] } })}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {catNames.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={draft.sku ?? ""} onChange={(e) => setEditing({ ...editing, draft: { ...draft, sku: e.target.value } })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock count</Label>
                  <Input id="stock" type="number" min={0} value={draft.stockCount ?? 0}
                    onChange={(e) => setEditing({ ...editing, draft: { ...draft, stockCount: Number(e.target.value), inStock: Number(e.target.value) > 0 } })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" required value={draft.image} onChange={(e) => setEditing({ ...editing, draft: { ...draft, image: e.target.value } })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} required value={draft.description}
                  onChange={(e) => setEditing({ ...editing, draft: { ...draft, description: e.target.value } })} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.inStock}
                  onChange={(e) => setEditing({ ...editing, draft: { ...draft, inStock: e.target.checked } })}
                  className="h-4 w-4 rounded border-input"
                />
                In stock
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save product"}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
