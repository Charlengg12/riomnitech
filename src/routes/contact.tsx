import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — RIO" },
      { name: "description", content: "Talk to a RIO engineer. Pre-sales, custom builds, partnerships." },
      { property: "og:title", content: "Contact — RIO" },
      { property: "og:description", content: "Talk to a RIO engineer." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Contact</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Let's build something.</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Pre-sales questions, custom orders, partnerships — our engineers reply within one business day.
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="grid gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" required /></div>
              <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
            </div>
            <div className="grid gap-2"><Label htmlFor="subject">Subject</Label><Input id="subject" required /></div>
            <div className="grid gap-2"><Label htmlFor="message">Message</Label><Textarea id="message" rows={6} required /></div>
            <div className="flex items-center gap-4">
              <Button type="submit" size="lg">Send message</Button>
              {sent && <span className="text-sm text-primary">Thanks — we'll be in touch.</span>}
            </div>
          </form>
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-secondary/40 p-6">
            <h3 className="font-display text-lg font-semibold">Reach us directly</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-primary" /><span>hello@rio-omnitech.com</span></li>
              <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-primary" /><span>+1 (555) 010-2024</span></li>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span>RIO Lab, Innovation District</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
