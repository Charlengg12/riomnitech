import { Link } from "@tanstack/react-router";
import logo from "@/assets/rio-logo.jpg";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <img src={logo} alt="RIO" className="h-10 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Robotics & Innovation Omnitech — engineering-grade components, kits and tools for makers, researchers and industry.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-foreground">All products</Link></li>
            <li><Link to="/products" className="hover:text-foreground">Microcontrollers</Link></li>
            <li><Link to="/products" className="hover:text-foreground">Robotics kits</Link></li>
            <li><Link to="/products" className="hover:text-foreground">Sensors</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center lg:px-8">
          <p>© {new Date().getFullYear()} RIO — Robotics & Innovation Omnitech. All rights reserved.</p>
          <p>Engineered with precision.</p>
        </div>
      </div>
    </footer>
  );
}
