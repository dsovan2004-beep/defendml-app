// src/pages/compliance.tsx — permanent redirect to /reports
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ComplianceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/reports");
  }, [router]);
  return null;
}
