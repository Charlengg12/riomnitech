import { useState } from "react";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton({ label = "Continue with Google" }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onClick = async () => {
    setError("");
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/account`,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed");
      setLoading(false);
      return;
    }
    // If redirected, browser is leaving the page. Otherwise session was set.
    if (!result.redirected) {
      window.location.href = "/account";
    }
  };

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" className="w-full" onClick={onClick} disabled={loading}>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"/>
        </svg>
        {loading ? "Redirecting…" : label}
      </Button>
      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
