import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { User, Package, Heart, Clock, Settings as SettingsIcon, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — RIO" },
      { name: "description", content: "Your RIO account — view orders, manage your profile, and track shipping." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountLayout,
});

const tabs = [
  { to: "/account", label: "Personal Info", icon: User, exact: true },
  { to: "/account/orders", label: "My Orders", icon: Package, exact: false },
  { to: "/account/saved", label: "Saved Products", icon: Heart, exact: false },
  { to: "/account/recently-viewed", label: "Recently Viewed", icon: Clock, exact: false },
  { to: "/account/settings", label: "Settings", icon: SettingsIcon, exact: false },
] as const;

function AccountLayout() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: location.pathname } });
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Account</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Hi, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-muted-foreground">Manage your orders, profile, and preferences.</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-background p-3 shadow-[var(--shadow-soft)]">
          <nav className="flex flex-col">
            {tabs.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: t.exact }}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" }}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </Link>
            ))}
            <button
              onClick={() => { void logout(); navigate({ to: "/" }); }}
              className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
