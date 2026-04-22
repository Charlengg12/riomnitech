import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — RIO" },
      { name: "description", content: "RIO — Robotics & Innovation Omnitech. We engineer the components powering tomorrow's machines." },
      { property: "og:title", content: "About — RIO" },
      { property: "og:description", content: "Meet the team behind RIO — Robotics & Innovation Omnitech." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">About RIO</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        We engineer what makers <span className="text-primary">build with.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Robotics & Innovation Omnitech is a team of engineers, makers and researchers obsessed with quality components and elegant design. We curate, source and test every product we ship.
      </p>

      <div className="mt-16 grid gap-10 sm:grid-cols-3">
        {[
          { k: "Mission", v: "Make professional-grade robotics accessible to anyone with an idea." },
          { k: "Approach", v: "Tested hardware. Honest specs. Real engineering support." },
          { k: "Promise", v: "If it ships under the RIO name, our team would use it themselves." },
        ].map((b) => (
          <div key={b.k}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{b.k}</p>
            <p className="mt-2 text-base text-foreground">{b.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 rounded-2xl bg-secondary/60 p-8 sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight">From workshop to industry</h2>
        <p className="mt-4 text-muted-foreground">
          Whether you're prototyping in a garage or scaling a fleet of autonomous systems, RIO is the partner that grows with you. Our catalog spans hobbyist favorites to industrial-grade modules — backed by the same engineering team.
        </p>
      </div>
    </div>
  );
}
