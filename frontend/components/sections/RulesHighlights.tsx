import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, Camera, Presentation, Box, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function RulesHighlights() {
  const highlights = [
    {
      title: 'AI Prompting Guidelines',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      tag: 'Group B–E • BYOD & Text-Only',
      points: [
        'Bring Your Own Device (laptop/tablet/phone) with personal mobile hotspot.',
        'Must start a fresh new chat/session of AI model for the competition.',
        'Text-only prompts: uploading images or reference files leads to instant disqualification.',
        'Prompt history will be test-run by judges to verify 100% output reproducibility.',
      ],
    },
    {
      title: 'Photography Specifications',
      icon: <Camera className="w-5 h-5 text-cyan-400" />,
      tag: '7×9 In • Mandatory Lamination',
      points: [
        'Hardcopy print strictly in 7 × 9 inches (18 × 23 cm) size.',
        'Photograph must be properly laminated before submission (do NOT mount on foam board or frame).',
        'Write Name, Class & Section, Group (A–E), and Title on the BACK SIDE before laminating.',
        'NO AI-generated or AI-synthesized photos allowed. Displayed using gallery hanging clips.',
      ],
    },
    {
      title: 'PowerPoint & Digital Art',
      icon: <Presentation className="w-5 h-5 text-rose-400" />,
      tag: 'Zero-AI & Group-Specific Topics',
      points: [
        'PowerPoint: Choose strictly 1 assigned topic according to your Group (A, B, C, or D).',
        'AI-generated slide decks (Gamma, Tome, etc.) are strictly prohibited.',
        'Digital Art: Submit high-res export and raw layered project file (.psd, .ai, .procreate) for layer verification.',
        'All artwork and presentations must be 100% human-created original works.',
      ],
    },
    {
      title: 'Robotics & 4×4 Speedcube',
      icon: <Box className="w-5 h-5 text-emerald-400" />,
      tag: 'Strict Dimensions & Scrambling',
      points: [
        'Rubik’s Showdown: Standard 4×4 Rubik’s Cube only; official scrambled sequences by judges.',
        'Line Robot: Maximum dimensions 25cm × 25cm × 25cm; must navigate 100% autonomously.',
        'Drone Competition: Maneuver obstacle course within flight zone; 5-second penalty per missed gate.',
        'Webpage Creation: 30 minutes in lab using offline code editors (HTML/CSS/JS).',
      ],
    },
  ];

  return (
    <section id="rules" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-gold uppercase mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official Contest Regulations</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Key Submission & Fair-Play Directives
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Review these critical segment submission criteria and technical limits from the official Holy Grail Rulebook.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((item, idx) => (
          <Card
            key={idx}
            glow="none"
            className="border border-surface-border bg-surface/70 backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                  <span className="text-[10px] font-mono text-gold uppercase block">{item.tag}</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                {item.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Direct link to Rulebook */}
      <div className="text-center mt-10">
        <Link href="/rulebook">
          <Button variant="glow" size="md" className="font-bold inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Read Full 17-Competition Official Rulebook</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
