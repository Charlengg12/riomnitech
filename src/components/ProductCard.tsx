import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group flex flex-col">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden rounded-xl bg-secondary"
      >
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
            Sold out
          </span>
        )}
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <Link to="/products/$slug" params={{ slug: product.slug }} className="mt-1">
          <h3 className="text-base font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-base font-semibold">${product.price.toFixed(2)}</p>
          <Button
            size="sm"
            variant="outline"
            disabled={!product.inStock}
            onClick={() => add(product)}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
