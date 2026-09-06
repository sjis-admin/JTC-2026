'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  Menu, X, Cpu, Search, Sparkles, ArrowRight, BookOpen, ShieldCheck, Home, Trophy, Users, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchSiteSettings } from '@/lib/api';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data?.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home', mobileLabel: 'Home', icon: <Home className="w-4 h-4 text-gold" /> },
    { href: '/events', label: 'Competitions', mobileLabel: 'Competitions', icon: <Trophy className="w-4 h-4 text-gold" /> },
    { href: '/rulebook', label: 'Rulebook', mobileLabel: 'Official Rulebook', icon: <BookOpen className="w-4 h-4 text-gold" /> },
    { href: '/#groups', label: 'Eligibility', mobileLabel: 'Grade Eligibility (A–E)', icon: <Users className="w-4 h-4 text-gold" /> },
    { href: '/#rules', label: 'Guidelines', mobileLabel: 'Guidelines & Rules', icon: <FileText className="w-4 h-4 text-gold" /> },
    { href: '/verify', label: 'Verify Pass', mobileLabel: 'Verify Pass', icon: <Search className="w-4 h-4 text-gold" /> },
  ];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || mobileMenuOpen
            ? 'bg-[#020B1E] border-b border-surface-border py-2.5 shadow-2xl shadow-black/90'
            : 'bg-[#020B1E]/75 backdrop-blur-md py-3 sm:py-4 border-b border-surface-border/40'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sjis-royal via-surface-elevated to-gold p-0.5 shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-all">
              <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center border border-gold/40 overflow-hidden relative">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="JTC Logo"
                    className="w-full h-full object-contain p-1 rounded-[9px]"
                  />
                ) : (
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-gold group-hover:rotate-12 transition-transform" />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-wider text-white font-mono group-hover:text-gold-light transition-colors">
                  JTC
                </span>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.2 rounded bg-gold/20 text-gold font-black border border-gold/40 font-mono">
                  2026
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium -mt-1 truncate max-w-[150px] sm:max-w-none">
                St. Joseph International School
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (>= lg screens) - Always on single line with clean whitespace-nowrap */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#061533]/90 px-3 py-1.5 rounded-full border border-surface-border backdrop-blur-xl shadow-lg shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-xs xl:text-sm font-bold px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap inline-flex items-center justify-center',
                    isActive
                      ? 'text-slate-950 bg-gradient-to-r from-gold via-yellow-400 to-amber-400 shadow-md shadow-gold/20 font-black'
                      : 'text-slate-300 hover:text-gold hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA Actions (Desktop) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Link href="/verify">
              <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-gold whitespace-nowrap px-3 py-2 inline-flex items-center">
                <Search className="w-3.5 h-3.5 mr-1.5 text-gold shrink-0" />
                <span>Find Pass</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="glow" size="sm" className="font-extrabold tracking-wide px-4.5 py-2 text-xs sm:text-sm whitespace-nowrap inline-flex items-center">
                <span>Register Now</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Action Group (< lg screens) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <Link href="/register" className="sm:hidden">
              <Button variant="glow" size="sm" className="text-xs py-1.5 px-3 font-extrabold whitespace-nowrap">
                Register
              </Button>
            </Link>

            {/* Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl bg-surface-elevated border border-gold/40 text-gold hover:text-white hover:border-gold flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-gold-light" /> : <Menu className="w-5 h-5 text-gold" />}
            </button>
          </div>
        </div>
      </header>

      {/* 100% Solid Opaque Mobile Drawer (No bleed-through) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] h-[calc(100dvh-60px)] bg-[#020B1E] border-b border-surface-border p-5 overflow-y-auto z-[9999] animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col justify-between space-y-6 shadow-2xl">
          <div className="space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold px-2 pb-2 border-b border-surface-border/80 flex items-center justify-between">
              <span>Festival Menu</span>
              <span className="text-slate-400 font-normal">SJIS Tech Carnival</span>
            </div>

            <div className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all',
                      isActive
                        ? 'bg-gold/20 text-gold-light border border-gold/50 shadow-md'
                        : 'bg-surface/90 text-slate-100 hover:bg-surface-elevated hover:text-gold border border-surface-border'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <span>{link.mobileLabel}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gold/70" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-surface-border/80 space-y-3 pb-8">
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <Button variant="glow" size="lg" className="w-full justify-center font-black py-3.5 text-sm shadow-xl shadow-gold/20">
                Register For Competitions <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/verify" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="secondary" size="sm" className="w-full justify-center py-2.5 text-xs bg-surface border-surface-border text-slate-200">
                  <Search className="w-3.5 h-3.5 mr-1 text-gold" /> Verify Pass
                </Button>
              </Link>
              <Link href="/rulebook" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="secondary" size="sm" className="w-full justify-center py-2.5 text-xs bg-surface border-surface-border text-slate-300">
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-gold" /> Rulebook
                </Button>
              </Link>
            </div>

            <div className="text-center pt-2 text-[10px] text-slate-500 font-mono">
              Josephite Tech Club • domain: jtc.sjis.edu.bd
            </div>
          </div>
        </div>
      )}
    </>
  );
}
