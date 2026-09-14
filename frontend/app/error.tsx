'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Client Exception caught by Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-surface border border-surface-border rounded-2xl p-8 shadow-2xl space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            An unexpected error occurred while loading this view. You can reload the page or return to the main carnival portal.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="glow" size="sm" onClick={() => reset()} className="font-bold">
            <RefreshCw className="w-4 h-4 mr-1.5" /> Try Again
          </Button>
          <a href="/">
            <Button variant="secondary" size="sm" className="font-bold">
              <Home className="w-4 h-4 mr-1.5" /> Back to Home
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
