'use client';

import React from 'react';
import { Cpu, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLoaderProps {
  variant?: 'fullscreen' | 'overlay' | 'inline' | 'topbar';
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AdminLoader({
  variant = 'fullscreen',
  title = 'JTC EXECUTIVE CONSOLE',
  subtitle = 'Synchronizing secure data stream...',
  className,
}: AdminLoaderProps) {
  if (variant === 'topbar') {
    return (
      <div className="absolute top-0 left-0 right-0 z-50 h-[3px] overflow-hidden bg-surface-border/50">
        <div className="h-full w-full bg-gradient-to-r from-gold/30 via-gold to-amber-400 animate-pulse shadow-[0_0_12px_rgba(245,183,0,0.85)]" />
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'absolute inset-0 z-30 backdrop-blur-md bg-slate-950/70 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200 select-none',
          className
        )}
      >
        <div className="relative flex items-center justify-center mb-3">
          {/* Outer Gold Gyro Ring */}
          <div className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
          {/* Inner Cyan Gyro Ring */}
          <div
            className="absolute w-8 h-8 rounded-full border-2 border-cyan-400/30 border-b-cyan-400 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          />
          {/* Center Pulsing Icon */}
          <div className="absolute flex items-center justify-center text-gold">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        {title && (
          <span className="font-mono text-xs font-black uppercase tracking-widest text-gold text-glow-gold">
            {title}
          </span>
        )}
        {subtitle && (
          <span className="text-[11px] text-slate-300 font-medium mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-3 text-xs text-gold font-mono', className)}>
        <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
          <div className="w-5 h-5 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          <div className="absolute w-2 h-2 rounded-full bg-gold animate-ping" />
        </div>
        <span>{subtitle || title}</span>
      </div>
    );
  }

  // Fullscreen / Modal Screen Loader
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 select-none',
        className
      )}
    >
      {/* Ambient background bloom */}
      <div className="absolute w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none -bottom-10 -right-10" />

      {/* Cybernetic Container Card */}
      <div className="relative z-10 gradient-border-gold shadow-2xl shadow-gold/10 max-w-sm w-full mx-auto">
        <div className="glass-card rounded-[13px] p-8 sm:p-10 flex flex-col items-center text-center space-y-5 bg-surface/95">
          {/* Dual Holographic Gyro Rings */}
          <div className="relative flex items-center justify-center w-20 h-20">
            {/* Outer Golden Ring */}
            <div className="w-20 h-20 rounded-full border-2 border-gold/20 border-t-gold animate-spin [animation-duration:2s]" />
            {/* Middle Teal/Cyan Ring */}
            <div
              className="absolute w-14 h-14 rounded-full border-2 border-cyan-400/30 border-b-cyan-400 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
            />
            {/* Core Golden Emblem */}
            <div className="absolute w-9 h-9 rounded-xl bg-surface-elevated border border-gold/50 flex items-center justify-center text-gold shadow-lg shadow-gold/30">
              <Cpu className="w-5 h-5 animate-pulse text-gold" />
            </div>
            {/* Micro Orbiting Particle */}
            <div className="absolute w-20 h-20 animate-spin [animation-duration:3s]">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#F5B700]" />
            </div>
          </div>

          {/* Text & Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-gold/40 text-[10px] font-mono font-bold text-gold">
              <Sparkles className="w-3 h-3" /> JTC CONTROL SUITE
            </div>
            <h3 className="text-base font-black text-white font-mono tracking-wider">
              {title}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Holographic Progress Track */}
          <div className="w-full max-w-[200px] h-1.5 bg-surface-elevated rounded-full overflow-hidden border border-surface-border p-0.5">
            <div className="h-full bg-gradient-to-r from-gold via-yellow-300 to-amber-500 rounded-full animate-pulse w-full shadow-[0_0_8px_rgba(245,183,0,0.6)]" />
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure Admin Session
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoader;
