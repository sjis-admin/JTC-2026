import React from 'react';
import { Gamepad2, Cpu, Zap, Shield } from 'lucide-react';

export default function SponsorsSection() {
  const sponsors = [
    { name: 'GIGABYTE AORUS', category: 'Official Hardware & LAN Partner', icon: <Cpu className="w-5 h-5 text-orange-400" /> },
    { name: 'STAR TECH', category: 'Technology Retail Partner', icon: <Zap className="w-5 h-5 text-red-500" /> },
    { name: 'KNIGHT GAMES', category: 'Flagship Gaming Partner', icon: <Gamepad2 className="w-5 h-5 text-jtc-cyan" /> },
    { name: 'ST. JOSEPH ALUMNI', category: 'Patron Sponsor', icon: <Shield className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-surface-border/60">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">
          Proudly Supported By
        </span>
        <h3 className="text-xl font-bold text-white mt-1">Partners & LAN Sponsors</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {sponsors.map((sp, idx) => (
          <div
            key={idx}
            className="glass-card rounded-xl p-5 border border-surface-border text-center flex flex-col items-center justify-center group hover:border-jtc-teal/50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {sp.icon}
            </div>
            <span className="text-sm font-extrabold text-white tracking-wide">{sp.name}</span>
            <span className="text-[11px] text-slate-400 mt-1">{sp.category}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
