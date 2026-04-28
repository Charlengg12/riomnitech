import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/promotions")({
  component: PromotionsPage,
});

const promos = [
  { name: "Back-to-School Sale", window: "Aug 1 – Sep 15", reach: "12.4k views", status: "scheduled" },
  { name: "Holiday Drop", window: "Nov 20 – Dec 31", reach: "—", status: "draft" },
  { name: "Maker Month", window: "Always-on", reach: "8.1k views", status: "active" },
];

function PromotionsPage() {
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
        <Button className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New promotion</Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promos.map((p) => (
          <article key={p.name} className="rounded-xl border border-border bg-secondary/30 p-5">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${p.status === "active" ? "bg-accent/15 text-accent" : p.status === "scheduled" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
            <h3 className="mt-2 font-display text-base font-semibold">{p.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{p.window}</p>
            <p className="mt-3 text-sm font-medium">{p.reach}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
