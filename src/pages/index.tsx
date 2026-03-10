// src/pages/index.tsx — DefendML landing page
// Authenticated users are redirected to /overview on mount.
// Unauthenticated visitors see the full marketing landing page.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';
import LandingNavbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import StatsBar from '../components/landing/StatsBar';
import SocialProof from '../components/landing/SocialProof';
import ProductSection from '../components/landing/ProductSection';
import HowItWorks from '../components/landing/HowItWorks';
import Evidence from '../components/landing/Evidence';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import LandingFooter from '../components/landing/Footer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function LandingPage() {
  const router = useRouter();
  // Three states: 'checking' | 'authed' | 'anon'
  const [authState, setAuthState] = useState<'checking' | 'authed' | 'anon'>('checking');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Authenticated — send to dashboard, no landing page flash
        router.replace('/overview');
        setAuthState('authed');
      } else {
        setAuthState('anon');
      }
    });
  }, []);

  // Show minimal dark screen while auth check runs (prevents landing page flash for logged-in users)
  if (authState === 'checking' || authState === 'authed') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  // Unauthenticated visitor — full landing page
  return (
    <>
      <Head>
        <title>DefendML — Offensive AI Red Team Testing Service</title>
        <meta
          name="description"
          content="Attack your AI with 295 real attack scenarios across 6 security frameworks. Audit-grade evidence in 24 hours. $2,500 Pilot. The only offensive AI red team testing service."
        />
        <meta property="og:title" content="DefendML — Attack Before They Do" />
        <meta
          property="og:description"
          content="295 offensive AI attack scenarios. 6 frameworks. $2,500 Pilot. Audit-grade evidence in 24 hours."
        />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          html { scroll-behavior: smooth; }
          .scroll-mt-16 { scroll-margin-top: 4rem; }
        `}</style>
      </Head>

      <div className="bg-[#0A0A0A] min-h-screen">
        <LandingNavbar />
        <main>
          <Hero />
          <StatsBar />
          <SocialProof />
          <ProductSection />
          <HowItWorks />
          <Evidence />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
        <LandingFooter />
      </div>
    </>
  );
}
