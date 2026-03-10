// src/pages/asl3-testing.tsx — client-side redirect to /scan
// Note: getServerSideProps is incompatible with Next.js static export (output: 'export').
// Client-side redirect is the correct approach for Cloudflare Pages static deployments.
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ASL3TestingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/scan");
  }, []);
  return null;
}
