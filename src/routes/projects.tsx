import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — RIO Robotics & Innovation" },
      { name: "description", content: "Showcase of robotics, IoT and embedded projects engineered by RIO and partners." },
      { property: "og:title", content: "Projects — RIO Robotics & Innovation" },
      { property: "og:description", content: "Explore robotics, IoT and web development projects we've completed." },
    ],
  }),
  component: ProjectsPage,
});

const projects = [
  {
    tag: "Robotics",
    title: "6-DOF Pick-and-Place Cell",
    body: "Vision-guided arm sorting electronic components for a small-batch assembly line.",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=900&q=80",
  },
  {
    tag: "IoT",
    title: "Greenhouse Monitoring Network",
    body: "200 LoRaWAN nodes streaming soil moisture and microclimate to a real-time dashboard.",
    image: "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?w=900&q=80",
  },
  {
    tag: "Education",
    title: "STEM Robotics Curriculum",
    body: "Modular Arduino-based curriculum used by 12 schools across Nueva Ecija.",
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=900&q=80",
  },
  {
    tag: "Embedded",
    title: "Industrial Vibration Monitor",
    body: "ESP32-S3 + 9-DOF IMU edge node with FFT analysis and alert thresholds.",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=900&q=80",
  },
  {
    tag: "Web",
    title: "Fleet Telemetry Dashboard",
    body: "Real-time map and analytics for a delivery rover fleet.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80",
  },
  {
    tag: "Robotics",
    title: "Autonomous 4WD Rover",
    body: "Outdoor rover with LiDAR SLAM, route planning and a teleoperation web client.",
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=900&q=80",
  },
];

function ProjectsPage() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-background">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Work</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            OUR <span className="text-accent">PROJECTS</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Explore some of the innovative electronics, IoT, and web development projects we've completed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article
              key={p.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  {p.tag}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
                <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-accent">
                  Learn more <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center text-center">
          <h2 className="font-display text-2xl font-bold">Want your project featured?</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Built something cool with RIO parts? We'd love to showcase it.
          </p>
          <Button asChild className="mt-5 rounded-full" size="lg">
            <Link to="/contact">Submit your project</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
