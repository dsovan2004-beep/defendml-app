// src/components/Navigation.tsx
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
} from "lucide-react";
import { supabase, clearLegacyToken } from "../lib/auth-bridge";

/** Decode mock JWT token to get user info */
function decodeMockToken(token: string): { email: string; role: string; exp: number } | null {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp && decoded.exp < Date.now()) return null; // Token expired
    return decoded;
  } catch {
    return null;
  }
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Read token from storage
    const storedToken =
      (window as any)._defendmlToken || localStorage.getItem("defendml_token");

    setToken(storedToken);

    // Decode user info
    if (storedToken) {
      const mockUser = decodeMockToken(storedToken);
      if (mockUser) setUserRole(mockUser.role);
    }
  }, [router.pathname]);

  const navItems = [
    { name: "Overview", href: "/overview", icon: LayoutDashboard },
    { name: "Security Center", href: "/security", icon: Shield },
    { name: "PII Protection", href: "/pii", icon: Lock },
    { name: "Compliance", href: "/compliance", icon: FileCheck },
    { name: "Health", href: "/health", icon: Activity },
    { name: "Usage", href: "/usage", icon: BarChart3 },
    { name: "Audit", href: "/audit", icon: ScrollText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    // Handle Security Center active state for old routes
    if (href === "/security") {
      return (
        router.pathname === "/security" ||
        router.pathname === "/threats" ||
        router.pathname === "/asl3-status"
      );
    }
    return router.pathname === href;
  };

  /** ✅ Proper Supabase + Legacy Logout */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // sign out session
      clearLegacyToken(); // remove local mirror tokens
      setToken(null);
      setUserRole(null);
      window.location.replace("/login"); // hard redirect to login
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
                ASL-3 Powered
              </span>
            </Link>
          </div>

          {/* Right side (auth + role) */}
          <div className="hidden md:flex items-center gap-3">
            {token && userRole && (
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-200 text-xs font-semibold">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            )}
            {token ? (
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

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        {token && (
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
            {token && (
              <>
                {navItems.map((item) => {
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
              </>
            )}

            {/* Role (mobile) */}
            {token && userRole && (
              <div className="px-3 py-2">
                <span className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-200 text-sm font-semibold">
                  Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </div>
            )}

            {/* Auth (mobile) */}
            {token ? (
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
