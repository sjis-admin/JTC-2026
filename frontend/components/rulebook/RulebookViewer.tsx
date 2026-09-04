'use client';

import React, { useState, useMemo } from 'react';
import { EventItem } from '@/lib/api';
import {
  PPT_TOPICS_BY_GROUP,
  TREASURE_HUNT_ROUNDS,
} from '@/lib/carnivalEvents';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Filter,
  Download,
  Printer,
  ShieldAlert,
  Sparkles,
  Trophy,
  BookOpen,
  Calendar,
  MapPin,
  Users,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  FileText,
  ExternalLink,
  Bot,
  Plane,
  Camera,
  Code,
  Gamepad2,
  Smile,
  Compass,
  Box,
  Palette,
  Presentation,
  Keyboard,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

interface RulebookViewerProps {
  events: EventItem[];
}

const CATEGORY_FILTERS = [
  { label: 'All Segments', value: 'ALL' },
  { label: 'AI & Machine Learning', value: 'AI' },
  { label: 'Coding & Dev', value: 'CODING' },
  { label: 'Robotics & Drones', value: 'ROBOTICS' },
  { label: 'Digital Art & Media', value: 'DIGITAL_ART' },
  { label: 'Quizzes & Olympiads', value: 'QUIZ' },
  { label: 'Creative & Writing', value: 'CREATIVE' },
  { label: 'Gaming & E-Sports', value: 'ESPORTS_GAMING' },
];

const GROUP_FILTERS = [
  { label: 'All Grades', value: 'ALL' },
  { label: 'Group A (Gr 3–4)', value: 'A' },
  { label: 'Group B (Gr 5–6)', value: 'B' },
  { label: 'Group C (Gr 7–8)', value: 'C' },
  { label: 'Group D (Gr 9–12)', value: 'D' },
  { label: 'Group E (University)', value: 'E' },
];

