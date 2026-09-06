'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function MobileStickyBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide on register, verify, and admin pages
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/verify')
  ) {
    return null;
  }

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="gradient-border shadow-2xl shadow-cyan-500/20">
        <div className="glass-card rounded-[11px] p-3 flex items-center justify-between bg-surface-elevated/95 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-jtc-teal/20 border border-jtc-teal/40 flex items-center justify-center text-jtc-cyan">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Tech Carnival 2026</span>
              <span className="text-[10px] text-jtc-teal font-mono">17 Events • ৳200 onwards</span>
            </div>
          </div>

          <Link href="/register">
            <Button variant="glow" size="sm" className="text-xs font-bold py-1.5 px-3.5">
              Register <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
