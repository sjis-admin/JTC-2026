import React from 'react';
import Hero from '@/components/sections/Hero';
import HeroCyberTerminal from '@/components/sections/HeroCyberTerminal';
import EventsShowcase from '@/components/sections/EventsShowcase';
import MiniGamification from '@/components/sections/MiniGamification';
import EligibilityTable from '@/components/sections/EligibilityTable';
import CarnivalTimeline from '@/components/sections/CarnivalTimeline';
import RulesHighlights from '@/components/sections/RulesHighlights';
import FAQSection from '@/components/sections/FAQSection';
import { fetchEvents, fetchSiteSettings } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, events] = await Promise.all([
    fetchSiteSettings(),
    fetchEvents(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 1. Ultra-High Tech Hero Section */}
      <Hero settings={settings} />

      {/* 2. Interactive Cyber CLI Shell Widget */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-10 mb-14 relative z-20">
        <HeroCyberTerminal />
      </section>

      {/* 3. Featured Competitions Showcase */}
      <EventsShowcase
        events={events}
        title="Featured Competitions & Segments"
        subtitle="Explore our top flagship arenas or browse the full catalogue of 19 events."
        limit={6}
      />

      {/* 4. Gamified Mini-Challenge: SwiftType Blitz */}
      <MiniGamification />

      {/* 5. 3-Day Carnival Schedule & Arena Itinerary */}
      <CarnivalTimeline />

      {/* 6. Dynamic Academic Group Eligibility Matrix */}
      <EligibilityTable events={events} />

      {/* 7. Critical Submission Rules Highlights */}
      <RulesHighlights />

      {/* 8. Call to Action Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto my-10">
        <div className="gradient-border-gold shadow-2xl shadow-amber-500/15">
          <div className="glass-card rounded-[13px] p-8 sm:p-14 text-center relative overflow-hidden bg-gradient-to-br from-surface via-sjis-royal/70 to-surface-elevated">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/40 text-xs font-bold text-gold uppercase font-mono">
                <Sparkles className="w-3.5 h-3.5" /> Registrations Officially Open
              </span>
              <h3 className="text-3xl sm:text-5xl font-black text-white font-display">
                Claim Your Spot on the Leaderboard
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Join hundreds of talented programmers, pilots, roboticists, artists, and gamers at St. Joseph International School.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button variant="glow" size="lg" className="px-8 py-4 text-base font-black">
                    Register Online Now <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="secondary" size="lg" className="px-8 py-4 text-base font-bold">
                    Explore All 19 Arenas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <FAQSection />
    </div>
  );
}
