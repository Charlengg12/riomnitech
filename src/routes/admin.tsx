import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Boxes,
  Receipt,
  Tags,
  Users,
  Ticket,
  Megaphone,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — RIO" },
      { name: "description", content: "RIO admin dashboard — manage products, fulfill orders, and monitor store traffic." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: AdminLayout,
});

const sections = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/products", label: "Products", icon: Boxes, exact: false },
      { to: "/admin/categories", label: "Categories", icon: Tags, exact: false },
    ],
  },
  {
    label: "Sales",
    items: [
      { to: "/admin/orders", label: "Orders", icon: Receipt, exact: false },
      { to: "/admin/customers", label: "Customers", icon: Users, exact: false },
      { to: "/admin/coupons", label: "Coupons", icon: Ticket, exact: false },
      { to: "/admin/promotions", label: "Promotions", icon: Megaphone, exact: false },
    ],
  },
  {
    label: "Support",
    items: [
      { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare, exact: false },
    ],
  },
] as const;

function AdminLayout() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) navigate({ to: "/login", search: { redirect: "/admin" } });
    else if (!isAdmin) navigate({ to: "/account" });
  }, [isAuthenticated, isAdmin, loading, navigate]);

  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto flex max-w-[1600px] gap-8 px-5 py-8 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> Back to site
            </Link>
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-primary">Dashboard</h1>
            </div>

            <nav className="mt-6 space-y-6 rounded-2xl border border-border bg-background p-3 shadow-[var(--shadow-soft)]">
              {sections.map((sec) => (
                <div key={sec.label}>
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{sec.label}</p>
                  <ul className="mt-1 space-y-0.5">
                    {sec.items.map((it) => (
                      <li key={it.to}>
                        <Link
                          to={it.to}
                          activeOptions={{ exact: it.exact }}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" }}
                        >
                          <it.icon className="h-4 w-4" /> {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Mobile tab strip */}
          <nav className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-border bg-background p-2 shadow-[var(--shadow-soft)] lg:hidden">
            {sections.flatMap((s) => s.items).map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: t.exact }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-primary text-primary-foreground" }}
              >
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </Link>
            ))}
          </nav>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
