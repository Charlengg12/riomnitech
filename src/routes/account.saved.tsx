import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/saved")({
  component: SavedPage,
});

function SavedPage() {
  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <h2 className="font-display text-xl font-semibold">Saved Products</h2>
      <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any product to save it for later.</p>
      <div className="mt-8 rounded-xl border border-dashed border-border py-16 text-center">
        <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">No saved products yet</p>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    </section>
  );
}
