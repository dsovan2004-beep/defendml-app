// src/components/Navigation.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Menu,
  X,
  Shield,
  Lock,
  FileCheck,
  Activity,
  BarChart3,
  ScrollText,
  LogOut,
  LogIn,
  Settings,
  LayoutDashboard,
  AlertTriangle,
  ShieldCheck,
  Target,
  Beaker,
  FileText,
} from "lucide-react";
import { supabase, clearLegacyToken } from "../lib/auth-bridge";
import { FF_ASL3_STATUS, FF_INCIDENT_CENTER } from "../utils/featureFlags";
import {
  getDemoSession,
  clearDemoSession,
  getEffectiveRole,
} from "../lib/authClient";

/* ---------- helpers ---------- */
function prettyRole(r: string | null | undefined) {
  if (!r) return "Viewer";
  return r
    .split(/[\s_-]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("");
}
function isSuperAdmin(role: string) {
  return role.toLowerCase() === "superadmin";
}
function isAdmin(role: string) {
  return role.toLowerCase() === "admin" || isSuperAdmin(role);
}

/* ---------- component ---------- */
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<string>("viewer");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const demo = getDemoSession();
      if (demo) {
        if (!mounted) return;
        setAuthed(true);
        setRole(demo.role || "superadmin");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session) {
        const userRes = await supabase.auth.getUser();
        const supabaseRole =
          ((userRes.data.user?.user_metadata as any)?.role as string) ||
          "viewer";
        setAuthed(true);
        setRole(getEffectiveRole(supabaseRole));
      } else {
        setAuthed(false);
        setRole("viewer");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router.pathname]);

  /* ---------- NAV (Claude-aligned, routes unchanged) ---------- */
  const navItems = [
    {
      name: "Red Team",
      href: "/overview", // existing overview page
      icon: Target,
    },
    {
      name: "Targets",
      href: "/admin/targets",
      icon: LayoutDashboard,
    },
    {
      name: "Scans",
      href: "/asl3-testing", // route unchanged
      icon: Beaker,
    },
    {
      name: "Reports",
      href: "/compliance", // route unchanged
      icon: FileText,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },

    // Feature-flagged (kept, but hidden behind Reports semantics)
    ...(FF_ASL3_STATUS && (isAdmin(role) || isSuperAdmin(role))
      ? [{ name: "Test Results", href: "/asl3-status", icon: ShieldCheck }]
      : []),
    ...(FF_INCIDENT_CENTER && isSuperAdmin(role)
      ? [{ name: "Incident Center", href: "/incidents", icon: AlertTriangle }]
      : []),
  ];

  const isActive = (href: string) => {
    if (href === "/overview") {
      return (
        router.pathname === "/overview" ||
        router.pathname === "/dashboard"
      );
    }
    if (href === "/compliance") {
      return (
        router.pathname === "/compliance" ||
        router.pathname === "/audit" ||
        router.pathname === "/usage"
      );
    }
    return router.pathname === href;
  };

  const handleLogout = async () => {
    try {
      clearDemoSession();
      clearLegacyToken();
      await supabase.auth.signOut();
      setAuthed(false);
      setRole("viewer");
      window.location.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/overview" className="flex items-center gap-2 group">
              <Shield className="w-8 h-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
              <span className="text-xl font-bold text-white">DefendML</span>
              <span className="hidden sm:inline text-xs text-slate-400 ml-2 px-2 py-1 bg-purple-500/10 rounded border border-purple-500/20">
                Red Team First
              </span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {authed && (
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-200 text-xs font-semibold">
                {prettyRole(role)}
              </span>
            )}
            {authed ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 border border-purple-500/50 rounded-lg text-white transition-all text-sm font-medium shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-all text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        {authed && (
          <div className="hidden md:flex items-center gap-2 pb-3 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive(item.href)
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {authed &&
              navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all ${
                      isActive(item.href)
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}

            {authed && (
              <div className="px-3 py-2">
                <span className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-200 text-sm font-semibold">
                  Role: {prettyRole(role)}
                </span>
              </div>
            )}

            {authed ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-3 bg-purple-600 hover:bg-purple-700 border border-purple-500/50 rounded-lg text-white text-base font-medium transition-all shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-base font-medium transition-all"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
