// src/pages/asl3-testing.tsx — permanent redirect to /scan
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ASL3TestingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/scan");
  }, [router]);
  return null;
}
