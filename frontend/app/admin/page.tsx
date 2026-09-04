'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Users, CheckCircle2, Clock, XCircle, DollarSign, Trophy, ArrowRight, ShieldAlert, Sparkles, TrendingUp, RefreshCw, QrCode
} from 'lucide-react';

interface StatsData {
  total_registrations: number;
  verified: number;
  pending: number;
  rejected: number;
  total_revenue_verified: number;
  total_revenue_pending: number;
  total_events_booked: number;
  event_popularity: { event__name: string; event__category: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/admin/stats/');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-gold/40 text-xs font-mono font-bold text-gold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> LIVE REVENUE & REGISTRATION COMMAND
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Executive KPI Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics for Josephite Tech Club • SJIS Tech Carnival 2026.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={loadStats} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Link href="/admin/scanner">
            <Button variant="glow" size="sm" className="font-bold">
              <QrCode className="w-4 h-4 mr-1.5" /> Gate Scanner
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verified Revenue */}
        <Card glow="none" className="p-5 border border-gold/40 bg-surface/90 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gold">Verified Revenue</span>
            <div className="p-2 rounded-xl bg-gold/20 text-gold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-3 text-glow-gold">
            ৳{stats?.total_revenue_verified.toLocaleString() || 0} BDT
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
            ✓ Confirmed bKash/Nagad/Bank
          </span>
        </Card>

        {/* Pending Revenue */}
        <Card glow="none" className="p-5 border border-surface-border bg-surface/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">Pending Verification</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-3">
            ৳{stats?.total_revenue_pending?.toLocaleString() || 0} BDT
          </div>
          <span className="text-[11px] text-amber-400/90 font-semibold block mt-1">
            {stats?.pending || 0} submissions awaiting check
          </span>
        </Card>

        {/* Total Contestants */}
        <Card glow="none" className="p-5 border border-surface-border bg-surface/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">Total Contestants</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-3">
            {stats?.total_registrations || 0}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
            <span className="text-emerald-400 font-bold">{stats?.verified || 0} Verified</span>
            <span>•</span>
            <span className="text-rose-400 font-bold">{stats?.rejected || 0} Rejected</span>
          </div>
        </Card>

        {/* Total Event Bookings */}
        <Card glow="none" className="p-5 border border-surface-border bg-surface/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">Total Arena Entries</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono mt-3">
            {stats?.total_events_booked || 0}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Across 17 Competitions
          </span>
        </Card>
      </div>

      {/* Main Grid: Event Popularity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Competitions Breakdown (2 Cols) */}
        <div className="lg:col-span-2">
          <Card glow="none" className="p-6 border border-surface-border bg-surface/90 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                <h3 className="text-base font-bold text-white">Event Registration Leaderboard</h3>
              </div>
              <span className="text-xs text-slate-400">Top Selected Competitions</span>
            </div>

            <div className="space-y-3 pt-2">
              {stats?.event_popularity && stats.event_popularity.length > 0 ? (
                stats.event_popularity.map((ep, idx) => {
                  const maxCount = stats.event_popularity[0].count || 1;
                  const percent = Math.round((ep.count / maxCount) * 100);

                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="font-mono text-slate-500 text-[10px]">#{idx + 1}</span>
                          {ep.event__name}
                        </span>
                        <span className="font-mono font-bold text-gold">
                          {ep.count} Contestant(s)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No event registrations recorded yet.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Admin Actions (1 Col) */}
        <div className="space-y-4">
          <Card glow="none" className="p-6 border border-surface-border bg-surface/90 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-surface-border pb-3">
              Quick Operations
            </h3>

            <div className="space-y-2.5">
              <Link href="/admin/registrations" className="block">
                <Button variant="secondary" size="sm" className="w-full justify-between text-xs py-2.5">
                  <span>Review Pending Payments</span>
                  <Badge variant="gold" size="sm">{stats?.pending || 0}</Badge>
                </Button>
              </Link>
              <Link href="/admin/scanner" className="block">
                <Button variant="secondary" size="sm" className="w-full justify-between text-xs py-2.5">
                  <span>Open Gate Pass Scanner</span>
                  <QrCode className="w-4 h-4 text-gold" />
                </Button>
              </Link>
              <Link href="/admin/events" className="block">
                <Button variant="secondary" size="sm" className="w-full justify-between text-xs py-2.5">
                  <span>Configure 17 Competitions</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>
              <Link href="/admin/settings" className="block">
                <Button variant="secondary" size="sm" className="w-full justify-between text-xs py-2.5">
                  <span>Carnival Dates & SMS Keys</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
