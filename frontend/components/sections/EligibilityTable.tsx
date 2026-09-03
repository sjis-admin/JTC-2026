import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EventItem } from '@/lib/api';
import { CheckCircle2, Trophy, Users, Sparkles } from 'lucide-react';

interface EligibilityTableProps {
  events?: EventItem[];
}

const DEFAULT_GROUPS_META = [
  {
    code: 'A',
    title: 'Group A',
    grades: 'Grade 3 to Grade 4',
    description: 'Junior Primary Tier',
  },
  {
    code: 'B',
    title: 'Group B',
    grades: 'Grade 5 to Grade 6',
    description: 'Senior Primary Tier',
  },
  {
    code: 'C',
    title: 'Group C',
    grades: 'Grade 7 to Grade 8',
    description: 'Junior High Tier',
  },
  {
    code: 'D',
    title: 'Group D',
    grades: 'Grade 9 to Grade 12 (A2 / HSC)',
    description: 'Senior High & College Tier',
  },
  {
    code: 'E',
    title: 'Group E',
    grades: 'University Students (Bachelors 1st–4th Year)',
    description: 'Higher Education Varsity Tier',
  },
];

export default function EligibilityTable({ events = [] }: EligibilityTableProps) {
  // Dynamically compute eligible events for each group from the database
  const groupCards = DEFAULT_GROUPS_META.map((g) => {
    const eligibleEvents = events.filter((ev) =>
      ev.eligibility_groups.some((grp) => grp.code === g.code)
    );

    return {
      ...g,
      events: eligibleEvents,
    };
  });

  return (
    <section id="groups" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-gold uppercase mb-2">
          <span>Structure & Eligibility</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Academic Group Categorization
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Competitions are dynamically assigned to 5 age-appropriate tiers ensuring fair, exciting, and balanced contest standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupCards.map((group) => (
          <Card
            key={group.code}
            glow="none"
            className="border border-surface-border bg-surface/80 backdrop-blur-md flex flex-col justify-between hover:border-gold/50 transition-colors shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-white font-mono">{group.title}</span>
                <Badge variant="gold" size="md">
                  Group {group.code}
                </Badge>
              </div>
              <p className="text-sm font-bold text-gold-light mb-1">{group.grades}</p>
              <span className="text-[11px] text-slate-400 font-mono block mb-4">{group.description}</span>

              <div className="space-y-2 border-t border-surface-border/80 pt-4">
                <span className="text-xs font-bold uppercase text-slate-300 block tracking-wider flex items-center justify-between">
                  <span>Eligible Arenas ({group.events.length}):</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-200 max-h-56 overflow-y-auto pr-1">
                  {group.events.length > 0 ? (
                    group.events.map((ev) => (
                      <li key={ev.id} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-surface-elevated/60 border border-surface-border/50">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span className="truncate">{ev.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-gold font-bold shrink-0">{ev.fee_display}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 text-xs py-2">No events currently assigned.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-surface-border/60 text-[11px] text-slate-400 flex items-center gap-1">
              <span>* Validated via Student ID at gate entrance.</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
