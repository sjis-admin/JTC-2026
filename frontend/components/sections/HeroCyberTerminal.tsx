'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ArrowRight, CornerDownLeft, Sparkles, HelpCircle, Trophy, DollarSign, Calendar, MapPin, Gamepad2, Bot, ShieldCheck } from 'lucide-react';
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
        <p className="text-gold font-bold">⚡ 17 Official Competitions Online:</p>
        <p className="text-slate-300">• AI Prompting • Coding Marathon • Robotics & Drone Flight</p>
        <p className="text-slate-300">• Gaming Quiz • Speedcubing • Tech Art Bonanza • SwiftType Blitz</p>
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
    cmd: 'fees --all',
    output: (
      <div className="space-y-0.5 text-slate-300">
        <p className="text-amber-300 font-bold">💳 Entry Fees: ৳200 / ৳300 / ৳500 / ৳1,000</p>
        <p className="text-slate-400">Individual from ৳200 • Team Robotics/Drone (up to 3) ৳1,000 • Valorant (5v5) ৳500</p>
      </div>
    ),
  },
  {
    cmd: 'prizes --overview',
    output: (
      <div className="space-y-0.5 text-slate-300">
        <p className="text-gold-light font-bold">🏆 Champion & Runner-Up Crests across all 17 arenas</p>
        <p className="text-slate-400">Grand "Best Institution Shield" for top school • Certificates for all verified finalists</p>
      </div>
    ),
  },
  {
    cmd: 'matrix --groups',
    output: (
      <div className="space-y-0.5 text-slate-300">
        <p className="text-sky-300 font-bold">🎓 Groups A (Grades 3-4) • B (5-6) • C (7-8) • D (9-12/HSC) • E (University)</p>
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

const QUICK_COMMANDS = [
  { label: 'help', cmd: 'help', icon: <HelpCircle className="w-3 h-3 text-gold" /> },
  { label: 'events', cmd: 'events', icon: <Sparkles className="w-3 h-3 text-amber-400" /> },
  { label: 'fees', cmd: 'fees', icon: <DollarSign className="w-3 h-3 text-emerald-400" /> },
  { label: 'schedule', cmd: 'schedule', icon: <Calendar className="w-3 h-3 text-sky-400" /> },
  { label: 'prizes', cmd: 'prizes', icon: <Trophy className="w-3 h-3 text-gold-light" /> },
  { label: 'esports', cmd: 'esports', icon: <Gamepad2 className="w-3 h-3 text-purple-400" /> },
  { label: 'venue', cmd: 'venue', icon: <MapPin className="w-3 h-3 text-rose-400" /> },
  { label: 'register', cmd: 'register', icon: <ShieldCheck className="w-3 h-3 text-emerald-400" /> },
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
          <p className="text-gold-light">⚡ 17 Competitions Loaded • 5 Academic Groups Active</p>
          <p className="text-sky-300">📍 Venue: SJIS Campus, 97 Asad Avenue, Mohammadpur, Dhaka</p>
          <p className="text-slate-400">
            Type or click <span className="text-gold font-bold font-mono">"help"</span>,{' '}
            <span className="text-gold font-bold font-mono">"fees"</span>,{' '}
            <span className="text-gold font-bold font-mono">"events"</span>, or{' '}
            <span className="text-gold font-bold font-mono">"register"</span>
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
        const delay = 60 + Math.random() * 50;
        currentTimeout = setTimeout(typeNextChar, delay);
      } else {
        currentTimeout = setTimeout(() => {
          setIsTypingAuto(false);
          setHistory((prev) => [
            ...prev.slice(-10),
            { cmd: currentDemo.cmd, output: currentDemo.output },
          ]);
          setAutoText('');
          sequenceIdxRef.current++;

          currentTimeout = setTimeout(() => {
            setIsTypingAuto(true);
          }, 2400);
        }, 600);
      }
    };

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

  // Command Execution Engine
  const executeCommand = (commandString: string) => {
    const cleanCmd = commandString.trim().toLowerCase();
    if (!cleanCmd) return;

    let output: React.ReactNode = null;

    if (cleanCmd === 'help') {
      output = (
        <div className="space-y-2 text-slate-300 text-xs">
          <p className="text-gold font-bold">⚡ SJIS Tech Carnival 2026 — Interactive Shell</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
            <div>
              <span className="text-amber-400 font-bold block mb-0.5">✦ FESTIVAL INTEL:</span>
              <p><span className="text-gold font-bold">events</span> - All 17 arenas & categories</p>
              <p><span className="text-gold font-bold">fees</span> - Entry pricing breakdown (Tk. 200–1000)</p>
              <p><span className="text-gold font-bold">schedule</span> - 2-Day timeline (Oct 1–2, 2026)</p>
              <p><span className="text-gold font-bold">prizes</span> - Champion crests & awards</p>
              <p><span className="text-gold font-bold">venue</span> - Campus location & arena rooms</p>
            </div>
            <div>
              <span className="text-sky-400 font-bold block mb-0.5">✦ ARENAS & LOGISTICS:</span>
              <p><span className="text-gold font-bold">esports</span> - Valorant 5v5 & EAFC rules</p>
              <p><span className="text-gold font-bold">robotics</span> - Line Robot & Drone specs</p>
              <p><span className="text-gold font-bold">matrix</span> - Academic Groups (A to E)</p>
              <p><span className="text-gold font-bold">payment</span> - bKash / SSLCommerz / Cash</p>
              <p><span className="text-gold font-bold">faq</span> - Common contestant inquiries</p>
            </div>
          </div>
          <div className="pt-1.5 border-t border-surface-border flex flex-wrap gap-x-4 text-slate-400 text-[11px]">
            <span><strong className="text-emerald-400">register</strong> : Launch portal wizard</span>
            <span><strong className="text-slate-300">rules</strong> : Open rulebook</span>
            <span><strong className="text-slate-300">whoami</strong> : Contestant badge</span>
            <span><strong className="text-slate-300">clear</strong> : Clear buffer</span>
          </div>
        </div>
      );
    } else if (cleanCmd === 'fees' || cleanCmd === 'pricing' || cleanCmd === 'fees --all') {
      output = (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="text-gold font-bold">💳 Official Registration Fee Schedule:</p>
          <div className="space-y-1 pl-1">
            <p><span className="text-emerald-400 font-bold font-mono">৳200 Tier:</span> AI Prompting • SwiftType Blitz • Photo Editing • Rubik’s Showdown</p>
            <p><span className="text-sky-300 font-bold font-mono">৳300 Tier:</span> Coding Marathon • PowerPoint • Video Making • Tech Quiz • Gaming Quiz • HTML Web • Line Robot • Tech Bytes • Tech Memes • Tech-Art Bonanza • EAFC</p>
            <p><span className="text-amber-400 font-bold font-mono">৳500 Tier:</span> Drone Competition (Individual) • Robo-Showcase (Individual) • Valorant 5v5 (Team of 5)</p>
            <p><span className="text-purple-300 font-bold font-mono">৳1,000 Tier:</span> Drone & Robo-Showcase Team Entry (Up to 3 members)</p>
          </div>
          <p className="text-[11px] text-slate-400 pt-0.5">
            Pay online via instant SSLCommerz (bKash/Nagad/Cards) or manual bKash TrxID during registration.
          </p>
        </div>
      );
    } else if (cleanCmd === 'prizes' || cleanCmd === 'awards' || cleanCmd === 'trophies') {
      output = (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="text-gold font-bold">🏆 Festival Accolades & Trophies:</p>
          <p>• <strong className="text-gold-light">Champion Crests & Gold Medals:</strong> Awarded to top performer/team in all 17 competitions.</p>
          <p>• <strong className="text-slate-200">1st & 2nd Runners-Up:</strong> Silver & Bronze medals + engraved achievement certificates.</p>
          <p>• <strong className="text-sky-400">Grand "Best Institution Shield":</strong> Awarded to the school, college, or university with the highest total medal aggregate.</p>
          <p>• <strong className="text-emerald-400">Participation Certificates:</strong> Digital & physical accreditation for all registered contestants.</p>
        </div>
      );
    } else if (cleanCmd === 'schedule' || cleanCmd === 'dates' || cleanCmd === 'timeline') {
      output = (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="text-gold font-bold">📅 Festival Timeline: Oct 1 – 2, 2026 (2-Day Grand Fest):</p>
          <div className="space-y-1 pl-1">
            <p><strong className="text-sky-300">Day 1 (Oct 1):</strong> Inauguration Ceremony • Coding Marathon • AI Prompting • Line-Robot Qualifying Runs • Gaming Quiz Prelims • Tech-Art Showcase</p>
            <p><strong className="text-amber-300">Day 2 (Oct 2):</strong> Autonomous Drone Flight Trials • Robotics Exhibition • E-Sports Stage Finals (Valorant & EAFC) • Grand Award Ceremony & Shield Distribution</p>
          </div>
        </div>
      );
    } else if (cleanCmd === 'venue' || cleanCmd === 'map' || cleanCmd === 'location') {
      output = (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="text-rose-400 font-bold">📍 Campus Headquarters & Arena Map:</p>
          <p className="text-white font-semibold">St. Joseph International School (SJIS Campus)</p>
          <p className="text-slate-400">97 Asad Avenue, Mohammadpur, Dhaka - 1207, Bangladesh</p>
          <div className="pt-1 text-[11px] space-y-0.5 text-slate-300">
            <p>• <strong>Main Auditorium:</strong> Opening, Stage Finals & Gala Prize Distribution</p>
            <p>• <strong>Computer Labs (Level 3 & 4):</strong> Coding Marathon, AI Prompting, Web Creation, SwiftType</p>
            <p>• <strong>Outdoor Grounds & Gym:</strong> Autonomous Drone Flight Cage & Robotics Arena</p>
          </div>
        </div>
      );
    } else if (cleanCmd === 'esports' || cleanCmd === 'gaming') {
      output = (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="text-purple-400 font-bold">🎮 E-Sports Arena Specifications:</p>
          <p>• <strong className="text-white">Valorant (PC 5v5):</strong> Single elimination bracket leading to BO3 LAN Finals. Entry: ৳500 per team. Bring your own peripherals (mouse/headset) recommended.</p>
          <p>• <strong className="text-white">EA Sports FC (Console):</strong> 1v1 knockout tournament on official gaming consoles. Entry: ৳300 per individual.</p>
          <p>• <strong className="text-white">Gaming Quiz:</strong> General video game lore, esports history, and pop culture trivia.</p>
        </div>
      );
    } else if (cleanCmd === 'robotics' || cleanCmd === 'drone') {
      output = (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="text-sky-400 font-bold">🤖 Robotics & Drone Flight Regulations:</p>
          <p>• <strong className="text-white">Line Follower Robot:</strong> Maximum chassis dimensions 25 × 25 × 25 cm. Autonomous sensor-based navigation on high-contrast black track. Entry: ৳300.</p>
          <p>• <strong className="text-white">Drone Competition:</strong> Custom DIY or modified quadcopter flight obstacle course. Manual or autonomous navigation inside safety cage. Entry: ৳500 (Indiv) / ৳1,000 (Team of 3).</p>
          <p>• <strong className="text-white">Robo Showcase:</strong> Display innovative IoT, robotics, and automation hardware prototypes to official jury.</p>
        </div>
      );
    } else if (cleanCmd === 'matrix' || cleanCmd === 'groups' || cleanCmd === 'eligibility') {
      output = (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="text-gold font-bold">🎓 Academic Division Matrix (5 Groups):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1">
            <p><strong className="text-gold">Group A:</strong> Grades 3 – 4 (Junior Explorers)</p>
            <p><strong className="text-gold">Group B:</strong> Grades 5 – 6 (Middle School)</p>
            <p><strong className="text-gold">Group C:</strong> Grades 7 – 8 (High School Prep)</p>
            <p><strong className="text-gold">Group D:</strong> Grades 9 – 12 / O & A-Levels / HSC</p>
            <p className="sm:col-span-2"><strong className="text-gold">Group E:</strong> University Students (1st–4th Year, selected arenas)</p>
          </div>
        </div>
      );
    } else if (cleanCmd === 'faq') {
      output = (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="text-gold font-bold">💡 Frequently Asked Questions:</p>
          <p><strong>Q: Can I participate in multiple events?</strong><br /><span className="text-slate-400">A: Yes! You can select any number of events as long as their timeslots don't overlap.</span></p>
          <p><strong>Q: Can students from other schools/colleges participate?</strong><br /><span className="text-slate-400">A: Absolutely. JTC Tech Carnival 2026 is an open nationwide inter-school & college festival.</span></p>
          <p><strong>Q: How do I get my gate entry pass?</strong><br /><span className="text-slate-400">A: Immediately upon payment verification, a digital QR pass is generated for your phone or print.</span></p>
        </div>
      );
    } else if (cleanCmd === 'contact' || cleanCmd === 'helpdesk' || cleanCmd === 'support') {
      output = (
        <div className="space-y-1 text-xs text-slate-300">
          <p className="text-gold font-bold">📞 Josephite Tech Club Secretariat:</p>
          <p>• Email: <span className="text-white font-mono">info@sjis.edu.bd</span> / <span className="text-white font-mono">jtc@sjis.edu.bd</span></p>
          <p>• Campus Helpdesk: St. Joseph International School Reception Desk</p>
          <p>• Portal Technical Support: Available 24/7 during registration period</p>
        </div>
      );
    } else if (cleanCmd === 'payment' || cleanCmd === 'bkash' || cleanCmd === 'nagad') {
      output = (
        <div className="space-y-1 text-xs text-slate-300">
          <p className="text-emerald-400 font-bold">💳 Payment & Verification Methods:</p>
          <p>• <strong>Instant SSLCommerz:</strong> Automatic instant confirmation via bKash, Nagad, Rocket, Visa, Mastercard, or Internet Banking.</p>
          <p>• <strong>Manual bKash / Nagad:</strong> Send Money to the official merchant number and submit your TrxID in the registration form.</p>
          <p>• <strong>SMS Confirmation:</strong> Receive your confirmation code immediately upon verification.</p>
        </div>
      );
    } else if (cleanCmd === 'whoami') {
      output = (
        <div className="space-y-0.5 text-xs text-slate-300 font-mono">
          <p><span className="text-gold font-bold">Identity:</span> Guest Competitor #2026</p>
          <p><span className="text-gold font-bold">Security Level:</span> Authorized Participant</p>
          <p><span className="text-gold font-bold">Objective:</span> Champion Trophy</p>
          <p><span className="text-emerald-400 font-bold">Status:</span> Registration Ready ➔ Type <span className="text-gold underline font-bold">"register"</span> to enroll!</p>
        </div>
      );
    } else if (cleanCmd === 'banner' || cleanCmd === 'ascii' || cleanCmd === 'logo') {
      output = (
        <pre className="text-[10px] sm:text-xs leading-none text-gold font-mono py-1 overflow-x-auto select-none">
{`   ___ _____ ___   ___   ___ ___   __ 
  |_  |_   _/ __| |_  ) / _ \\_  ) / / 
 _/ /   | || (__   / / | (_) / / / _ \\
|___/   |_| \\___| /___(_)___/___|\\___/
  Josephite Tech Club • SJIS Tech Fest`}
        </pre>
      );
    } else if (cleanCmd === 'rules' || cleanCmd === 'rulebook') {
      output = (
        <div className="space-y-1 text-xs">
          <p className="text-gold font-bold">📖 Official Carnival Rulebook (17 Arenas):</p>
          <p className="text-slate-300">• Complete rules, submission specs & guidelines for all segments</p>
          <p className="text-slate-300">• Assigned PowerPoint presentation topics for Groups A to D</p>
          <p className="text-slate-300">• Line-Robot (25×25×25cm) and Drone flight zone regulations</p>
          <Link href="/rulebook" className="text-gold font-bold hover:underline inline-flex items-center gap-1 mt-1">
            → Open Full Interactive Rulebook Compendium <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      );
    } else if (cleanCmd === 'events' || cleanCmd === 'events --all' || cleanCmd === 'competitions') {
      output = (
        <div className="space-y-1 text-xs">
          <p className="text-gold font-bold">🔥 17 Competitions Registered:</p>
          <p className="text-slate-300">• AI Prompting • Coding Marathon • Drone Competition • Robo Showcase</p>
          <p className="text-slate-300">• Gaming Quiz • Speedcubing • SwiftType Blitz • Tech-Art • Photography</p>
          <p className="text-slate-300">• Line Robot • PowerPoint • Video Making • Tech Bytes • Tech Memes • E-Sports</p>
          <Link href="/events" className="text-sky-400 hover:underline inline-block mt-1 font-bold">
            → Click to browse complete event catalogue & syllabus
          </Link>
        </div>
      );
    } else if (cleanCmd === 'register') {
      output = (
        <div className="space-y-1 text-xs text-emerald-400">
          <p className="font-bold">Opening registration wizard...</p>
          <Link href="/register" className="text-gold font-bold hover:underline inline-flex items-center gap-1">
            Click here to open registration form <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      );
    } else if (cleanCmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (cleanCmd.includes('sudo')) {
      output = (
        <p className="text-gold font-bold text-xs animate-pulse">
          ⚡ [ROOT PRIVILEGES ACTIVATED] Welcome Future Tech Champion. Claim your entry badge today!
        </p>
      );
    } else {
      output = (
        <p className="text-rose-400 text-xs">
          Command not recognized: "{cleanCmd}". Type <span className="text-gold font-mono font-bold">help</span> or tap the quick pills above.
        </p>
      );
    }

    setHistory((prev) => [...prev, { cmd: commandString, output }]);
    setInputVal('');

    // Resume auto-typing after 8 seconds of inactivity
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 8000);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
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

  const handleChipClick = (cmd: string) => {
    setIsUserActive(true);
    executeCommand(cmd);
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

      {/* Quick Action Command Chips for Tap Discovery */}
      <div className="px-4 py-2 bg-surface border-b border-surface-border/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] select-none">
        <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 mr-1">
          Quick Cmds:
        </span>
        {QUICK_COMMANDS.map((qc) => (
          <button
            key={qc.cmd}
            type="button"
            onClick={() => handleChipClick(qc.cmd)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-gold/20 text-slate-300 hover:text-gold border border-surface-border hover:border-gold/50 transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            {qc.icon}
            <span>{qc.label}</span>
          </button>
        ))}
      </div>

      {/* Terminal Scrollable Body */}
      <div
        ref={terminalBodyRef}
        className="p-4 sm:p-5 text-xs space-y-3.5 max-h-72 sm:max-h-80 overflow-y-auto custom-scrollbar"
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
              placeholder={isUserActive ? "Type 'fees', 'schedule', 'prizes' or 'help'..." : ''}
              value={isUserActive ? inputVal : autoText}
              onChange={(e) => handleUserTyping(e.target.value)}
              onFocus={() => setIsUserActive(true)}
              className="w-full bg-transparent text-gold-light placeholder:text-slate-600 focus:outline-none text-xs caret-gold font-mono"
            />
            {/* Blinking realistic cursor */}
            <span className="inline-block w-2 h-4 bg-gold ml-0.5 animate-pulse shrink-0 align-middle" />
          </div>
          <button type="submit" className="text-slate-500 hover:text-gold p-1 cursor-pointer transition-colors" title="Execute">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
