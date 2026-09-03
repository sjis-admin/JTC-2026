'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HistoryItem {
  cmd: string;
  output: React.ReactNode;
}

const DEMO_SEQUENCE = [
  {
    cmd: 'events --featured',
    output: (
      <div className="space-y-1 text-slate-300">
        <p className="text-gold font-bold">⚡ 19 Official Competitions Online:</p>
        <p className="text-slate-300">• AI Prompting • Coding Marathon • Robotics & Drone Flight</p>
        <p className="text-slate-300">• Valorant 5v5 • EA FC 24 • Tech Art Bonanza • SwiftType Blitz</p>
      </div>
    ),
  },
  {
    cmd: 'fest --schedule',
    output: (
      <div className="space-y-0.5 text-slate-300">
        <p className="text-emerald-400 font-bold">📅 Festival Dates: Oct 1 – 2, 2026 (2-Day Tech Fest)</p>
        <p className="text-slate-400">📍 Venue: St. Joseph International School Campus, Mohammadpur, Dhaka</p>
      </div>
    ),
  },
  {
    cmd: 'matrix --groups',
    output: (
      <div className="space-y-0.5 text-slate-300">
        <p className="text-sky-300">🎓 Groups A (Grades 3-4) • B (5-6) • C (7-8) • D (9-12/HSC) • E (University)</p>
        <p className="text-slate-400">All school, college, and university students across Bangladesh welcome.</p>
      </div>
    ),
  },
  {
    cmd: 'register --status',
    output: (
      <div className="space-y-0.5 text-emerald-400">
        <p className="font-bold">🟢 Online Registration: Active & Live</p>
        <p className="text-slate-300">Instant SSLCommerz / bKash payment verification & Digital QR Pass.</p>
      </div>
    ),
  },
];

