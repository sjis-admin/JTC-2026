import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Home, Compass, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <Card glow="gold" className="max-w-md w-full p-8 text-center space-y-6 border border-surface-border bg-surface/80 backdrop-blur-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
          <AlertCircle className="w-8 h-8 text-gold animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold">Error 404</span>
          <CardTitle className="text-2xl sm:text-3xl font-black text-white font-display">
            Page Not Found
          </CardTitle>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The page you are looking for does not exist, has been removed, or is currently unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="glow" size="md" className="w-full justify-center gap-2 font-bold text-xs">
              <Home className="w-4 h-4" /> Return to Home
            </Button>
          </Link>
          <Link href="/events" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full justify-center gap-2 text-xs">
              <Compass className="w-4 h-4" /> Competitions
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
