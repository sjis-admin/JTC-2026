'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can students from other schools and universities register?',
      a: 'Yes! SJIS Inter-School Tech Carnival 2026 is an open inter-school and inter-university carnival. Students from any institution in Bangladesh are welcome to participate in eligible events.',
    },
    {
      q: 'How do I pay the registration fee?',
      a: 'You can pay via bKash / Nagad / Bank Transfer to the official JTC account number shown during registration. Enter your Transaction ID (TrxID) in the form. Once submitted, your status will be "Pending Verification" until confirmed by our finance desk.',
    },
    {
      q: 'Can I participate in multiple events?',
      a: 'Absolutely! You can select as many events as you wish during the registration process, provided your academic grade matches the event eligibility criteria. Fees are automatically summed up.',
    },
    {
      q: 'What should I bring on the day of the fest?',
      a: 'Please bring your Student ID Card, your Registration Confirmation Code (received via Email & SMS), and any specific hardware required for your event (e.g. laptop for AI Prompting, custom drone for Drone Competition, robot for LFR/Showcase, or laminated photos).',
    },
    {
      q: 'How does team registration work for Drone, Robotics, or Treasure Hunt?',
      a: 'For team events, the team leader fills out the registration form, selects the team event, provides the Team Name and teammate names, and pays the corresponding team registration fee.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-jtc-cyan uppercase mb-2">
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-card rounded-xl border border-surface-border overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:text-jtc-cyan transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn('w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200', isOpen && 'rotate-180 text-jtc-cyan')}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-surface-border/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
