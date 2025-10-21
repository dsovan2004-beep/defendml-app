import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/globals.css";
import {
  supabase,
  mirrorSessionToLegacy,
} from "@/lib/auth-bridge";
import RequireAuth from "@/components/RequireAuth";
import { useRouter } from "next/router";

const PUBLIC_PATHS = ["/login", "/reset-password", "/auth/callback", "/"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router?.pathname || "";

  useEffect(() => {
    // On load, mirror current session -> legacy token
    (async () => {
      const { data } = await supabase.auth.getSession();
      mirrorSessionToLegacy(data.session);
    })();

    // On any auth change, mirror again
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      mirrorSessionToLegacy(session);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Public routes render raw
  if (PUBLIC_PATHS.some((p) => path === p || path.startsWith(p))) {
    return <Component {...pageProps} />;
  }

  // Everything else is protected
  return (
    <RequireAuth>
      <Component {...pageProps} />
    </RequireAuth>
  );
}
