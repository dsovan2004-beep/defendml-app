// src/pages/compliance.tsx — client-side redirect to /reports
// Note: getServerSideProps is incompatible with Next.js static export (output: 'export').
// Client-side redirect is the correct approach for Cloudflare Pages static deployments.
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ComplianceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/reports");
  }, []);
  return null;
}
