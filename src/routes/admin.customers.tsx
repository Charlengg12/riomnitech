import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { getOrders } from "@/lib/store";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const [customers, setCustomers] = useState<{ name: string; email: string; orders: number; spend: number }[]>([]);
  useEffect(() => {
    const orders = getOrders();
    const map = new Map<string, { name: string; email: string; orders: number; spend: number }>();
    for (const o of orders) {
      const key = o.userEmail.toLowerCase();
      const cur = map.get(key) ?? { name: o.userName, email: o.userEmail, orders: 0, spend: 0 };
      cur.orders += 1;
      cur.spend += o.total;
      map.set(key, cur);
    }
    setCustomers([...map.values()].sort((a, b) => b.spend - a.spend));
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Users className="h-5 w-5" /></div>
        <div>
          <h1 className="font-display text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">{customers.length} unique customers</p>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">Name</th>
              <th className="px-4 py-2.5 text-left font-medium">Email</th>
              <th className="px-4 py-2.5 text-right font-medium">Orders</th>
              <th className="px-4 py-2.5 text-right font-medium">Total spend</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.orders}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">${c.spend.toFixed(2)}</td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No customers yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
