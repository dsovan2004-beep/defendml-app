import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Client-side redirect as fallback
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="text-white text-xl">Redirecting to login...</div>
    </div>
  );
}

// Server-side redirect (faster, preferred)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies.auth_token;

  // If authenticated, go to dashboard
  if (token) {
    return {
      redirect: {
        destination: '/overview',
        permanent: false,
      },
    };
  }

  // If not authenticated, go to login
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};
