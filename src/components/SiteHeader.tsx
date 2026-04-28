import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  Search,
  Bell,
  Heart,
  Clock,
  Package,
  Settings as SettingsIcon,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import logo from "@/assets/rio-logo.jpg";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/", label: "Home", exact: true },
  { to: "/services", label: "Services", exact: false },
  { to: "/projects", label: "Projects", exact: false },
  { to: "/products", label: "Products", exact: false },
  { to: "/about", label: "About", exact: false },
] as const;

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/products", search: { q: searchQ, category: "All", inStock: false, maxPrice: 0, sort: "featured" } });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="RIO" className="h-9 w-auto" />
          <span className="hidden font-display text-lg font-bold tracking-tight text-primary sm:inline">
            RIO
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.exact }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications (placeholder) */}
          {isAuthenticated && (
            <button
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => setOpen(true)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                  aria-label="Account menu"
                >
                  <User className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account" className="flex w-full cursor-pointer items-center gap-2">
                    <User className="h-4 w-4" /> Personal Information
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/orders" className="flex w-full cursor-pointer items-center gap-2">
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/saved" className="flex w-full cursor-pointer items-center gap-2">
                    <Heart className="h-4 w-4" /> Saved Products
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/recently-viewed" className="flex w-full cursor-pointer items-center gap-2">
                    <Clock className="h-4 w-4" /> Recently Viewed
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/checkout" className="flex w-full cursor-pointer items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Checkout
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/settings" className="flex w-full cursor-pointer items-center gap-2">
                    <SettingsIcon className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex w-full cursor-pointer items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Admin dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { void logout(); }} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="hidden h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              Sign in
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border bg-background">
          <form onSubmit={submitSearch} className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-3 lg:px-8">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search products, specs, SKU…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-foreground"
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-medium text-primary">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-medium text-foreground">
                  My account
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); void logout(); }}
                  className="py-3 text-left text-sm font-medium text-muted-foreground"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Button asChild className="mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
