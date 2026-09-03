import React from 'react';
import { fetchEvents } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Printer, Download, ShieldCheck, Trophy, Sparkles, BookOpen, MapPin, Calendar, Users, Cpu, FileText, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Official Rulebook & Guidelines — SJIS Tech Carnival 2026',
  description:
    'Download and view the official rulebook, scoring criteria, submission guidelines, and eligibility rules for all 18 events at SJIS Inter-School Tech Carnival 2026.',
  keywords: [
    'SJIS Rulebook 2026',
    'Tech Carnival Rules Bangladesh',
    'Coding Competition Guidelines',
    'Drone Competition Rules SJIS',
    'Robo Showcase Rules',
    'Valorant Rulebook School Fest',
  ],
  alternates: {
    canonical: 'https://jtc.sjis.edu.bd/rulebook',
  },
  openGraph: {
    title: 'Official Rulebook & Guidelines — SJIS Tech Carnival 2026',
    description: 'Official rules, scoring rubrics, and eligibility criteria for all 18 competitions.',
    url: 'https://jtc.sjis.edu.bd/rulebook',
  },
};

export default async function RulebookPage() {
  const events = await fetchEvents();

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-gold/40 text-xs font-semibold text-gold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Official Rulebook & Guidelines
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Carnival Rulebook 2026
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Official guidelines, criteria, and segment rules for Josephite Tech Club Inter-School Tech Carnival.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/register">
            <Button variant="glow" size="sm" className="font-bold">
              Register Online
            </Button>
          </Link>
        </div>
      </div>

      {/* Printable Rulebook Document */}
      <div className="space-y-8 print:space-y-4 print:text-black">
        {/* Document Cover / Header Box */}
        <div className="gradient-border-gold shadow-2xl shadow-amber-500/10">
          <div className="glass-card rounded-[13px] p-6 sm:p-10 bg-surface-elevated/95 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-widest block">
                  St. Joseph International School • Josephite Tech Club
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
                  SJIS INTER-SCHOOL TECH CARNIVAL 2026
                </h2>
                <span className="text-xs text-slate-300">Official Festival Compendium & Segment Rules</span>
              </div>
              <div className="hidden sm:block text-right">
                <Badge variant="gold" size="md">
                  Oct 1 – 2, 2026
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
              <div><strong>Venue:</strong> SJIS Campus, 97 Asad Avenue, Mohammadpur, Dhaka</div>
              <div><strong>Eligibility:</strong> Grade 3 to University 4th Year (Groups A–E)</div>
              <div><strong>Official Domain:</strong> <span className="text-gold font-mono">jtc.sjis.edu.bd</span></div>
            </div>
          </div>
        </div>

        {/* General Guidelines */}
        <Card glow="none" className="p-6 border border-surface-border bg-surface space-y-4">
          <CardTitle className="text-lg text-gold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold" /> General Rules & Regulations
          </CardTitle>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
            <li><strong>Institutional Representation:</strong> Students from all English Medium, Bengali Medium, and Higher Education institutions across Bangladesh are welcome to participate.</li>
            <li><strong>Identification:</strong> Every participant must bring their valid School/College/University Student ID card or institutional fee slip.</li>
            <li><strong>Hardware & BYOD:</strong> Participants for AI Prompting, Robotics, and Programming must bring their own required hardware (laptops, chargers, drones, robots, components).</li>
            <li><strong>Payment & Verification:</strong> Registrations are consolidated. Every participant must preserve their 6-character Confirmation Code and Digital Pass.</li>
            <li><strong>Disqualification:</strong> Any form of plagiarism, unauthorized internet access during offline coding, or unsportsmanlike conduct in esports will lead to immediate disqualification.</li>
          </ul>
        </Card>

        {/* 19 Segment Breakdown */}
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-white font-display flex items-center gap-2 border-b border-surface-border pb-3">
            <Trophy className="w-5 h-5 text-gold" /> Complete Catalogue of 19 Competitions
          </h3>

          <div className="space-y-4">
            {events.map((event, idx) => (
              <Card key={event.id} glow="none" className="p-5 border border-surface-border bg-surface/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white">{event.name}</h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface-elevated text-gold-light border border-surface-border">
                      {event.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-gold">{event.fee_display}</span>
                    <Badge variant="navy" size="sm">
                      {event.event_type}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>

                {/* Eligibility */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Eligibility:</span>
                  <div className="flex flex-wrap gap-1">
                    {event.eligibility_groups.map((g) => (
                      <span key={g.code} className="px-1.5 py-0.5 rounded bg-surface-elevated text-gold text-[10px] font-mono">
                        Grp {g.code} ({g.grade_range})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rules */}
                {event.rules && (
                  <div className="p-3 rounded-xl bg-surface-elevated/70 text-xs text-slate-300 space-y-1">
                    <strong className="text-gold block font-mono text-[11px]">Rules:</strong>
                    <p className="whitespace-pre-line leading-relaxed">{event.rules}</p>
                  </div>
                )}

                {/* Judging */}
                {event.judging_criteria && (
                  <div className="p-3 rounded-xl bg-surface-elevated/70 text-xs text-slate-300 space-y-1">
                    <strong className="text-amber-400 block font-mono text-[11px]">Judging Criteria:</strong>
                    <p className="whitespace-pre-line leading-relaxed">{event.judging_criteria}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
