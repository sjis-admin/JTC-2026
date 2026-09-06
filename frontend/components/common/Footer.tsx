'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { fetchSiteSettings, SiteSettingsData } from '@/lib/api';

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  // Hide the public footer completely inside the Admin Suite
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const phone = settings?.contact_phone || '+880 2-9116271';
  const email = settings?.contact_email || 'jtc@sjis.edu.bd';
  const venue = settings?.venue || 'St. Joseph International School, 97 Asad Avenue, Mohammadpur, Dhaka 1207';
  const fbUrl = settings?.facebook_url || 'https://facebook.com';
  const instaUrl = settings?.instagram_url || 'https://instagram.com';
  const ytUrl = settings?.youtube_url || 'https://youtube.com';

  return (
    <footer className="bg-[#010714] border-t border-surface-border text-slate-400 text-sm mt-auto relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sjis-royal/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface border border-gold/40 flex items-center justify-center text-gold shadow-md overflow-hidden relative">
                <img
                  src={settings?.logo_url || '/images/jtc-logo.png'}
                  alt="JTC Logo"
                  className="w-full h-full object-cover rounded-[9px]"
                />
              </div>
              <div>
                <span className="font-black text-white text-base sm:text-lg tracking-wider font-mono whitespace-nowrap block">
                  JOSEPHITE TECH CLUB
                </span>
                <p className="text-xs text-gold font-bold whitespace-nowrap">St. Joseph International School</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fostering excellence in artificial intelligence, competitive programming, robotics, aeronautics, digital media, and innovation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {fbUrl && (
                <a href={fbUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-slate-300 hover:text-gold hover:border-gold transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {instaUrl && (
                <a href={instaUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-slate-300 hover:text-gold hover:border-gold transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {ytUrl && (
                <a href={ytUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-slate-300 hover:text-gold hover:border-gold transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-light">Event Arenas</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/events?category=AI" className="hover:text-gold transition-colors">AI Prompting & Engineering</Link></li>
              <li><Link href="/events?category=CODING" className="hover:text-gold transition-colors">Coding Marathon (Scratch & Python)</Link></li>
              <li><Link href="/events?category=ROBOTICS" className="hover:text-gold transition-colors">Robotics, LFR & Drone Arena</Link></li>
              <li><Link href="/events?category=DIGITAL_ART" className="hover:text-gold transition-colors">Digital Art & Gaming Montages</Link></li>
              <li><Link href="/events?category=QUIZ" className="hover:text-gold transition-colors">Tech & Gaming Quizzes</Link></li>
              <li><Link href="/events?category=CREATIVE" className="hover:text-gold transition-colors">Creative, Poster & Speedcubing</Link></li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-light">Contestant Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/rulebook" className="hover:text-gold transition-colors font-semibold text-gold">Official Rulebook (Compendium)</Link></li>
              <li><Link href="/register" className="hover:text-gold transition-colors">Online Registration</Link></li>
              <li><Link href="/verify" className="hover:text-gold transition-colors">Verify Confirmation Pass</Link></li>
              <li><Link href="/#groups" className="hover:text-gold transition-colors">Academic Group Criteria</Link></li>
              <li><Link href="/#rules" className="hover:text-gold transition-colors">Submission Guidelines</Link></li>
            </ul>
          </div>

          {/* Col 4: Venue & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-light">Campus & Helpdesk</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div className="leading-snug">
                  {venue.includes('St. Joseph') && (venue.includes('97 Asad') || venue.includes('Asad Avenue')) ? (
                    <>
                      <span className="block font-medium text-slate-200">
                        {venue.split(/,(.+)/)[0]?.trim()}
                      </span>
                      <span className="block text-slate-400 mt-0.5">
                        {venue.split(/,(.+)/)[1]?.trim()}
                      </span>
                    </>
                  ) : venue.includes('\n') ? (
                    venue.split('\n').map((line, idx) => (
                      <span key={idx} className="block text-slate-300">
                        {line}
                      </span>
                    ))
                  ) : (
                    <span>{venue}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold transition-colors">{email}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-gold transition-colors">{phone}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & domain bar */}
        <div className="border-t border-surface-border/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 text-center sm:text-left">
          <div className="leading-relaxed">
            <p>© 2026 Josephite Tech Club.</p>
            <p className="text-slate-300 font-medium">St. Joseph International School.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Official Portal: <strong className="text-gold font-mono font-bold">jtc.sjis.edu.bd</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
