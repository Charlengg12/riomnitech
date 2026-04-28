import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { getOrders, type Order } from "@/lib/store";

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-muted text-muted-foreground",
  processing: "bg-primary/15 text-primary",
  shipped: "bg-accent/15 text-accent",
  delivered: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => { setOrders(getOrders()); }, []);

  const myOrders = useMemo(
    () => orders.filter((o) => user && o.userEmail.toLowerCase() === user.email.toLowerCase()),
    [orders, user],
  );

  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">My Orders</h2>
        <span className="text-sm text-muted-foreground">{myOrders.length} total</span>
      </div>

      {myOrders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border py-12 text-center">
          <Package className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No orders yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Start shopping to see your order history.</p>
          <Button asChild variant="outline" className="mt-4 rounded-full">
            <Link to="/products">Browse products</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {myOrders.map((o) => (
            <li key={o.id} className="rounded-xl border border-border p-4 transition-colors hover:border-accent/40">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-semibold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[o.status]}`}>{o.status}</span>
              </div>
              <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                {o.lines.map((l) => (
                  <li key={l.productId} className="flex items-center justify-between text-muted-foreground">
                    <span>{l.qty} × {l.name}</span>
                    <span className="tabular-nums">${(l.qty * l.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="font-display text-lg font-bold tabular-nums">${o.total.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
