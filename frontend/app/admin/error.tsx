'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, RefreshCw, LayoutDashboard, Home } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Suite Exception caught:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-surface border border-surface-border rounded-2xl p-8 shadow-2xl space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Admin View Error</h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            A module failed to render cleanly. You can reload the dataset or return to the overview dashboard.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="glow" size="sm" onClick={() => reset()} className="font-bold">
            <RefreshCw className="w-4 h-4 mr-1.5" /> Retry
          </Button>
          <a href="/admin">
            <Button variant="secondary" size="sm" className="font-bold">
              <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
            </Button>
          </a>
          <a href="/">
            <Button variant="ghost" size="sm" className="font-bold text-slate-400 hover:text-white">
              <Home className="w-4 h-4 mr-1.5" /> Public Site
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
