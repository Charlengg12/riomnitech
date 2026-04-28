import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — RIO" },
      { name: "description", content: "Review your cart and proceed to secure checkout." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">Your Cart</h1>
        <p className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? "item" : "items"}</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-secondary/30 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background">
            <ShoppingBag className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mt-4 text-lg font-medium">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Browse our catalog and add some parts.</p>
          <Button asChild className="mt-6 rounded-full" size="lg">
            <Link to="/products">Shop products</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
            {items.map(({ product, qty }) => (
              <li key={product.id} className="flex gap-5 p-5">
                <Link to="/products/$slug" params={{ slug: product.slug }} className="shrink-0">
                  <img src={product.image} alt={product.name} className="h-28 w-28 rounded-xl object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
                      <Link to="/products/$slug" params={{ slug: product.slug }} className="mt-0.5 block font-display text-base font-semibold hover:text-accent">
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button onClick={() => setQty(product.id, qty - 1)} className="p-2 hover:bg-accent hover:text-accent-foreground rounded-l-full"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-10 text-center text-sm font-semibold tabular-nums">{qty}</span>
                      <button onClick={() => setQty(product.id, qty + 1)} className="p-2 hover:bg-accent hover:text-accent-foreground rounded-r-full"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <p className="font-display text-lg font-semibold tabular-nums">${(qty * product.price).toFixed(2)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-xl font-semibold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold tabular-nums">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-semibold tabular-nums">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-xl font-bold tabular-nums">${total.toFixed(2)}</dd>
              </div>
            </dl>
            <Button asChild size="lg" className="mt-6 w-full rounded-full">
              <Link to="/checkout">Proceed to checkout <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link to="/products">Continue shopping</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
