import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/inquiries")({
  component: InquiriesPage,
});

const samples = [
  { name: "Maria Santos", email: "maria@example.ph", subject: "Bulk pricing for ESP32 boards", time: "2h ago", unread: true },
  { name: "John Cruz", email: "john@school.edu", subject: "Robotics workshop for 30 students", time: "yesterday", unread: true },
  { name: "Lia Reyes", email: "lia@iotlabs.co", subject: "Custom PCB quote", time: "3 days ago", unread: false },
];

function InquiriesPage() {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><MessageSquare className="h-5 w-5" /></div>
        <div>
          <h1 className="font-display text-2xl font-bold">Inquiries</h1>
          <p className="text-sm text-muted-foreground">Customer messages from the contact form.</p>
        </div>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
        {samples.map((m, i) => (
          <li key={i} className="flex flex-wrap items-start justify-between gap-3 p-4 hover:bg-secondary/30">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{m.name}</p>
                {m.unread && <span className="inline-block h-2 w-2 rounded-full bg-accent" />}
              </div>
              <p className="text-xs text-muted-foreground">{m.email}</p>
              <p className="mt-1 line-clamp-1 text-sm">{m.subject}</p>
            </div>
            <span className="text-xs text-muted-foreground">{m.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
