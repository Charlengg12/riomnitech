import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Package, LogOut, ShieldCheck, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { getOrders, type Order } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — RIO" },
      { name: "description", content: "Your RIO account — view orders, manage your profile, and track shipping for every robotics build." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "My account — RIO" },
      { property: "og:description", content: "Manage your RIO orders, profile, and shipping details in one place." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AccountPage,
});

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-muted text-muted-foreground",
  processing: "bg-primary/15 text-primary",
  shipped: "bg-accent text-accent-foreground",
  delivered: "bg-foreground text-background",
  cancelled: "bg-destructive/15 text-destructive",
};

function AccountPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/account" } });
      return;
    }
    setOrders(getOrders());
  }, [isAuthenticated, loading, navigate]);

  const myOrders = useMemo(
    () => orders.filter((o) => user && o.userEmail.toLowerCase() === user.email.toLowerCase()),
    [orders, user],
  );

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Account</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Hi, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-muted-foreground">Manage your orders, profile, and preferences.</p>
        </div>
        <Button variant="outline" onClick={() => { logout(); navigate({ to: "/" }); }} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Profile card */}
        <aside className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile</p>
            <p className="mt-3 font-display text-xl font-semibold">{user.name}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" /> {user.role === "admin" ? "Administrator" : "Customer"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Member since</p>
            <p className="mt-2 text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          {user.role === "admin" && (
            <Button asChild className="w-full">
              <Link to="/admin">Open admin dashboard</Link>
            </Button>
          )}
        </aside>

        {/* Orders */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Orders</h2>
            <span className="text-sm text-muted-foreground">{myOrders.length} total</span>
          </div>

          {myOrders.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border py-12 text-center">
              <Package className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No orders yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Start shopping to see your order history here.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/products">Browse products</Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {myOrders.map((o) => (
                <li key={o.id} className="rounded-xl border border-border p-4 transition-colors hover:border-foreground/20">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-semibold">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[o.status]}`}>
                      {o.status}
                    </span>
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
                    <span className="font-display text-lg font-semibold tabular-nums">${o.total.toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
