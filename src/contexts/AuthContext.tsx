// src/contexts/AuthContext.tsx
// AuthContext wired to Cloudflare Worker JWT auth (+ RBAC ready)

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import type { User } from "../types/roles"; // <- FIXED: relative import (no "@/")

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (window as any)._defendmlToken || localStorage.getItem("token");
}
function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    (window as any)._defendmlToken = token;
    localStorage.setItem("token", token);
  } else {
    delete (window as any)._defendmlToken;
    localStorage.removeItem("token");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Use your Pages env var if set; otherwise fallback to worker URL
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "https://defendml-api.dsovan2004.workers.dev";

  // Bootstrap: verify existing token -> populate user
  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/verify`, {
          headers: { authorization: `Bearer ${token}` },
          credentials: "omit",
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.ok && data?.user) {
          if (!cancelled) setUser(data.user as User);
        } else {
          setToken(null);
          if (!cancelled) setUser(null);
        }
      } catch {
        setToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  // Login -> /auth/login -> store token+user
  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success || !data?.token) return false;

      setToken(data.token);
      setUser(data.user as User);
      // optional: redirect to last intended page via ?next=
      const url = new URL(window.location.href);
      const next = url.searchParams.get("next") || "/overview";
      router.push(next);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    if (router.pathname !== "/login") router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
