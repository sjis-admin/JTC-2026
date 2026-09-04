import React from 'react';
import { fetchEvents } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookOpen, Sparkles, MapPin, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import RulebookViewer from '@/components/rulebook/RulebookViewer';

import type { Metadata } from 'next';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Official Rulebook & Compendium — SJIS Tech Carnival 2026',
  description:
    'Download and explore the official festival rulebook, contest guidelines, submission formats, and eligibility rules for all 19 competitions at SJIS Inter-School Tech Carnival 2026.',
  keywords: [
    'SJIS Rulebook 2026',
    'Tech Carnival Rules Bangladesh',
    'Coding Marathon BDRO',
    'Drone Competition Guidelines',
    '4x4 Rubiks Cube Rules SJIS',
    'AI Prompting Rules',
    'Valorant Rulebook School Fest',
  ],
  alternates: {
    canonical: 'https://jtc.sjis.edu.bd/rulebook',
  },
  openGraph: {
    title: 'Official Rulebook & Compendium — SJIS Tech Carnival 2026',
    description: 'Official rules, contest guidelines, and eligibility criteria for all 19 competitions.',
    url: 'https://jtc.sjis.edu.bd/rulebook',
  },
};

export default async function RulebookPage() {
  const events = await fetchEvents();

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-gold/40 text-xs font-semibold text-gold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> The Holy Grail of Rules & Guidelines
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Official Carnival Rulebook
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
            The definitive compendium containing segment guidelines, submission specifications,
            and academic eligibility for Josephite Tech Club Inter-School Tech Carnival 2026.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/register">
            <Button variant="glow" size="sm" className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Register Online</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Document Header Box */}
      <div className="mb-8 gradient-border-gold shadow-2xl shadow-amber-500/10">
        <div className="glass-card rounded-[13px] p-6 sm:p-8 bg-surface-elevated/95 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-gold uppercase tracking-widest block">
                St. Joseph International School • Josephite Tech Club
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                SJIS INTER-SCHOOL TECH CARNIVAL 2026
              </h2>
              <span className="text-xs text-slate-300">Official Festival Compendium & 19-Arena Rulebook</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="gold" size="md">
                Oct 1 – 2, 2026
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs text-slate-300">
            <div><strong>Campus Venue:</strong> 97 Asad Avenue, Mohammadpur, Dhaka</div>
            <div><strong>Academic Scope:</strong> Grade 3 to University 4th Year (Groups A–E)</div>
            <div><strong>Official Portal:</strong> <span className="text-gold font-mono">jtc.sjis.edu.bd</span></div>
          </div>
        </div>
      </div>

      {/* Interactive Rulebook Viewer Component */}
      <RulebookViewer events={events} />
    </div>
  );
}
