import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Ticket, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { fetchCoupons, upsertCoupon, deleteCoupon, type Coupon } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/coupons")({
  component: CouponsPage,
});

type Draft = Omit<Coupon, "id"> & { id?: string };

const empty = (): Draft => ({ code: "", description: "", discountType: "percent", discountValue: 10, active: true, expiresAt: null });

function CouponsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try { setItems(await fetchCoupons()); }
    catch (e) { toast.error("Failed to load coupons", { description: (e as Error).message }); }
    finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await upsertCoupon(editing);
      toast.success(editing.id ? "Coupon updated" : "Coupon created");
      setEditing(null);
      reload();
    } catch (err) { toast.error("Save failed", { description: (err as Error).message }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      setItems((prev) => prev.filter((c) => c.id !== id));
    } catch (e) { toast.error("Delete failed", { description: (e as Error).message }); }
  };

  const formatDiscount = (c: Coupon) => c.discountType === "percent" ? `${c.discountValue}% off` : `$${c.discountValue} off`;

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Ticket className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">Coupons</h1>
            <p className="text-sm text-muted-foreground">Create and manage discount codes.</p>
          </div>
        </div>
        <Button onClick={() => setEditing(empty())} className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New coupon</Button>
      </div>

      <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
        {items.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="font-mono text-sm font-bold tracking-wide">{c.code}</p>
              <p className="text-xs text-muted-foreground">{formatDiscount(c)}{c.description ? ` · ${c.description}` : ""}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${c.active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                {c.active ? "active" : "paused"}
              </span>
              <Button size="icon" variant="ghost" onClick={() => setEditing({ ...c })}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="px-4 py-12 text-center text-muted-foreground">{loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "No coupons yet."}</li>}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-glow)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{editing.id ? "Edit coupon" : "New coupon"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <Input id="code" required value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} className="font-mono uppercase" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ddesc">Description</Label>
                <Input id="ddesc" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="dtype">Type</Label>
                  <select id="dtype" value={editing.discountType} onChange={(e) => setEditing({ ...editing, discountType: e.target.value as "percent" | "fixed" })} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dval">Value</Label>
                  <Input id="dval" type="number" min={0} step="0.01" required value={editing.discountValue} onChange={(e) => setEditing({ ...editing, discountValue: Number(e.target.value) })} />
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
