import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/recently-viewed")({
  component: RecentlyViewedPage,
});

function RecentlyViewedPage() {
  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <h2 className="font-display text-xl font-semibold">Recently Viewed</h2>
      <p className="mt-1 text-sm text-muted-foreground">Products you've recently browsed will appear here.</p>
      <div className="mt-8 rounded-xl border border-dashed border-border py-16 text-center">
        <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">Nothing here yet</p>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/products">Start browsing</Link>
        </Button>
      </div>
    </section>
  );
}
