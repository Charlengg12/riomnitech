import { createFileRoute } from "@tanstack/react-router";
import { Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/account/")({
  component: PersonalInfoPage,
});

function PersonalInfoPage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <h2 className="font-display text-xl font-semibold">Personal Information</h2>
      <p className="mt-1 text-sm text-muted-foreground">Update your name and contact details.</p>

      <form className="mt-6 grid max-w-xl gap-5">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" defaultValue={user.name} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" defaultValue={user.email} disabled className="pl-9" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-accent" /> {user.role === "admin" ? "Administrator" : "Customer"}
          </p>
        </div>
        <div>
          <Button type="button" className="rounded-full">Save changes</Button>
        </div>
      </form>
    </section>
  );
}
