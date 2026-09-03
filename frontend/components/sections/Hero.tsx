'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Countdown } from '@/components/ui/Countdown';
import ParticleBackground from './ParticleBackground';
import {
  Sparkles, Calendar, MapPin, ArrowRight, Trophy, Zap, ShieldCheck, Flame, Cpu, Users, Award
} from 'lucide-react';
import { SiteSettingsData } from '@/lib/api';

interface HeroProps {
  settings: SiteSettingsData;
}

export default function Hero({ settings }: HeroProps) {
  const targetDate = settings.carnival_start_date
    ? `${settings.carnival_start_date}T09:00:00+06:00`
    : '2026-10-01T09:00:00+06:00';

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gold & Sapphire Starfield */}
      <ParticleBackground />

      {/* Futuristic Royal Navy & Warm Gold Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-gold/20 via-sjis-royal/40 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-sjis-navy/80 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-gold/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10 space-y-9">
        
        {/* Top Floating Prestige Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-elevated/90 border border-gold/40 text-xs font-semibold shadow-xl shadow-gold/10 backdrop-blur-xl animate-fade-in hover:border-gold transition-colors">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-light"></span>
          </span>
          <span className="text-gold-light font-mono font-bold tracking-wider">SJIS TECH CARNIVAL 2026</span>
          <span className="text-slate-500">•</span>
          <span className="text-gold font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-gold animate-bounce" /> Registrations Live
          </span>
        </div>

        {/* Hero Title with Gold & Platinum Typography */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-widest text-slate-300 uppercase">
            <span className="text-gold-light">St. Joseph International School</span>
            <span className="text-gold">✦</span>
            <span className="text-gold">Josephite Tech Club</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-display">
            Excellence. Innovation. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent text-glow-cyan">
              The Golden Era of Tech.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed">
            The flagship national technology carnival featuring <strong className="text-gold-light font-bold">competitive arenas</strong> across AI Prompting, Algorithmic Coding, Autonomous Robotics, Custom Drone Flight, LAN E-Sports, and Creative Media.
          </p>
        </div>

        {/* Interactive Event Key Highlights Grid */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-200">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/90 border border-gold/30 backdrop-blur-md hover:border-gold transition-colors shadow-sm text-gold-light">
            <Calendar className="w-4 h-4 text-gold" />
            <span>Oct 1 – 2, 2026</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/90 border border-gold/30 backdrop-blur-md hover:border-gold transition-colors shadow-sm text-gold-light">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>SJIS Campus, Mohammadpur</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/90 border border-gold/30 backdrop-blur-md hover:border-gold transition-colors shadow-sm text-gold-light">
            <Trophy className="w-4 h-4 text-gold" />
            <span>Official Gold Crests & Medals</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/90 border border-gold/30 backdrop-blur-md hover:border-gold transition-colors shadow-sm text-gold-light">
            <Users className="w-4 h-4 text-sky-300" />
            <span>Open Inter-School & University (Gr 3 – Bachelors)</span>
          </div>
        </div>

        {/* Live Countdown Timer Card */}
        <div className="gradient-border-gold max-w-xl mx-auto shadow-2xl shadow-amber-500/10">
          <div className="glass-card rounded-[13px] p-6 bg-surface-elevated/95 backdrop-blur-xl flex flex-col items-center space-y-3">
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-gold-light flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-gold" /> Carnival Kickoff Countdown
            </span>
            <Countdown targetDate={targetDate} />
          </div>
        </div>

        {/* Main Call-to-Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button variant="glow" size="lg" className="w-full sm:w-auto text-base px-8 py-4">
              Register for Competitions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-8 py-4">
              Explore All Arenas
            </Button>
          </Link>
        </div>

        {/* Stat Highlights Bar in Navy & Gold */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-surface/70 border border-surface-border backdrop-blur-md hover:border-gold/50 transition-colors">
            <div className="text-3xl font-black text-white font-mono flex items-center justify-between">
              19 <Cpu className="w-5 h-5 text-gold opacity-90" />
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Competitions & Arenas</div>
          </div>
          <div className="p-5 rounded-2xl bg-surface/70 border border-surface-border backdrop-blur-md hover:border-gold/50 transition-colors">
            <div className="text-3xl font-black text-gold font-mono flex items-center justify-between">
              5 Groups <Users className="w-5 h-5 text-gold opacity-90" />
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Grade 3 to University</div>
          </div>
          <div className="p-5 rounded-2xl bg-surface/70 border border-surface-border backdrop-blur-md hover:border-gold/50 transition-colors">
            <div className="text-3xl font-black text-amber-300 font-mono flex items-center justify-between">
              ৳200+ <Award className="w-5 h-5 text-amber-300 opacity-90" />
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Affordable Entry Fees</div>
          </div>
          <div className="p-5 rounded-2xl bg-surface/70 border border-surface-border backdrop-blur-md hover:border-gold/50 transition-colors">
            <div className="text-3xl font-black text-emerald-400 font-mono flex items-center justify-between">
              Unified <ShieldCheck className="w-5 h-5 text-emerald-400 opacity-90" />
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Multi-Event Cart & Pass</div>
          </div>
        </div>

      </div>
    </section>
  );
}
