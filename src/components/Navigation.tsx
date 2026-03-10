// src/components/Navigation.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Menu,
  X,
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
      name: "Demo",
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
    <nav className="bg-[#111111] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/overview" className="flex items-center gap-2 group">
              {/* DefendML custom logo mark — shield + crosshair + glow */}
              <svg
                className="w-8 h-8 text-red-500 group-hover:text-red-400 transition-colors"
                style={{
                  filter:
                    'drop-shadow(0 0 3px rgba(220,38,38,0.9)) drop-shadow(0 0 8px rgba(220,38,38,0.45))',
                }}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Angular shield body */}
                <path
                  d="M16 2.5L28.5 7.5V18.5C28.5 25 22.8 29.5 16 31.5C9.2 29.5 3.5 25 3.5 18.5V7.5L16 2.5Z"
                  fill="rgba(220,38,38,0.12)"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                {/* Crosshair horizontal — extends past shield edges */}
                <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.1" />
                {/* Crosshair vertical */}
                <line x1="16" y1="7.5" x2="16" y2="24.5" stroke="currentColor" strokeWidth="1.1" />
                {/* Dashed targeting ring */}
                <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2.5" />
                {/* Ping pulse ring — animates outward and fades */}
                <circle cx="16" cy="16" r="2.2" fill="currentColor" opacity="0.35">
                  <animate attributeName="r" values="2.2;5.5;2.2" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
                </circle>
                {/* Center lock dot — solid, always on top */}
                <circle cx="16" cy="16" r="2.2" fill="currentColor" />
              </svg>
              <span className="text-xl font-bold text-white">DefendML</span>
              <span className="hidden sm:inline text-xs text-[#A0A0A0] ml-2 px-2 py-1 bg-red-500/10 rounded border border-red-500/20">
                Red Team First
              </span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {authed && (
              <span className="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-xs font-semibold">
                {prettyRole(role)}
              </span>
            )}
            {authed ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 border border-red-500/50 rounded-lg text-white transition-all text-sm font-medium shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all text-sm font-medium"
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
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors"
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
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : "text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-white"
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
        <div className="md:hidden border-t border-[#1A1A1A]">
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
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}

            {authed && (
              <div className="px-3 py-2">
                <span className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-sm font-semibold">
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
                className="w-full flex items-center gap-3 px-3 py-3 bg-red-600 hover:bg-red-700 border border-red-500/50 rounded-lg text-white text-base font-medium transition-all shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white text-base font-medium transition-all"
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
