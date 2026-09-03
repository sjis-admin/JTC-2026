'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar, Clock, MapPin, Radio, Trophy, Sparkles, Flag, Video, Check
} from 'lucide-react';

export default function CarnivalTimeline() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');

  const days = {
    day1: {
      date: 'Day 1 — Thursday, Oct 1, 2026',
      theme: 'Grand Opening, AI Prompting, Robotics Prelims & Coding Marathon',
      events: [
        { time: '08:30 AM', title: 'Contestant Kit & ID Verification Desk Opens', venue: 'Main Entrance Lobby', type: 'GENERAL' },
        { time: '09:30 AM', title: 'Grand Opening Ceremony & Welcome Speech', venue: 'SJIS Main Auditorium', type: 'CEREMONY' },
        { time: '11:00 AM', title: 'Offline Submissions Window (Digital Art, Montage & Photos on Pendrive)', venue: 'Media Lab Desk', type: 'SUBMISSION' },
        { time: '11:30 AM', title: 'Gaming Quiz & Tech Quiz (Round 1 Written Exams)', venue: 'Old Building Examination Rooms', type: 'CONTEST' },
        { time: '01:30 PM', title: 'Coding Marathon (Scratch & Python/C++ Algorithmic)', venue: 'SJIS Main Computer Labs', type: 'CONTEST' },
        { time: '02:30 PM', title: 'AI Prompting Live Arena (BYOD)', venue: 'Computer Lab 1 & 2', type: 'FLAGSHIP' },
        { time: '03:45 PM', title: 'Line Follower Robot (LFR) Autonomous Track Trials', venue: 'Robotics Arena Track', type: 'ROBOTICS' },
        { time: '04:30 PM', title: 'Valorant & EA FC LAN E-Sports Prelims & Knockouts', venue: 'Esports LAN Arena (Live Streamed)', type: 'ESPORTS' },
      ],
    },
    day2: {
      date: 'Day 2 — Friday, Oct 2, 2026',
      theme: 'Custom Drone Flight, Stage Buzzer Finals, Esports Grand Finals & Gala Awards',
      events: [
        { time: '09:00 AM', title: 'Custom Drone Design & Precision Obstacle Flight', venue: 'SJIS Open Field Arena', type: 'FLAGSHIP' },
        { time: '10:30 AM', title: 'Robo Showcase & Hardware Project Exhibition', venue: 'Exhibition Hall', type: 'ROBOTICS' },
        { time: '11:30 AM', title: 'PowerPoint Presentation Final Stage Rounds', venue: 'Main Auditorium Stage', type: 'CONTEST' },
        { time: '01:30 PM', title: 'Tech Quiz & Gaming Quiz Stage Buzzer Grand Finals', venue: 'Main Stage', type: 'CONTEST' },
        { time: '02:30 PM', title: 'Valorant & EA FC Grand Finals on Stage Rig', venue: 'Main Stage & Live Broadcast', type: 'FLAGSHIP' },
        { time: '04:30 PM', title: 'Grand Award Giving Ceremony & Crest Handover', venue: 'Main Auditorium', type: 'CEREMONY' },
      ],
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-gold uppercase mb-2">
          <span>Official Itinerary</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          2-Day Carnival Schedule
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Explore the competition timeline across Computer Labs, Robotics Arena, and Main Auditorium Stage.
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10 pb-2">
        {[
          { id: 'day1', label: 'Day 1 • Opening, Coding, AI & Robo Prelims', date: 'Oct 1' },
          { id: 'day2', label: 'Day 2 • Drones, Stage Finals & Award Gala', date: 'Oct 2' },
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDay(d.id as any)}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeDay === d.id
                ? 'bg-gradient-to-r from-gold via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-gold/25 font-black scale-105'
                : 'bg-surface/80 text-slate-300 border border-surface-border hover:border-gold/50'
            }`}
          >
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      <Card glow="none" className="p-6 sm:p-8 border border-surface-border bg-surface/80 backdrop-blur-xl">
        <div className="mb-6 pb-4 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-extrabold text-white font-display">{days[activeDay].date}</h3>
            <p className="text-xs text-gold-light font-semibold mt-0.5">{days[activeDay].theme}</p>
          </div>
          <Badge variant="gold" size="md">
            Live Stream Available
          </Badge>
        </div>

        <div className="space-y-4 relative">
          {days[activeDay].events.map((ev, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-elevated/90 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gold/40 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2 rounded-lg bg-surface border border-gold/30 text-gold font-mono text-xs font-bold shrink-0">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  {ev.time}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">{ev.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>{ev.venue}</span>
                  </div>
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0">
                <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold border ${
                  ev.type === 'FLAGSHIP' ? 'bg-gold/20 text-gold border-gold/50' :
                  ev.type === 'ESPORTS' ? 'bg-rose-950/60 text-rose-300 border-rose-700/50' :
                  ev.type === 'ROBOTICS' ? 'bg-sky-950/60 text-sky-300 border-sky-700/50' :
                  'bg-surface text-slate-300 border-surface-border'
                }`}>
                  {ev.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
