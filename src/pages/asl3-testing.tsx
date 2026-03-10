// src/pages/asl3-testing.tsx — server-side permanent redirect to /scan
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/scan",
      permanent: true,
    },
  };
};

export default function ASL3TestingRedirect() {
  return null;
}