export default function RulebookViewer({ events }: RulebookViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [activePptTab, setActivePptTab] = useState('Group A');

  // Filter events based on search query, category, and group
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // 1. Category Filter
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'ESPORTS_GAMING') {
          if (ev.category !== 'ESPORTS' && ev.category !== 'GAMING') return false;
        } else if (ev.category !== selectedCategory) {
          return false;
        }
      }

      // 2. Group Filter
      if (selectedGroup !== 'ALL') {
        const hasGroup = ev.eligibility_groups.some((g) => g.code === selectedGroup);
        if (!hasGroup) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ev.name.toLowerCase().includes(q);
        const matchesDesc = ev.description.toLowerCase().includes(q);
        const matchesRules = (ev.rules || '').toLowerCase().includes(q);
        const matchesCat = ev.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesRules && !matchesCat) return false;
      }

      return true;
    });
  }, [events, selectedCategory, selectedGroup, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = events
      .map((ev, idx) => {
        const groups = ev.eligibility_groups.map((g) => `Group ${g.code} (${g.grade_range})`).join(', ');
        return `# ${idx + 1}. ${ev.name}
**Category:** ${ev.category} | **Type:** ${ev.event_type} | **Fee:** ${ev.fee_display}
**Eligibility:** ${groups}
**Venue:** ${ev.venue_detail}

## Description
${ev.description}

## Rules & Guidelines
${ev.rules || 'Standard tournament rules apply.'}

## Judging Criteria
${ev.judging_criteria || 'Jury evaluation.'}
--------------------------------------------------\n\n`;
      })
      .join('');

    const blob = new Blob(
      [
        `# SJIS INTER-SCHOOL TECH CARNIVAL 2026 — OFFICIAL RULEBOOK COMPENDIUM\n` +
          `Date: Oct 1 – 2, 2026 | Venue: St. Joseph International School, Dhaka\n` +
          `Official Portal: https://jtc.sjis.edu.bd\n\n` +
          markdownContent,
      ],
      { type: 'text/markdown;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SJIS_Tech_Carnival_2026_Official_Rulebook.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Interactive Controls & Filters Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-surface/90 border border-surface-border backdrop-blur-xl shadow-xl space-y-4 print:hidden">
        {/* Search and Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search competitions, rules, keywords (e.g. 'Prompting', '4x4', 'Drone', '7x9', 'Zero')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-elevated/90 border border-surface-border text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-surface-border text-slate-200 hover:text-gold hover:border-gold font-mono text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-gold" />
              <span>Print / PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadMarkdown}
              className="border-surface-border text-slate-200 hover:text-gold hover:border-gold font-mono text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-gold" />
              <span>Download .MD</span>
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="space-y-2.5 pt-2 border-t border-surface-border/60">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-gold" /> Category:
            </span>
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-gold text-surface-dark shadow-md shadow-gold/20 font-bold'
                    : 'bg-surface-elevated text-slate-300 hover:text-white hover:bg-surface-border'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Academic Group Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold shrink-0 mr-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-gold" /> Eligibility:
            </span>
            {GROUP_FILTERS.map((grp) => (
              <button
                key={grp.value}
                onClick={() => setSelectedGroup(grp.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGroup === grp.value
                    ? 'bg-gradient-to-r from-amber-500 to-gold text-surface-dark shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-surface-elevated text-slate-300 hover:text-white hover:bg-surface-border'
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Result Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-gold">{filteredEvents.length}</strong> of{' '}
            <strong className="text-white">{events.length}</strong> competitions
          </span>
          {(searchQuery || selectedCategory !== 'ALL' || selectedGroup !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedGroup('ALL');
              }}
              className="text-xs text-gold hover:underline font-mono"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Quick Jump Table of Contents Bar */}
      <div className="p-4 rounded-xl bg-surface/60 border border-surface-border/80 print:hidden">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase block mb-2 tracking-wider">
          Quick Jump to Segment:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {events.map((ev, i) => (
            <a
              key={ev.id}
              href={`#segment-${ev.slug}`}
              className="px-2.5 py-1 rounded-lg bg-surface-elevated text-[11px] text-slate-300 hover:text-gold hover:bg-surface-border transition-colors flex items-center gap-1 font-mono"
            >
              <span className="text-gold font-bold">{i + 1}.</span> {ev.short_name || ev.name}
            </a>
          ))}
        </div>
      </div>

      {/* Official Directives & General Rules Card */}
      <Card glow="gold" className="p-6 border border-gold/40 bg-surface space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white font-display">
              General Festival Regulations & Standards
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Universal directives applicable to all participating schools, colleges, and varsities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-surface-elevated/70 border border-surface-border space-y-1.5">
            <strong className="text-gold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Eligibility & ID
            </strong>
            <p>
              Students from English Medium, Bengali Medium, and Higher Education institutions across Bangladesh are
              welcome. Every contestant must produce their valid School/College/University Student ID or fee slip.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated/70 border border-surface-border space-y-1.5">
            <strong className="text-gold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Strict Anti-AI Generation Policy
            </strong>
            <p>
              AI generation is strictly forbidden for Digital Art, Photography, PowerPoint, and Articles. For AI
              Prompting, prompts are verified by judges. Any unauthorized AI tool leads to immediate disqualification.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated/70 border border-surface-border space-y-1.5">
            <strong className="text-gold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Hardware & BYOD Policies
            </strong>
            <p>
              Participants for AI Prompting, Robotics, and Drones must supply their own hardware, mobile hotspots, and
              tools. Computer lab challenges (Typing, Web Creation, Coding) utilize school desktop rigs.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated/70 border border-surface-border space-y-1.5">
            <strong className="text-gold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Confirmation & Digital Pass
            </strong>
            <p>
              Registrations must be consolidated under a single 6-character Confirmation Code. Please save your digital pass
              and QR badge on your smartphone for physical check-in at the gate.
            </p>
          </div>
        </div>
      </Card>

      {/* Event Catalogue List */}
      <div className="space-y-8">
        {filteredEvents.map((event, idx) => (
          <section
            key={event.id}
            id={`segment-${event.slug}`}
            className="scroll-mt-32 rounded-2xl border border-surface-border bg-surface/95 overflow-hidden shadow-2xl transition-all hover:border-gold/30"
          >
            {/* Event Header Banner */}
            <div className="p-5 sm:p-7 bg-surface-elevated border-b border-surface-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gold/20 text-gold font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-gold/40">
                    {event.order || idx + 1}
                  </span>
                  <Badge variant="gold" size="sm">
                    {event.category.replace('_', ' ')}
                  </Badge>
                  <Badge variant="navy" size="sm">
                    {event.event_type}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold" /> {event.venue_detail}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                  {event.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {event.description}
                </p>
              </div>

              {/* Fee and Action Button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 border-t sm:border-t-0 border-surface-border/60 pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Registration Fee</span>
                  <span className="text-base sm:text-lg font-mono font-black text-gold">
                    {event.fee_display}
                  </span>
                </div>
                <Link href={`/events/${event.slug}`} className="print:hidden">
                  <Button variant="outline" size="sm" className="border-gold/50 text-gold hover:bg-gold hover:text-surface-dark font-mono text-xs flex items-center gap-1">
                    <span>Event Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Event Body Content */}
            <div className="p-5 sm:p-7 space-y-6">
              {/* Eligibility Bar */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-surface-elevated/50 border border-surface-border/70 text-xs">
                <span className="font-bold text-gold font-mono uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Eligible Academic Groups:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {event.eligibility_groups.map((g) => (
                    <span
                      key={g.code}
                      className="px-2.5 py-0.5 rounded-md bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-semibold"
                    >
                      Group {g.code} ({g.grade_range})
                    </span>
                  ))}
                </div>
              </div>

              {/* Rules Content */}
              {event.rules && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Rules & Regulations
                  </h4>
                  <div className="p-4 sm:p-5 rounded-xl bg-surface-elevated/70 border border-surface-border text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {event.rules}
                  </div>
                </div>
              )}

              {/* Special Segment Module: PowerPoint Topics */}
              {event.slug === 'powerpoint-presentation' && (
                <div className="p-4 sm:p-6 rounded-xl border border-gold/30 bg-surface-elevated/90 space-y-4">
                  <div className="flex items-center justify-between border-b border-surface-border pb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Presentation className="w-4 h-4 text-gold" />
                      Assigned Presentation Topics (Select exactly 1 for your Group)
                    </h4>
                  </div>

                  {/* Group Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {PPT_TOPICS_BY_GROUP.map((tg) => (
                      <button
                        key={tg.group}
                        onClick={() => setActivePptTab(tg.group)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          activePptTab === tg.group
                            ? 'bg-gold text-surface-dark shadow'
                            : 'bg-surface border border-surface-border text-slate-300 hover:text-white'
                        }`}
                      >
                        {tg.group} ({tg.grades})
                      </button>
                    ))}
                  </div>

                  {/* Active Topics Card */}
                  {PPT_TOPICS_BY_GROUP.filter((t) => t.group === activePptTab).map((tg) => (
                    <div key={tg.group} className="space-y-2 pt-1">
                      <span className="text-xs text-gold font-mono font-semibold block">
                        Available Topics for {tg.group} ({tg.grades}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {tg.topics.map((top, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-3 rounded-lg bg-surface border border-surface-border text-xs text-slate-200 font-medium flex items-center gap-2"
                          >
                            <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center justify-center shrink-0">
                              {tIdx + 1}
                            </span>
                            <span>{top.replace(/^\d+\.\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Segment Module: Treasure Hunt Rounds */}
              {event.slug === 'treasure-hunt' && (
                <div className="p-4 sm:p-6 rounded-xl border border-amber-500/40 bg-surface-elevated/90 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Compass className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      The Code Zero Protocol — 5 Progressive Rounds
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {TREASURE_HUNT_ROUNDS.map((rnd, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-3 rounded-xl bg-surface border border-surface-border text-xs space-y-1 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">
                            Phase {rIdx + 1}
                          </span>
                          <strong className="text-white block text-xs mb-1">{rnd.round}</strong>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{rnd.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Judging Criteria */}
              {event.judging_criteria && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Judging Rubrics & Evaluation Criteria
                  </h4>
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                    {event.judging_criteria}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {event.faqs && event.faqs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-jtc-cyan flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Segment Specific FAQs
                  </h4>
                  <div className="space-y-2">
                    {event.faqs.map((faq, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-3 rounded-xl bg-surface-elevated/50 border border-surface-border text-xs space-y-1"
                      >
                        <strong className="text-white block">{faq.question}</strong>
                        <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 px-4 bg-surface rounded-2xl border border-surface-border space-y-3">
            <Search className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-lg font-bold text-white">No Competitions Match Your Filters</h4>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms, clearing academic group filters, or resetting category selections.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedGroup('ALL');
              }}
              className="mt-2 text-gold border-gold/40"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
