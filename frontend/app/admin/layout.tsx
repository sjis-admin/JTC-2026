'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAdminToken, clearAdminToken, adminFetch, ADMIN_AUTH_PATH, fetchSiteSettings } from '@/lib/api';
import { AdminLoader } from '@/components/ui/AdminLoader';
import {
  LayoutDashboard, Users, CalendarDays, School, Settings, LogOut, Cpu, ArrowLeft, Menu, X, QrCode, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [isPageSwitching, setIsPageSwitching] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>('/images/jtc-logo.png');

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace('/');
      return;
    }

    // Only verify once per session
    if (authorized && user) return;

    adminFetch('/admin/me/')
      .then(async (res) => {
        if (res.ok) {
          const u = await res.json();
          setUser(u);
          setAuthorized(true);
        } else {
          clearAdminToken();
          router.replace('/');
        }
      })
      .catch(() => {
        clearAdminToken();
        router.replace('/');
      });

    // Fetch site settings for branding logo
    fetchSiteSettings()
      .then((settings) => {
        if (settings?.logo_url) {
          setLogoUrl(settings.logo_url);
        }
      })
      .catch(() => {});
  }, [router, authorized, user]);

  // Reset page switching loader when pathname updates
  useEffect(() => {
    setIsPageSwitching(false);
  }, [pathname]);

  // Detect navigation clicks targeting any /admin route
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (
        href &&
        href.startsWith('/admin') &&
        href !== pathname &&
        !anchor.getAttribute('target') &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey
      ) {
        setIsPageSwitching(true);
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [pathname]);

  if (!authorized) {
    return (
      <AdminLoader
        variant="fullscreen"
        title="AUTHENTICATING SESSION"
        subtitle="Verifying executive security clearance..."
      />
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/registrations', label: 'Registrations & Trx', icon: <Users className="w-4 h-4" /> },
    { href: '/admin/events', label: 'Competitions', icon: <CalendarDays className="w-4 h-4" /> },
    { href: '/admin/scanner', label: 'Gate Pass Scanner', icon: <QrCode className="w-4 h-4" /> },
    { href: '/admin/schools', label: 'Institutions', icon: <School className="w-4 h-4" /> },
    { href: '/admin/settings', label: 'Site & SMS Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    clearAdminToken();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-background flex text-slate-200">
      {/* Sidebar for Desktop - Fixed & Never Scrolls With Main Content */}
      <aside className="hidden lg:flex w-64 h-full flex-col bg-surface border-r border-surface-border p-5 shrink-0 justify-between overflow-y-auto select-none">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 pb-2 border-b border-surface-border">
            <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-gold/40 flex items-center justify-center text-gold shadow-md overflow-hidden shrink-0">
              <img src={logoUrl || '/images/jtc-logo.png'} alt="JTC Logo" className="w-full h-full object-cover rounded-[10px]" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-wider font-mono block">
                JTC CONTROL
              </span>
              <span className="text-[10px] text-gold font-bold">Executive Admin Suite</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-gold via-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-gold/20'
                      : 'text-slate-300 hover:text-white hover:bg-surface-elevated'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="pt-4 border-t border-surface-border space-y-3">
          {user && (
            <div className="px-2 py-1.5 rounded-lg bg-surface-elevated border border-surface-border">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-white">{user.username}</span>
              </div>
              <span className="text-[10px] text-gold font-mono uppercase">{user.role || 'Superuser'}</span>
            </div>
          )}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-gold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> View Public Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer font-semibold"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area - Only This Panel Scrolls */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative">
        {/* Sleek Golden Topbar Progress Loader when switching pages */}
        {isPageSwitching && <AdminLoader variant="topbar" />}

        {/* Floating Page Switching Pill */}
        {isPageSwitching && (
          <div className="fixed top-4 right-6 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-elevated/95 border border-gold/50 text-gold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none">
            <div className="relative w-3.5 h-3.5 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
            </div>
            <span className="font-mono text-[11px] font-black tracking-wider text-glow-gold">
              SWITCHING CONSOLE...
            </span>
          </div>
        )}

        {/* Top bar for mobile */}
        <header className="lg:hidden bg-surface border-b border-surface-border p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-gold/40 flex items-center justify-center text-gold overflow-hidden shrink-0">
              <img src={logoUrl || '/images/jtc-logo.png'} alt="JTC Logo" className="w-full h-full object-cover rounded-md" />
            </div>
            <span className="font-mono font-bold text-white text-sm">JTC Control Center</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-surface-elevated border border-gold/40 text-gold"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden bg-surface-elevated/95 backdrop-blur-2xl border-b border-surface-border p-5 space-y-2 shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-surface hover:text-gold"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-400 mt-2 border-t border-surface-border pt-3"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}

        {/* Scrollable Viewport with Motion Page Transition */}
        <main className="flex-1 h-full p-4 sm:p-8 lg:p-10 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
