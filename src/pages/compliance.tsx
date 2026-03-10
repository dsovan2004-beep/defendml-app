// src/pages/compliance.tsx — server-side permanent redirect to /reports
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/reports",
      permanent: true,
    },
  };
};

export default function ComplianceRedirect() {
  return null;
}
