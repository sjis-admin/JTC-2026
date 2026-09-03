import React from 'react';
import EventsShowcase from '@/components/sections/EventsShowcase';
import { fetchEvents } from '@/lib/api';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All Competitions & Arenas — SJIS Tech Carnival 2026',
  description:
    'Browse all 18 official competitions for SJIS Inter-School Tech Carnival 2026. Explore Coding Marathon, AI Prompting, Robotics Showcase, Drone Challenge, E-Sports, Multimedia, and Quizzes.',
  keywords: [
    'SJIS Carnival Events',
    'Tech Competitions Dhaka',
    'Coding Marathon 2026',
    'Robo Showcase SJIS',
    'Drone Flight Competition',
    'Valorant EA FC School Tournament',
  ],
  alternates: {
    canonical: 'https://jtc.sjis.edu.bd/events',
  },
  openGraph: {
    title: 'All Competitions & Arenas — SJIS Inter-School Tech Carnival 2026',
    description: 'Explore 18 thrilling competitive arenas across AI, Coding, Robotics, Drone, and E-Sports.',
    url: 'https://jtc.sjis.edu.bd/events',
  },
};

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <div className="pt-28 pb-20">
      <EventsShowcase
        events={events}
        title="Official Carnival Competitions"
        subtitle="Filter by category, check eligibility, explore guidelines, and register for individual or team challenges."
        showFilters={true}
      />
    </div>
  );
}
