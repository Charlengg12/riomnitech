import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — RIO" },
      { name: "description", content: "Complete your RIO order — shipping and payment." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal + shipping;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    setTimeout(() => {
      clear();
      navigate({ to: "/account/orders" });
    }, 1800);
  };

  if (placed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <CheckCircle2 className="h-14 w-14 text-accent" />
        <h1 className="mt-4 font-display text-3xl font-bold">Order placed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Redirecting you to your orders…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-6 rounded-full"><Link to="/products">Shop products</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <h1 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">Checkout</h1>

      <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-lg font-semibold">Contact</h2>
            <div className="mt-4 grid gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required defaultValue={user?.email ?? ""} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required defaultValue={user?.name ?? ""} className="mt-1.5" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-lg font-semibold">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label htmlFor="addr">Street address</Label><Input id="addr" required className="mt-1.5" /></div>
              <div><Label htmlFor="city">City</Label><Input id="city" required className="mt-1.5" /></div>
              <div><Label htmlFor="zip">Postal code</Label><Input id="zip" required className="mt-1.5" /></div>
              <div className="sm:col-span-2"><Label htmlFor="country">Country</Label><Input id="country" required defaultValue="Philippines" className="mt-1.5" /></div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-lg font-semibold">Payment</h2>
            <p className="mt-1 text-xs text-muted-foreground">Demo flow — no real payment is captured.</p>
            <div className="mt-4 grid gap-4">
              <div><Label htmlFor="card">Card number</Label><Input id="card" placeholder="4242 4242 4242 4242" className="mt-1.5" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="exp">Expiry</Label><Input id="exp" placeholder="MM/YY" className="mt-1.5" /></div>
                <div><Label htmlFor="cvc">CVC</Label><Input id="cvc" placeholder="123" className="mt-1.5" /></div>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <ul className="mt-4 divide-y divide-border">
            {items.map(({ product, qty }) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <img src={product.image} alt="" className="h-12 w-12 rounded-md object-cover" />
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {qty}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">${(qty * product.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">${subtotal.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="tabular-nums">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold"><dt>Total</dt><dd className="tabular-nums">${total.toFixed(2)}</dd></div>
          </dl>
          <Button type="submit" size="lg" className="mt-6 w-full rounded-full">
            <Lock className="mr-2 h-4 w-4" /> Place order
          </Button>
        </aside>
      </form>
    </div>
  );
}
