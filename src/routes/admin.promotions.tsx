import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Megaphone, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { fetchPromotions, upsertPromotion, deletePromotion, type Promotion } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/promotions")({
  component: PromotionsPage,
});

type Draft = Omit<Promotion, "id"> & { id?: string };
const empty = (): Draft => ({ title: "", subtitle: "", ctaLabel: "", ctaUrl: "", image: "", active: true });

function PromotionsPage() {
  const [items, setItems] = useState<Promotion[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try { setItems(await fetchPromotions()); }
    catch (e) { toast.error("Failed to load promotions", { description: (e as Error).message }); }
    finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await upsertPromotion(editing);
      toast.success(editing.id ? "Promotion updated" : "Promotion created");
      setEditing(null);
      reload();
    } catch (err) { toast.error("Save failed", { description: (err as Error).message }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this promotion?")) return;
    try {
      await deletePromotion(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) { toast.error("Delete failed", { description: (e as Error).message }); }
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Megaphone className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">Promotions</h1>
            <p className="text-sm text-muted-foreground">Plan campaigns and seasonal pushes.</p>
          </div>
        </div>
        <Button onClick={() => setEditing(empty())} className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New promotion</Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <article key={p.id} className="rounded-xl border border-border bg-secondary/30 p-5">
            <div className="flex items-center justify-between">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${p.active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{p.active ? "active" : "paused"}</span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setEditing({ ...p })}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
            </div>
            <h3 className="mt-2 font-display text-base font-semibold">{p.title}</h3>
            {p.subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{p.subtitle}</p>}
            {p.ctaLabel && <p className="mt-3 text-sm font-medium">{p.ctaLabel} → {p.ctaUrl}</p>}
          </article>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "No promotions yet."}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-glow)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{editing.id ? "Edit promotion" : "New promotion"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ptitle">Title</Label>
                <Input id="ptitle" required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="psub">Subtitle</Label>
                <Textarea id="psub" rows={2} value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pcta">CTA label</Label>
                  <Input id="pcta" value={editing.ctaLabel ?? ""} onChange={(e) => setEditing({ ...editing, ctaLabel: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="purl">CTA URL</Label>
                  <Input id="purl" value={editing.ctaUrl ?? ""} onChange={(e) => setEditing({ ...editing, ctaUrl: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="h-4 w-4 rounded border-input" />
                Active
              </label>
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
