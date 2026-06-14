import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Tags, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { fetchCategories, upsertCategory, deleteCategory, fetchProducts, type Category } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

type Draft = { id?: string; slug: string; name: string; description: string | null };

function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
      setItems(cats);
      const c: Record<string, number> = {};
      for (const p of prods) c[p.category] = (c[p.category] ?? 0) + 1;
      setCounts(c);
    } catch (e) {
      toast.error("Failed to load", { description: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const slug = editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      await upsertCategory({ ...editing, slug });
      toast.success(editing.id ? "Category updated" : "Category created");
      setEditing(null);
      reload();
    } catch (err) {
      toast.error("Save failed", { description: (err as Error).message });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setItems((prev) => prev.filter((c) => c.id !== id));
      toast.success("Deleted");
    } catch (e) {
      toast.error("Delete failed", { description: (e as Error).message });
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Tags className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">Categories</h1>
            <p className="text-sm text-muted-foreground">Organize your catalog into categories.</p>
          </div>
        </div>
        <Button onClick={() => setEditing({ slug: "", name: "", description: "" })} className="gap-2"><Plus className="h-4 w-4" /> New category</Button>
      </div>

      <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
        {items.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="font-medium">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">{c.description || c.slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{counts[c.name] ?? 0} {(counts[c.name] ?? 0) === 1 ? "product" : "products"}</span>
              <Button size="icon" variant="ghost" onClick={() => setEditing({ id: c.id, slug: c.slug, name: c.name, description: c.description })}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-4 py-12 text-center text-muted-foreground">{loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "No categories yet."}</li>
        )}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-glow)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{editing.id ? "Edit category" : "New category"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cname">Name</Label>
                <Input id="cname" required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cslug">Slug (optional)</Label>
                <Input id="cslug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated from name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cdesc">Description</Label>
                <Textarea id="cdesc" rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
