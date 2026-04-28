import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Globe, Moon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/account/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-display text-xl font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage notifications, language and appearance.</p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><Bell className="h-4 w-4 text-accent" /> Notifications</h3>
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifs" className="font-normal">Marketing & newsletter emails</Label>
            <Switch id="email-notifs" checked={emailNotifs} onCheckedChange={setEmailNotifs} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="order-updates" className="font-normal">Order status updates</Label>
            <Switch id="order-updates" checked={orderUpdates} onCheckedChange={setOrderUpdates} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><Globe className="h-4 w-4 text-accent" /> Preferences</h3>
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-normal flex items-center gap-2"><Moon className="h-4 w-4" /> Dark mode</Label>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div>
            <Label htmlFor="lang">Language</Label>
            <select id="lang" className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>English</option>
              <option>Tagalog</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><Lock className="h-4 w-4 text-accent" /> Security</h3>
        <p className="mt-1 text-sm text-muted-foreground">Update your password to keep your account secure.</p>
        <Button variant="outline" className="mt-4 rounded-full">Change password</Button>
      </div>
    </section>
  );
}
