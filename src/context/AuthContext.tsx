import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "user" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
};

type StoredUser = AuthUser & { password: string };

type AuthCtx = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const USERS_KEY = "rio.users";
const SESSION_KEY = "rio.session";

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as StoredUser[];
  } catch {
    /* ignore */
  }
  // seed with a demo admin so the user can immediately access the admin page
  const seed: StoredUser[] = [
    {
      id: "admin-seed",
      email: "admin@rio.dev",
      name: "RIO Admin",
      role: "admin",
      password: "admin123",
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  return seed;
}

function writeUsers(u: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

function stripPassword({ password: _p, ...rest }: StoredUser): AuthUser {
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    readUsers(); // ensure seed
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  };

  const login: AuthCtx["login"] = async (email, password) => {
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    persist(stripPassword(found));
  };

  const signup: AuthCtx["signup"] = async (name, email, password) => {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with that email already exists");
    }
    const next: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      role: "user",
      password,
      createdAt: new Date().toISOString(),
    };
    writeUsers([...users, next]);
    persist(stripPassword(next));
  };

  const logout = () => persist(null);

  const value: AuthCtx = {
    user,
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
