// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

import {
  supabase,
  mirrorSessionToLegacy,
  clearLegacyToken,
} from "../lib/auth-bridge";
import RequireAuth from "../components/RequireAuth";

const PUBLIC_PATHS = ["/login", "/reset-password", "/auth/callback", "/"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router?.pathname || "";

  useEffect(() => {
    // On first load, mirror the Supabase session into local storage token
    (async () => {
      const { data } = await supabase.auth.getSession();
      mirrorSessionToLegacy(data.session);
    })();

    // Listen for any sign-in / sign-out changes
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          clearLegacyToken();
        } else {
          mirrorSessionToLegacy(session);
        }
      }
    );

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Allow public routes (login, password reset, callback)
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
