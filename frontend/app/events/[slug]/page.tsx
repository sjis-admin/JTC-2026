import React, { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchEventBySlug, fetchEvents, BUNDLE_EVENT_SLUGS } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import {
  ArrowLeft, MapPin, Users, User, Calendar, Trophy, Sparkles, CheckCircle2, HelpCircle, Zap
} from 'lucide-react';
import MarkdownRulesRenderer from '@/components/common/MarkdownRulesRenderer';

import type { Metadata } from 'next';

interface EventPageProps {
  params: { slug: string };
}

export const dynamicParams = true;
export const revalidate = 60;

// Deduplicate fetch within the same request lifecycle (generateMetadata + page render)
const getCachedEvent = cache(async (slug: string) => {
  return await fetchEventBySlug(slug);
});

export async function generateStaticParams() {
  const events = await fetchEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await getCachedEvent(params.slug);
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
  const event = await getCachedEvent(params.slug);

  if (!event) {
    notFound();
  }

  const isBundleEvent = BUNDLE_EVENT_SLUGS.includes(event.slug);

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
              {isBundleEvent && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 inline-flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> In 5-in-1 Bundle Pass
                </span>
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
              <MarkdownRulesRenderer content={event.rules} />
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
                  <Button variant="outline" size="lg" className="w-full justify-center text-sm font-extrabold">
                    Register For This Event Only
                  </Button>
                </Link>
              </div>

              {/* Bundle Upgrade Card */}
              {isBundleEvent && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-emerald-900/60 to-surface-elevated border-2 border-emerald-500/50 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wide font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> 5-in-1 Festival Bundle
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
                      Save ৳400
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold text-emerald-200 font-mono">
                    <Users className="w-3 h-3 text-emerald-400" />
                    <span>Applicable for Groups A to D (Grades 3–12)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Compete in <strong className="text-white">{event.name}</strong> + 4 other flagship events for only <strong className="text-emerald-400 font-mono text-sm">৳1,000</strong>! Includes free Game Zone FC match.
                  </p>
                  <Link href="/register?bundle=1" className="block w-full">
                    <Button
                      variant="glow"
                      size="md"
                      className="w-full justify-center text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Get 5-in-1 Bundle Pass (৳1,000) →</span>
                    </Button>
                  </Link>
                  {event.eligibility_groups.some(g => g.code === 'E') && (
                    <p className="text-[10px] text-slate-400 text-center">
                      University participants (Group E) can register individually using the button above.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
