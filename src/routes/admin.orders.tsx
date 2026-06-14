import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { fetchOrders, updateOrderStatus, deleteOrder, type Order, type OrderStatus } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  processing: "bg-primary/15 text-primary",
  shipped: "bg-accent text-accent-foreground",
  delivered: "bg-foreground text-background",
  cancelled: "bg-destructive/15 text-destructive",
};

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      setOrders(await fetchOrders());
    } catch (e) {
      toast.error("Failed to load orders", { description: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (e) {
      toast.error("Update failed", { description: (e as Error).message });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Order deleted");
    } catch (e) {
      toast.error("Delete failed", { description: (e as Error).message });
    }
  };

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Orders</h2>
          <p className="text-sm text-muted-foreground">{visible.length} of {orders.length} shown</p>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === "all" ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                filter === s ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Order</th>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => (
              <Fragment key={o.id}>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">
                    <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="font-mono text-xs font-semibold text-foreground hover:underline">
                      #{o.id.slice(0, 8)}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.userName || "—"}</p>
                    <p className="text-xs text-muted-foreground">{o.userEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-1 focus:ring-ring ${statusColors[o.status]}`}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => remove(o.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
                {expanded === o.id && (
                  <tr className="border-t border-border bg-secondary/20">
                    <td colSpan={6} className="px-4 py-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Line items</p>
                      <ul className="space-y-1 text-sm">
                        {o.lines.map((l, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span>{l.qty} × {l.name}</span>
                            <span className="tabular-nums text-muted-foreground">${(l.qty * l.price).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "No orders for this filter"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
