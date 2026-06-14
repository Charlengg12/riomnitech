import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageSquare, Loader2, Trash2 } from "lucide-react";
import { fetchInquiries, updateInquiryStatus, deleteInquiry, type Inquiry } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/inquiries")({
  component: InquiriesPage,
});

const statuses: Inquiry["status"][] = ["open", "responded", "closed"];

function InquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try { setItems(await fetchInquiries()); }
    catch (e) { toast.error("Failed to load inquiries", { description: (e as Error).message }); }
    finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, []);

  const setStatus = async (id: string, status: Inquiry["status"]) => {
    try {
      await updateInquiryStatus(id, status);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch (e) { toast.error("Update failed", { description: (e as Error).message }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await deleteInquiry(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) { toast.error("Delete failed", { description: (e as Error).message }); }
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><MessageSquare className="h-5 w-5" /></div>
        <div>
          <h1 className="font-display text-2xl font-bold">Inquiries</h1>
          <p className="text-sm text-muted-foreground">Customer messages from the contact form.</p>
        </div>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
        {items.map((m) => (
          <li key={m.id} className="hover:bg-secondary/30">
            <button onClick={() => setOpen(open === m.id ? null : m.id)} className="flex w-full flex-wrap items-start justify-between gap-3 p-4 text-left">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{m.name}</p>
                  {m.status === "open" && <span className="inline-block h-2 w-2 rounded-full bg-accent" />}
                </div>
                <p className="text-xs text-muted-foreground">{m.email}</p>
                <p className="mt-1 line-clamp-1 text-sm">{m.subject || m.message.slice(0, 80)}</p>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</span>
            </button>
            {open === m.id && (
              <div className="border-t border-border bg-secondary/20 p-4">
                <p className="whitespace-pre-wrap text-sm">{m.message}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <select
                    value={m.status}
                    onChange={(e) => setStatus(m.id, e.target.value as Inquiry["status"])}
                    className="rounded-md border border-input bg-background px-2 py-1 text-xs capitalize"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button size="sm" variant="ghost" onClick={() => remove(m.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
        {items.length === 0 && <li className="px-4 py-12 text-center text-muted-foreground">{loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "No inquiries yet."}</li>}
      </ul>
    </div>
  );
}
