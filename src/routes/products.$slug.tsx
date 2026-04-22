import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { products, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Truck, ShieldCheck, RotateCcw, Package } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    const related = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
    return { product, related };
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
  const { product, related } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const lowStock = product.inStock && (product.stockCount ?? 0) > 0 && (product.stockCount ?? 0) <= 10;

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
          {product.sku && (
            <p className="mt-2 text-xs text-muted-foreground">SKU: {product.sku}</p>
          )}
          <p className="mt-4 text-3xl font-semibold">${product.price.toFixed(2)}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span
              className={`inline-flex h-2 w-2 rounded-full ${
                product.inStock ? (lowStock ? "bg-amber-500" : "bg-emerald-500") : "bg-destructive"
              }`}
              aria-hidden
            />
            <span className="font-medium">
              {product.inStock
                ? lowStock
                  ? `Low stock — only ${product.stockCount} left`
                  : `In stock${product.stockCount ? ` (${product.stockCount} available)` : ""}`
                : "Sold out"}
            </span>
          </div>

          <p className="mt-6 text-muted-foreground">{product.description}</p>

          {product.highlights && product.highlights.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-accent" aria-label="Decrease quantity">−</button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 hover:bg-accent" aria-label="Increase quantity">+</button>
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

          <ul className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-8 text-sm">
            <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary" /> Engineer-tested</li>
            <li className="flex items-center gap-2.5"><Truck className="h-4 w-4 text-primary" /> Ships in 48 hours</li>
            <li className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 text-primary" /> 12-month warranty</li>
            <li className="flex items-center gap-2.5"><RotateCcw className="h-4 w-4 text-primary" /> 30-day returns</li>
          </ul>
        </div>
      </div>

      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="mt-20">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Specifications</h2>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <dl className="divide-y divide-border">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                  <dd className="text-sm sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight">You may also like</h2>
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
