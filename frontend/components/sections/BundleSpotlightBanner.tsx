'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  Sparkles, CheckCircle2, ArrowRight, Zap, Flame, Cpu, Code2, HelpCircle, Gamepad2, Shield
} from 'lucide-react';

interface BundleSpotlightBannerProps {
  className?: string;
}

const BUNDLE_EVENTS = [
  { name: 'Project Display', fee: 350, icon: Cpu, category: 'Hardware / Showcase' },
  { name: 'IT Quiz', fee: 200, icon: HelpCircle, category: 'General IT' },
  { name: 'Game Development', fee: 300, icon: Gamepad2, category: 'Game Dev' },
  { name: 'Programming Contest', fee: 300, icon: Code2, category: 'Competitive Coding' },
  { name: 'Cybersecurity', fee: 250, icon: Shield, category: 'InfoSec / CTF' },
];

export default function BundleSpotlightBanner({ className = '' }: BundleSpotlightBannerProps) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-slate-950/90 to-surface-elevated p-6 sm:p-8 lg:p-10 shadow-2xl shadow-emerald-500/15 backdrop-blur-xl ${className}`}>
      {/* Decorative Glow Orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Cyber Grid Texture Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966910_1px,transparent_1px),linear-gradient(to_bottom,#05966910_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-40" />

      <div className="relative z-10 space-y-6 sm:space-y-8">
        {/* Top Badges & Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[11px] font-bold text-emerald-300 uppercase tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Featured Value Package
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-extrabold text-amber-300 uppercase tracking-wider font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Save ৳400 (29% Off)
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display tracking-tight">
              5-in-1 Tech Festival Bundle Pass
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Register once — unlock admission across <strong className="text-white">5 premier competitive arenas</strong> with a single VIP festival package!
            </p>
          </div>

          {/* Pricing Box */}
          <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-right shrink-0">
            <div>
              <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-widest block font-mono">
                Exclusive Package
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                  ৳1,000
                </span>
                <span className="text-xs text-slate-300 font-mono font-medium line-through decoration-rose-400/80">
                  Orig: ৳1,400
                </span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-200/80 font-medium mt-0.5">
              All 5 Events Included
            </span>
          </div>
        </div>

        {/* 5 Events Roster Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="uppercase tracking-wider font-bold text-emerald-300">
              Included Arenas (Regular Total: ৳1,400 BDT):
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Individual entry rules & certificates apply
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {BUNDLE_EVENTS.map((ev, i) => {
              const IconComp = ev.icon;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-surface-elevated/80 border border-emerald-500/30 hover:border-emerald-400/60 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 line-through">
                        ৳{ev.fee}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block leading-snug">
                        {ev.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {ev.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-surface-border flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Included in Pass</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Perks Bar + 1-Click Action Button */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface/70 border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-xl shrink-0">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                  Complimentary Bundle Bonus
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[10px] font-bold">
                  Free
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Includes <strong className="text-white">1 free round of FC</strong> in the festival Game Zone! Token issued on festival day.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/register?bundle=1" className="w-full sm:w-auto">
              <Button
                variant="glow"
                size="lg"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Claim 5-in-1 Bundle (৳1,000)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
