import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/rio-logo.jpg";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      {/* Newsletter strip */}
      <div className="border-b border-primary-foreground/10">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <h3 className="font-display text-2xl font-bold">Stay in the loop</h3>
            <p className="mt-1 text-sm text-primary-foreground/70">
              New parts, project drops, and engineering tips — straight to your inbox.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2 md:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-5 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Button type="submit" className="rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90">
              {subscribed ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="RIO" className="h-10 w-auto rounded-md bg-white p-1" />
            <span className="font-display text-xl font-bold">RIO</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/70">
            Robotics & Innovation Omnitech — engineering-grade components, kits and tools for makers, researchers and industry.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-primary-foreground/70">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-accent" /> Cabanatuan City, Nueva Ecija</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-accent" /> hello@rio.tech</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-accent" /> +63 (44) 000-0000</li>
          </ul>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                aria-label="Social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/products" className="hover:text-accent">All products</Link></li>
            <li><Link to="/products" className="hover:text-accent">Microcontrollers</Link></li>
            <li><Link to="/products" className="hover:text-accent">Robotics kits</Link></li>
            <li><Link to="/products" className="hover:text-accent">Sensors</Link></li>
            <li><Link to="/products" className="hover:text-accent">Tools</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/about" className="hover:text-accent">About us</Link></li>
            <li><Link to="/services" className="hover:text-accent">Services</Link></li>
            <li><Link to="/projects" className="hover:text-accent">Projects</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Account</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/login" className="hover:text-accent">Sign in</Link></li>
            <li><Link to="/signup" className="hover:text-accent">Create account</Link></li>
            <li><Link to="/account/orders" className="hover:text-accent">My orders</Link></li>
            <li><Link to="/cart" className="hover:text-accent">Cart</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center lg:px-8">
          <p>© {new Date().getFullYear()} RIO — Robotics & Innovation Omnitech. All rights reserved.</p>
          <p>Engineered with precision.</p>
        </div>
      </div>
    </footer>
  );
}
