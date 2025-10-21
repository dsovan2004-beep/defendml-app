// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

import { supabase, mirrorSessionToLegacy } from "../lib/auth-bridge";
import RequireAuth from "../components/RequireAuth";

const PUBLIC_PATHS = ["/login", "/reset-password", "/auth/callback", "/"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router?.pathname || "";

  useEffect(() => {
    // Mirror Supabase session into legacy token on load
    (async () => {
      const { data } = await supabase.auth.getSession();
      mirrorSessionToLegacy(data.session);
    })();

    // Mirror again whenever auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      mirrorSessionToLegacy(session);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Render public routes (no auth)
  if (PUBLIC_PATHS.some((p) => path === p || path.startsWith(p))) {
    return <Component {...pageProps} />;
  }

  // Protect all other routes
  return (
    <RequireAuth>
      <Component {...pageProps} />
    </RequireAuth>
  );
}
