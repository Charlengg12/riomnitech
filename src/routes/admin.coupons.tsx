import { createFileRoute } from "@tanstack/react-router";
import { Ticket, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/coupons")({
  component: CouponsPage,
});

const sample = [
  { code: "WELCOME10", discount: "10% off", uses: 124, status: "active" },
  { code: "FREESHIP", discount: "Free shipping", uses: 56, status: "active" },
  { code: "MAKER25", discount: "$25 off $150+", uses: 12, status: "paused" },
];

function CouponsPage() {
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
        <Button className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New coupon</Button>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
        {sample.map((c) => (
          <li key={c.code} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-mono text-sm font-bold tracking-wide">{c.code}</p>
              <p className="text-xs text-muted-foreground">{c.discount} · {c.uses} uses</p>
            </div>
            <span className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${c.status === "active" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
