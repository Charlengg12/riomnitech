import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { getOrders, getProducts, type Order } from "@/lib/store";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

const statusColors: Record<Order["status"], string> = {
  pending: "bg-muted text-muted-foreground",
  processing: "bg-primary/15 text-primary",
  shipped: "bg-accent text-accent-foreground",
  delivered: "bg-foreground text-background",
  cancelled: "bg-destructive/15 text-destructive",
};

function AdminOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setOrders(getOrders());
    setProducts(getProducts());
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
    const customers = new Set(orders.map((o) => o.userEmail)).size;
    const pending = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
    return { revenue, customers, pending, orderCount: orders.length };
  }, [orders]);

  const topProducts = useMemo(() => {
    const counts = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const o of orders) {
      for (const l of o.lines) {
        const cur = counts.get(l.productId) ?? { name: l.name, qty: 0, revenue: 0 };
        cur.qty += l.qty;
        cur.revenue += l.qty * l.price;
        counts.set(l.productId, cur);
      }
    }
    return [...counts.entries()]
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  const recent = orders.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const cards = [
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, sub: "All-time" },
    { label: "Orders", value: stats.orderCount.toString(), icon: ShoppingBag, sub: `${stats.pending} active` },
    { label: "Customers", value: stats.customers.toString(), icon: Users, sub: "Unique buyers" },
    { label: "Catalog", value: products.length.toString(), icon: TrendingUp, sub: `${products.filter((p) => p.inStock).length} in stock` },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tabular-nums">{c.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent orders</h2>
            <span className="text-xs text-muted-foreground">Last 5</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Order</th>
                  <th className="px-3 py-2 text-left font-medium">Customer</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                    <td className="px-3 py-2">{o.userName}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusColors[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">${o.total.toFixed(2)}</td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-lg font-semibold">Top products</h2>
          <ul className="mt-4 space-y-3">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="font-display text-2xl font-semibold text-muted-foreground/40 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.qty} sold</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">${p.revenue.toFixed(0)}</span>
              </li>
            ))}
            {topProducts.length === 0 && <li className="text-sm text-muted-foreground">No sales yet</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
