// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Shield, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright & Links */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
            <span className="text-slate-400">© 2025 DefendML</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-slate-600">•</span>
              <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-slate-600">•</span>
              <Link href="/docs" className="text-slate-400 hover:text-white transition-colors">
                API Docs
              </Link>
              <span className="text-slate-600">•</span>
              <a 
                href="https://status.defendml.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Status
              </a>
            </div>
          </div>

          {/* Right: Certifications */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="w-4 h-4 text-green-400" />
              <span>SOC 2 Certified</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Powered by Anthropic ASL-3</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
