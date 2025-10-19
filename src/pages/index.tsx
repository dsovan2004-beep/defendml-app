import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated (client-side)
    const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='));
    
    if (token) {
      // If logged in, go to dashboard
      router.replace('/overview');
    } else {
      // If not logged in, go to login
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="text-white text-xl">Redirecting...</div>
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
