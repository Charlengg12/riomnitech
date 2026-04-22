import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Boxes, Receipt, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — RIO" },
      { name: "description", content: "RIO admin dashboard — manage products, fulfill orders, and monitor store traffic." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { property: "og:title", content: "Admin dashboard — RIO" },
      { property: "og:description", content: "Internal RIO admin tools for catalog and order management." },
    ],
  }),
  component: AdminLayout,
});

const tabs = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Boxes, exact: false },
  { to: "/admin/orders", label: "Orders", icon: Receipt, exact: false },
] as const;

function AdminLayout() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/admin" } });
    } else if (!isAdmin) {
      navigate({ to: "/account" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to site
          </Link>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage products, orders, and store traffic.</p>
        </div>
      </div>

      <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            activeOptions={{ exact: t.exact }}
            className="inline-flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "border-foreground text-foreground" }}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
