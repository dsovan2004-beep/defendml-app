// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Public routes — no authentication required
  const publicRoutes = new Set([
    "/",
    "/login",
    "/reset-password",
    "/auth/callback",
  ]);

  // Also allow any route starting with /landing
  const isPublic =
    publicRoutes.has(router.pathname) ||
    router.pathname.startsWith("/landing");

  // If this page is public, render it directly
  if (isPublic) {
    return <Component {...pageProps} />;
  }

  // Otherwise wrap it with RequireAuth
  return (
    <RequireAuth>
      <Component {...pageProps} />
    </RequireAuth>
  );
}
