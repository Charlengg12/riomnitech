import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — RIO` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — RIO` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
          { name: "twitter:image", content: loaderData.product.image },
        ]
      : [],
  }),
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="text-3xl font-semibold">Product not found</h1>
      <Link to="/products" className="mt-4 inline-block text-primary">← Back to shop</Link>
    </div>
  ),
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-secondary">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{product.category}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="mt-6 text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-accent">−</button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 hover:bg-accent">+</button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              disabled={!product.inStock}
              onClick={() => add(product, qty)}
            >
              {product.inStock ? "Add to cart" : "Sold out"}
            </Button>
          </div>

          <ul className="mt-8 space-y-3 border-t border-border pt-8 text-sm">
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Engineer-tested before shipping</li>
            <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary" /> Dispatched within 48 hours</li>
            <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /> 12-month warranty</li>
            <li className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-primary" /> 30-day returns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
