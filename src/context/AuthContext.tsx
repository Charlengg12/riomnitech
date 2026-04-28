import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "user" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
};

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

async function loadUser(session: Session | null): Promise<AuthUser | null> {
  if (!session?.user) return null;
  const u = session.user;

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("name, email, created_at").eq("id", u.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", u.id),
  ]);

  const isAdmin = (roles ?? []).some((r) => r.role === "admin");

  return {
    id: u.id,
    email: profile?.email ?? u.email ?? "",
    name: profile?.name ?? (u.user_metadata?.name as string | undefined) ?? (u.email?.split("@")[0] ?? "User"),
    role: isAdmin ? "admin" : "user",
    createdAt: profile?.created_at ?? u.created_at ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener FIRST, then initial session check
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer Supabase calls so we don't block the auth callback
      setTimeout(() => {
        loadUser(session).then(setUser);
      }, 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      loadUser(data.session).then((u) => {
        setUser(u);
        setLoading(false);
      });
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login: AuthCtx["login"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signup: AuthCtx["signup"] = async (name, email, password) => {
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/account` : undefined;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: redirectTo,
      },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value: AuthCtx = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    signup,
    logout,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
