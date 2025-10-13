import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Menu,
  X,
  Shield,
  AlertTriangle,
  Lock,
  FileCheck,
  Activity,
  BarChart3,
  ScrollText,
  LogOut,
  Users,        // for Admin > Users Upload
  LogIn,        // when logged out
} from "lucide-react";

// Optional import: if your AuthContext is available, we'll use it.
// If not, the component still works by falling back to localStorage.
let useAuth: any;
try {
  // Adjust the path if your context lives somewhere else.
  // This won't crash build if the file doesn't exist; the try/catch guards it.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useAuth = require("../contexts/AuthContext").useAuth;
} catch (e) {
  useAuth = undefined;
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const router = useRouter();

  // Prefer AuthContext if available; otherwise fall back to localStorage
  const auth = typeof useAuth === "function" ? useAuth() : null;

  useEffect(() => {
    if (auth) {
      setToken(auth?.token ?? null);
      setRoles(auth?.user?.roles ?? []);
      return;
    }
    // Fallback: decode a very small bit of info we store in localStorage
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(t);

    // If you store the user in localStorage (optional), read roles from there.
    // Otherwise roles remain [] and admin-only links will be hidden.
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const parsed = raw ? JSON.parse(raw) : null;
      setRoles(Array.isArray(parsed?.roles) ? parsed.roles : []);
    } catch {
      setRoles([]);
    }
  }, [auth]);

  const navItems = [
    { name: "Overview", href: "/overview", icon: Shield },
    { name: "Threats", href: "/threats", icon: AlertTriangle },
    { name: "PII Protection", href: "/pii", icon: Lock },
    { name: "Compliance", href: "/compliance", icon: FileCheck },
    { name: "Health", href: "/health", icon: Activity },
    { name: "Usage", href: "/usage", icon: BarChart3 },
    { name: "Audit", href: "/audit", icon: ScrollText },
  ];

  // Admin-only items
  const adminItems = [
    { name: "Users Upload", href: "/admin/users", icon: Users },
  ];

  const isActive = (href: string) => router.pathname === href;

  const doLogout = () => {
    // Prefer AuthContext's logout if present
    if (auth?.logout) {
      auth.logout();
    } else {
      // Fallback: clear local storage token/user
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setToken(null);
    setRoles([]);
    router.push("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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

              {/* Admin-only links */}
              {roles.includes("admin") &&
                adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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

            {/* Auth button (Desktop) */}
            {token ? (
              <button
                onClick={doLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-300 hover:text-red-200 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/30 hover:bg-slate-700/40 border border-slate-600/40 rounded-lg text-slate-200 transition-all text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
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

            {/* Admin-only (mobile) */}
            {roles.includes("admin") &&
              adminItems.map((item) => {
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

            {/* Auth button (Mobile) */}
            {token ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  doLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-base font-medium transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-3 bg-slate-700/30 hover:bg-slate-700/40 border border-slate-600/40 rounded-lg text-slate-200 text-base font-medium transition-all"
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
