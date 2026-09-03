import React from 'react';
import { Card } from '@/components/ui/Card';
import { ShieldAlert, Image, Gamepad, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RulesHighlights() {
  const highlights = [
    {
      title: 'AI Prompting Guidelines',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      tag: 'BYOD & Zero-Glitch',
      points: [
        'Bring Your Own Device (Laptop/Tablet/Phone) with personal internet.',
        'Submitted prompt MUST be in one continuous paragraph (no bullet points, no line breaks, no buzzword stuffing).',
        'Image-to-image cloning and reverse-engineered prompt uploads lead to instant disqualification.',
        'Judges will test-run winning prompts to verify 100% reproducibility.',
      ],
    },
    {
      title: 'Photography Exhibition Rules',
      icon: <Image className="w-5 h-5 text-cyan-400" />,
      tag: 'Hardcopy Specifications',
      points: [
        'Hardcopy print strictly in 7 × 9 inches (18 × 23 cm) size.',
        'Photograph must be laminated properly. Do NOT mount on foam board or frame (hanging clips used).',
        'Write Name, Class & Section, House, and Title clearly on the BACK SIDE.',
        'Up to 2 photographs per participant (each rated 0–10, total out of 20 marks).',
      ],
    },
    {
      title: 'E-Sports LAN & Stage Rules',
      icon: <Gamepad className="w-5 h-5 text-rose-400" />,
      tag: 'Valorant & EA FC',
      points: [
        'Valorant: Knockouts online before fest; Semi-finals & Grand Finals live on Stage LAN & Facebook Live.',
        'EA FC: 1v1 console knockouts on fest day LAN; Stage finals with commentary.',
        'Participants may bring own keyboards/mice/controllers for stage matches.',
        'Sponsored by leading gaming hardware brands.',
      ],
    },
  ];

  return (
    <section id="rules" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-rose-400 uppercase mb-2">
          <span>Important Contest Rules</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Key Participant Instructions
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Please review these critical event-specific submission criteria carefully to prevent disqualification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item, idx) => (
          <Card
            key={idx}
            glow="none"
            className="border border-surface-border bg-surface/50 backdrop-blur-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <span className="text-[11px] font-mono text-jtc-cyan uppercase">{item.tag}</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              {item.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-jtc-teal shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
