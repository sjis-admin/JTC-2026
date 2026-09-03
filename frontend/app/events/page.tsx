import React from 'react';
import EventsShowcase from '@/components/sections/EventsShowcase';
import { fetchEvents } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <div className="pt-28 pb-20">
      <EventsShowcase
        events={events}
        title="All 19 Carnival Events"
        subtitle="Filter by category, check eligibility, explore guidelines, and register for individual or team challenges."
        showFilters={true}
      />
    </div>
  );
}