export default function HeroCyberTerminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      cmd: 'jtc --version',
      output: (
        <span className="text-emerald-400">
          Josephite Tech Club OS v2026.10 [Kernel: SJIS-InterSchool-Fest]
        </span>
      ),
    },
    {
      cmd: 'fest --status',
      output: (
        <div className="space-y-1 text-slate-300">
          <p className="text-gold-light">⚡ 19 Competitions Loaded • 5 Academic Groups Active</p>
          <p className="text-sky-300">📍 Venue: SJIS Campus, 97 Asad Avenue, Mohammadpur</p>
          <p className="text-slate-400">
            Type <span className="text-gold font-bold font-mono">"events"</span>,{' '}
            <span className="text-gold font-bold font-mono">"register"</span>, or{' '}
            <span className="text-gold font-bold font-mono">"help"</span>
          </p>
        </div>
      ),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isUserActive, setIsUserActive] = useState(false);
  const [autoText, setAutoText] = useState('');
  const [isTypingAuto, setIsTypingAuto] = useState(true);

  const terminalBodyRef = useRef<HTMLDivElement | null>(null);
  const sequenceIdxRef = useRef(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-typing animation loop
  useEffect(() => {
    if (isUserActive) return;

    let currentTimeout: NodeJS.Timeout;
    const currentDemo = DEMO_SEQUENCE[sequenceIdxRef.current % DEMO_SEQUENCE.length];
    let charIndex = 0;
    setAutoText('');
    setIsTypingAuto(true);

    const typeNextChar = () => {
      if (charIndex < currentDemo.cmd.length) {
        setAutoText(currentDemo.cmd.slice(0, charIndex + 1));
        charIndex++;
        // Varied typing speed for realism
        const delay = 65 + Math.random() * 55;
        currentTimeout = setTimeout(typeNextChar, delay);
      } else {
        // Finished typing command, pause before "pressing enter"
        currentTimeout = setTimeout(() => {
          setIsTypingAuto(false);
          // Append to history with slight execution delay
          setHistory((prev) => [
            ...prev.slice(-8), // Keep last 8 items to avoid excessive scroll
            { cmd: currentDemo.cmd, output: currentDemo.output },
          ]);
          setAutoText('');
          sequenceIdxRef.current++;

          // Pause before starting next command
          currentTimeout = setTimeout(() => {
            setIsTypingAuto(true);
          }, 2400);
        }, 600);
      }
    };

    // Initial delay before typing starts
    currentTimeout = setTimeout(typeNextChar, 1200);

    return () => clearTimeout(currentTimeout);
  }, [isUserActive, sequenceIdxRef.current]);

  // Keep terminal smoothly scrolled to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history, autoText]);

  // Manual User Command Execution
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = inputVal.trim().toLowerCase();
    if (!cleanCmd) return;

    let output: React.ReactNode = null;

    if (cleanCmd === 'help') {
      output = (
        <div className="space-y-1 text-slate-300 text-xs">
          <p>Available interactive commands:</p>
          <p><span className="text-gold font-mono font-bold">events</span> - List all 19 featured competitions</p>
          <p><span className="text-gold font-mono font-bold">register</span> - Open contestant registration portal</p>
          <p><span className="text-gold font-mono font-bold">schedule</span> - Festival itinerary & dates</p>
          <p><span className="text-gold font-mono font-bold">matrix</span> - Show Grade Groups (A to E)</p>
          <p><span className="text-gold font-mono font-bold">clear</span> - Clear terminal screen</p>
          <p><span className="text-gold font-mono font-bold">sudo join</span> - VIP contestant easter egg</p>
        </div>
      );
    } else if (cleanCmd === 'events') {
      output = (
        <div className="space-y-1 text-xs">
          <p className="text-gold font-bold">🔥 19 Competitions Registered:</p>
          <p className="text-slate-300">• AI Prompting • Coding Marathon • Drone Competition • Robo Showcase</p>
          <p className="text-slate-300">• Valorant 5v5 • EA FC 1v1 • SwiftType Blitz • Tech-Art • Photography</p>
          <Link href="/events" className="text-sky-400 hover:underline inline-block mt-1">
            → Click to browse full rules & catalogue
          </Link>
        </div>
      );
    } else if (cleanCmd === 'register') {
      output = (
        <div className="space-y-1 text-xs text-emerald-400">
          <p>Opening registration wizard...</p>
          <Link href="/register" className="text-gold font-bold hover:underline inline-flex items-center gap-1">
            Click here to open registration form <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      );
    } else if (cleanCmd === 'schedule' || cleanCmd === 'dates') {
      output = (
        <div className="space-y-1 text-xs text-slate-300">
          <p className="text-gold font-bold">📅 Fest Dates: Oct 1 – 2, 2026</p>
          <p>• Day 1 (Oct 1): Opening, AI Prompting, Robo Trials, Coding Marathon, Esports Prelims</p>
          <p>• Day 2 (Oct 2): Drone Flights, Project Exhibition, Esports Finals, Gala Award Ceremony</p>
        </div>
      );
    } else if (cleanCmd === 'matrix') {
      output = (
        <div className="space-y-1 text-xs text-slate-300">
          <p><strong className="text-gold">Group A:</strong> Grade 3–4 | <strong className="text-gold">Group B:</strong> Grade 5–6</p>
          <p><strong className="text-gold">Group C:</strong> Grade 7–8 | <strong className="text-gold">Group D:</strong> Grade 9–12 (A2/HSC)</p>
          <p><strong className="text-gold">Group E:</strong> University Students (1st–4th Year)</p>
        </div>
      );
    } else if (cleanCmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (cleanCmd.includes('sudo')) {
      output = (
        <p className="text-gold font-bold text-xs animate-pulse">
          ⚡ Access Granted! Welcome Future Tech Leader. Opening registration...
        </p>
      );
    } else {
      output = (
        <p className="text-rose-400 text-xs">
          Command not recognized: "{cleanCmd}". Type <span className="text-gold font-mono font-bold">help</span> for commands.
        </p>
      );
    }

    setHistory((prev) => [...prev, { cmd: inputVal, output }]);
    setInputVal('');

    // Resume auto-typing after 6 seconds of inactivity
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 6000);
  };

  const handleUserTyping = (val: string) => {
    setInputVal(val);
    setIsUserActive(true);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (!val) {
        setIsUserActive(false);
      }
    }, 8000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-gold/40 bg-surface/95 backdrop-blur-2xl shadow-2xl shadow-gold/10 overflow-hidden text-left font-mono">
      {/* Terminal Titlebar */}
      <div className="px-4 py-3 bg-surface-elevated border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs text-slate-400 ml-2 font-semibold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-gold" /> jtc-carnival-cli@sjis:~
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-gold-light bg-gold/15 px-2 py-0.5 rounded font-bold border border-gold/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE INTERACTIVE SHELL
          </span>
        </div>
      </div>

      {/* Terminal Scrollable Body */}
      <div
        ref={terminalBodyRef}
        className="p-4 sm:p-5 text-xs space-y-3.5 max-h-72 overflow-y-auto custom-scrollbar"
      >
        {history.map((h, i) => (
          <div key={i} className="space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-gold font-bold">guest@jtc:~$</span>
              <span className="text-white font-semibold">{h.cmd}</span>
            </div>
            <div className="pl-4 border-l border-surface-border/50 py-0.5">{h.output}</div>
          </div>
        ))}

        {/* Dynamic Typewriter / Active Input Line */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
          <span className="text-gold font-bold shrink-0">guest@jtc:~$</span>
          <div className="flex-1 flex items-center relative">
            <input
              type="text"
              placeholder={isUserActive ? "Type 'events', 'register', or 'help'..." : ''}
              value={isUserActive ? inputVal : autoText}
              onChange={(e) => handleUserTyping(e.target.value)}
              onFocus={() => setIsUserActive(true)}
              className="w-full bg-transparent text-gold-light placeholder:text-slate-600 focus:outline-none text-xs caret-gold font-mono"
            />
            {/* Blinking realistic cursor */}
            <span className="inline-block w-2 h-4 bg-gold ml-0.5 animate-pulse shrink-0 align-middle" />
          </div>
          <button type="submit" className="text-slate-500 hover:text-gold p-1" title="Execute">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
