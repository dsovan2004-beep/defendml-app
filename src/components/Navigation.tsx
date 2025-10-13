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
  Users,
  LogIn,
} from "lucide-react";

/** Decode mock JWT token to get user info */
function decodeMockToken(token: string): { email: string; role: string; exp: number } | null {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp && decoded.exp < Date.now()) {
      return null; // Token expired
    }
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
      (window as any)._defendmlToken || 
      localStorage.getItem("defendml_token");
    
    setToken(storedToken);

    // Try to decode mock token to get role
    if (storedToken) {
      const mockUser = decodeMockToken(storedToken);
      if (mockUser) {
        setUserRole(mockUser.role);
      }
    }
  }, [router.pathname]); // Re-check on route change

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
    // Clear token from both locations
    if (typeof window !== "undefined") {
      localStorage.removeItem("defendml_token");
      delete (window as any)._defendmlToken;
    }
    setToken(null);
    setUserRole(null);
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
            {token && (
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
                {userRole === "admin" &&
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
            )}

            {/* Auth button (Desktop) */}
            {token ? (
              <div className="flex items-center gap-3">
                {/* User role badge */}
                {userRole && (
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-200 text-xs font-semibold">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                )}
                <button
                  onClick={doLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 border border-purple-500/50 rounded-lg text-white transition-all text-sm font-medium shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
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

                {/* Admin-only (mobile) */}
                {userRole === "admin" &&
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
              </>
            )}

            {/* User role badge (mobile) */}
            {token && userRole && (
              <div className="px-3 py-2">
                <span className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-200 text-sm font-semibold">
                  Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </div>
            )}

            {/* Auth button (Mobile) */}
            {token ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  doLogout();
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
