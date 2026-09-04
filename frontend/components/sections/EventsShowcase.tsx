'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { EventItem } from '@/lib/api';
import { Card, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import MarkdownRulesRenderer from '@/components/common/MarkdownRulesRenderer';
import {
  Sparkles, Code, Palette, Keyboard, Presentation, Gamepad2, Globe, Film,
  Camera, FileText, HelpCircle, Smile, Box, Compass, Crosshair, Trophy, Bot, Cpu, Plane,
  ArrowRight, Users, User, MapPin, Search, Eye, X, CheckCircle2, Award
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
  Code: <Code className="w-5 h-5 text-sky-400" />,
  Palette: <Palette className="w-5 h-5 text-pink-400" />,
  Keyboard: <Keyboard className="w-5 h-5 text-emerald-400" />,
  Presentation: <Presentation className="w-5 h-5 text-blue-400" />,
  Gamepad2: <Gamepad2 className="w-5 h-5 text-purple-400" />,
  Globe: <Globe className="w-5 h-5 text-teal-400" />,
  Film: <Film className="w-5 h-5 text-red-400" />,
  Camera: <Camera className="w-5 h-5 text-cyan-400" />,
  FileText: <FileText className="w-5 h-5 text-amber-300" />,
  HelpCircle: <HelpCircle className="w-5 h-5 text-indigo-400" />,
  Smile: <Smile className="w-5 h-5 text-yellow-400" />,
  Box: <Box className="w-5 h-5 text-emerald-300" />,
  Compass: <Compass className="w-5 h-5 text-orange-400" />,
  Crosshair: <Crosshair className="w-5 h-5 text-rose-500" />,
  Trophy: <Trophy className="w-5 h-5 text-gold" />,
  Bot: <Bot className="w-5 h-5 text-cyan-300" />,
  Cpu: <Cpu className="w-5 h-5 text-gold" />,
  Plane: <Plane className="w-5 h-5 text-sky-400" />,
};

interface EventsShowcaseProps {
  events: EventItem[];
  title?: string;
  subtitle?: string;
  limit?: number;
  showFilters?: boolean;
}

export default function EventsShowcase({
  events: initialEvents = [],
  title = 'Featured Competitions & Segments',
  subtitle = 'Discover all 19 competitive challenges, robotics showdowns, and creative arenas.',
  limit,
  showFilters = true,
}: EventsShowcaseProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewEvent, setQuickViewEvent] = useState<EventItem | null>(null);

  // Client-side fallback if server-side rendered array was empty
  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setEvents(initialEvents);
    } else {
      fetch('/api/events/')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          const list = Array.isArray(data) ? data : data.results || [];
          if (list.length > 0) setEvents(list);
        })
        .catch((err) => console.error('Client events fetch error:', err));
    }
  }, [initialEvents]);

  const categories = useMemo(() => [
    { id: 'ALL', label: 'All Segments', count: events.length },
    { id: 'AI', label: 'AI & Machine', count: events.filter(e => e.category === 'AI').length },
    { id: 'CODING', label: 'Coding Marathon', count: events.filter(e => e.category === 'CODING').length },
    { id: 'ROBOTICS', label: 'Robotics & Drone', count: events.filter(e => e.category === 'ROBOTICS').length },
    { id: 'DIGITAL_ART', label: 'Digital Art & MV', count: events.filter(e => e.category === 'DIGITAL_ART').length },
    { id: 'CREATIVE', label: 'Creative & Photo', count: events.filter(e => ['CREATIVE', 'TYPING', 'OTHER'].includes(e.category)).length },
    { id: 'QUIZ', label: 'Quizzes & Trivia', count: events.filter(e => ['QUIZ', 'GAMING'].includes(e.category)).length },
  ], [events]);

  const groups = [
    { id: 'ALL', label: 'All Academic Grades (Gr 3 – Univ)' },
    { id: 'A', label: 'Group A (Grade 3–4)' },
    { id: 'B', label: 'Group B (Grade 5–6)' },
    { id: 'C', label: 'Group C (Grade 7–8)' },
    { id: 'D', label: 'Group D (Grade 9–12)' },
    { id: 'E', label: 'Group E (University)' },
  ];

  const filtered = useMemo(() => {
    return events.filter((e) => {
      // Category filter
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'CREATIVE') {
          if (!['CREATIVE', 'TYPING', 'OTHER'].includes(e.category)) return false;
        } else if (selectedCategory === 'QUIZ') {
          if (!['QUIZ', 'GAMING'].includes(e.category)) return false;
        } else if (e.category !== selectedCategory) {
          return false;
        }
      }

      // Group filter
      if (selectedGroup !== 'ALL') {
        if (!e.eligibility_groups.some((g) => g.code === selectedGroup)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = e.name.toLowerCase().includes(query);
        const matchDesc = e.description.toLowerCase().includes(query);
        const matchCat = e.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [events, selectedCategory, selectedGroup, searchQuery]);

  const displayList = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-gold uppercase mb-2">
            <span>TOURNAMENT ROSTER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {limit && (
          <Link href="/events">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              View All Events <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        )}
      </div>

      {/* Interactive Search & Filter Controls */}
      {showFilters && (
        <div className="space-y-4 mb-8 bg-surface/50 p-4 rounded-2xl border border-surface-border backdrop-blur-md">
          {/* Search Bar + Group Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events by name, rules, game, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-gold transition-all"
              />
            </div>

            {/* Academic Group Dropdown */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-gold cursor-pointer"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id} className="bg-surface text-white">
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Pills (Clean wrapping with no scrollbars) */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-gold via-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-gold/25'
                    : 'bg-surface text-slate-300 border border-surface-border hover:border-gold/50 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  selectedCategory === cat.id ? 'bg-black/30 text-slate-950' : 'bg-surface-elevated text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      {showFilters && (
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span>Showing <strong className="text-white font-mono">{displayList.length}</strong> of {events.length} competitions</span>
          {(selectedCategory !== 'ALL' || selectedGroup !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedGroup('ALL');
                setSearchQuery('');
              }}
              className="text-gold hover:underline cursor-pointer font-semibold"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayList.map((event) => {
          const icon = iconMap[event.icon] || <Sparkles className="w-5 h-5 text-gold" />;

          return (
            <Card
              key={event.id}
              glow="none"
              className="flex flex-col justify-between group border border-surface-border bg-surface/80 backdrop-blur-xl hover:border-gold/60 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300"
            >
              <div>
                {/* Card Top Header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-center group-hover:scale-110 group-hover:border-gold/40 transition-all duration-300 shadow-md">
                    {icon}
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    <span className="font-mono font-black text-sm px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/40 shadow-sm">
                      {event.fee_display}
                    </span>
                  </div>
                </div>

                {/* Event Title & Category */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-surface-elevated text-gold-light border border-surface-border">
                    {event.category.replace('_', ' ')}
                  </span>
                  {event.event_type === 'TEAM' ? (
                    <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-700/50 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Team
                    </span>
                  ) : event.event_type === 'BOTH' ? (
                    <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-amber-950/60 text-gold-light border border-amber-700/50">
                      Solo / Team
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-surface text-slate-300 border border-surface-border">
                      Individual
                    </span>
                  )}
                </div>

                <CardTitle className="text-xl group-hover:text-gold-light transition-colors line-clamp-1">
                  <Link href={`/events/${event.slug}`} prefetch={true} className="hover:underline">
                    {event.name}
                  </Link>
                </CardTitle>

                <CardDescription className="line-clamp-2 mt-2 text-xs leading-relaxed text-slate-300">
                  {event.description}
                </CardDescription>

                {/* Academic Eligibility Badges */}
                <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="font-semibold text-slate-400 text-[11px]">Eligible:</span>
                  {event.eligibility_groups.map((g) => (
                    <span
                      key={g.code}
                      className="px-2 py-0.5 rounded-md bg-surface-elevated text-slate-200 border border-surface-border font-mono text-[10px] font-semibold"
                      title={g.grade_range}
                    >
                      Grp {g.code}
                    </span>
                  ))}
                </div>

                {/* Venue Detail */}
                {event.venue_detail && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span className="truncate">{event.venue_detail}</span>
                  </div>
                )}
              </div>

              {/* Card Bottom Actions */}
              <CardFooter className="mt-6 pt-4 border-t border-surface-border/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setQuickViewEvent(event)}
                  className="text-xs font-bold text-slate-300 hover:text-gold flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-surface-elevated hover:bg-surface border border-surface-border transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-gold" /> Rules
                </button>
                <Link href={`/register?event=${event.id}`}>
                  <Button variant="glow" size="sm" className="text-xs font-bold py-1.5 px-4">
                    Register Now <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {displayList.length === 0 && (
        <div className="p-16 rounded-2xl bg-surface/40 border border-surface-border text-center text-slate-400 space-y-4">
          <p className="text-base text-slate-300 font-semibold">No competitions matched your filter criteria.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedGroup('ALL');
              setSearchQuery('');
            }}
          >
            Clear Filters & Show All
          </Button>
        </div>
      )}

      {/* QUICK VIEW RULES MODAL */}
      {quickViewEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-elevated border border-gold/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setQuickViewEvent(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-surface border border-surface-border text-slate-400 hover:text-white hover:border-gold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-gold uppercase px-2.5 py-0.5 rounded bg-surface border border-surface-border">
                  {quickViewEvent.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono font-bold text-gold-light">
                  {quickViewEvent.fee_display}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white font-display">{quickViewEvent.name}</h3>
              <p className="text-sm text-slate-300 mt-2">{quickViewEvent.description}</p>
            </div>

            {/* Quick Rules */}
            {quickViewEvent.rules && (
              <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2 max-h-80 overflow-y-auto pr-2">
                <h4 className="text-xs uppercase font-bold tracking-wider text-gold flex items-center gap-1.5 sticky top-0 bg-surface/95 backdrop-blur-sm pb-1.5 border-b border-surface-border">
                  <CheckCircle2 className="w-4 h-4" /> Rules & Requirements
                </h4>
                <MarkdownRulesRenderer content={quickViewEvent.rules} />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-surface-border">
              <Link
                href={`/events/${quickViewEvent.slug}`}
                prefetch={true}
                className="text-xs font-semibold text-slate-400 hover:text-gold hover:underline inline-flex items-center gap-1 transition-colors"
              >
                Open Full Dedicated Page →
              </Link>
              <Link href={`/register?event=${quickViewEvent.id}`}>
                <Button variant="glow" size="md">
                  Register For This Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
