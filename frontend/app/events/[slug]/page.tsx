import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchEventBySlug, fetchEvents } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import {
  ArrowLeft, MapPin, Users, User, Calendar, Trophy, Sparkles, CheckCircle2, HelpCircle
} from 'lucide-react';

import type { Metadata } from 'next';

interface EventPageProps {
  params: { slug: string };
}

export const dynamicParams = true;
export const revalidate = 30;

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await fetchEventBySlug(params.slug);
  if (!event) {
    return {
      title: 'Competition Not Found',
    };
  }

  const feeText = event.fee_display || `৳${event.individual_fee}`;
  const title = `${event.name} — SJIS Tech Carnival 2026`;
  const description = `${event.description} Fee: ${feeText}. Venue: ${event.venue_detail}. Open to ${event.eligibility_groups?.map((g) => `Group ${g.code} (${g.grade_range})`).join(', ')}.`;

  return {
    title,
    description,
    keywords: [
      event.name,
      event.category,
      'SJIS Tech Carnival 2026',
      'Josephite Tech Club',
      'St. Joseph International School',
      'Dhaka School Tech Fest',
      `${event.name} Registration`,
      `${event.name} Rules SJIS`,
    ],
    alternates: {
      canonical: `https://jtc.sjis.edu.bd/events/${event.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://jtc.sjis.edu.bd/events/${event.slug}`,
      type: 'article',
      images: [
        {
          url: '/og-preview.png',
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-preview.png'],
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const event = await fetchEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back button */}
      <Link href="/events" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-jtc-cyan mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="cyan" size="md">
                {event.category.replace('_', ' ')}
              </Badge>
              {event.event_type === 'TEAM' ? (
                <Badge variant="purple" size="md">
                  <Users className="w-3.5 h-3.5" /> Team Event (Min {event.team_min} - Max {event.team_max})
                </Badge>
              ) : event.event_type === 'BOTH' ? (
                <Badge variant="teal" size="md">
                  Individual or Team
                </Badge>
              ) : (
                <Badge variant="neutral" size="md">
                  <User className="w-3.5 h-3.5" /> Individual
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              {event.name}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Rules Section */}
          {event.rules && (
            <Card glow="none" className="border border-surface-border bg-surface/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-jtc-teal" /> Rules & Guidelines
              </h2>
              <div className="text-sm text-slate-300 space-y-3 leading-relaxed whitespace-pre-line">
                {event.rules}
              </div>
            </Card>
          )}

          {/* Judging Criteria */}
          {event.judging_criteria && (
            <Card glow="none" className="border border-surface-border bg-surface/50">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Judging Criteria
              </h2>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {event.judging_criteria}
              </div>
            </Card>
          )}

          {/* FAQs */}
          {event.faqs && event.faqs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-jtc-cyan" /> Event FAQs
              </h3>
              <div className="space-y-3">
                {event.faqs.map((faq, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface border border-surface-border">
                    <h4 className="font-semibold text-sm text-white mb-1">{faq.question}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary Card (1 Col) */}
        <div className="space-y-6">
          <Card glow="teal" className="border border-surface-border bg-surface-elevated/80 sticky top-28">
            <div className="space-y-5">
              <div>
                <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Registration Fee</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-1 text-glow-cyan">
                  {event.fee_display}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-surface-border/80 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Eligible Academic Groups:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {event.eligibility_groups.map((g) => (
                      <span key={g.code} className="px-2.5 py-1 rounded bg-surface border border-surface-border text-slate-200 font-medium">
                        Group {g.code} ({g.grade_range})
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Venue / Format:</span>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <MapPin className="w-4 h-4 text-jtc-teal shrink-0" />
                    <span>{event.venue_detail || 'SJIS Main Campus'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Submission Type:</span>
                  <span className="px-2 py-0.5 rounded bg-surface text-slate-300 border border-surface-border font-mono text-[11px]">
                    {event.submission_type}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border/80">
                <Link href={`/register?event=${event.id}`} className="block w-full">
                  <Button variant="glow" size="lg" className="w-full justify-center text-sm font-extrabold">
                    Register For This Event
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
