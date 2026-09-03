'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Keyboard, Trophy, RotateCcw, Zap, Sparkles, ArrowRight, CheckCircle2, Flame, Award
} from 'lucide-react';

const SAMPLE_TEXT = "Josephite Tech Club invites the sharpest minds to innovate, code algorithms, build autonomous robots, and master generative artificial intelligence at St. Joseph International School.";

export default function MiniGamification() {
  const [typedText, setTypedText] = useState('');
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [finished, setFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const startTest = () => {
    setStarted(true);
    setFinished(false);
    setTimeLeft(15);
    setTypedText('');
    setWpm(0);
    setAccuracy(100);
    setTimeout(() => inputRef.current?.focus(), 50);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!started || finished) return;
    const value = e.target.value;
    setTypedText(value);

    // Calculate current WPM & Accuracy
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    const timeSpent = (15 - timeLeft) / 60 || 0.1;
    setWpm(Math.round(words / timeSpent));

    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === SAMPLE_TEXT[i]) correctChars++;
    }
    const acc = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
    setAccuracy(acc);

    if (value.length >= SAMPLE_TEXT.length) {
      clearInterval(timerRef.current!);
      setFinished(true);
    }
  };

  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setFinished(false);
    setTypedText('');
    setTimeLeft(15);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="gradient-border-gold shadow-2xl shadow-amber-500/10">
        <div className="glass-card rounded-[13px] p-6 sm:p-10 bg-surface-elevated/95 backdrop-blur-2xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-mono font-bold border border-gold/40">
                <Flame className="w-3.5 h-3.5 text-gold" /> INTERACTIVE ARENA PREVIEW
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                SwiftType Blitz 15s Warmup Challenge
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Test your typing velocity before the official Monkeytype Lab Championship at SJIS.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-surface border border-gold/40 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 font-mono block">TIME</span>
                <span className="text-xl font-mono font-black text-gold">{timeLeft}s</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-gold/40 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 font-mono block">WPM</span>
                <span className="text-xl font-mono font-black text-emerald-400">{wpm}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-gold/40 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 font-mono block">ACC</span>
                <span className="text-xl font-mono font-black text-sky-400">{accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Sample Target Text Display */}
          <div className="p-5 rounded-2xl bg-surface/90 border border-surface-border font-mono text-sm sm:text-base leading-relaxed tracking-wide select-none">
            {SAMPLE_TEXT.split('').map((char, index) => {
              let color = 'text-slate-500';
              if (index < typedText.length) {
                color = typedText[index] === char ? 'text-gold font-bold bg-gold/10' : 'text-rose-400 bg-rose-950/40 underline';
              }
              return (
                <span key={index} className={color}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Interactive Typing Input */}
          <div className="relative">
            {!started && !finished ? (
              <div className="p-8 rounded-2xl bg-surface/70 border border-dashed border-gold/50 text-center space-y-3">
                <Keyboard className="w-10 h-10 text-gold mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">Ready to test your typing speed?</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click below to start the 15-second countdown and type the text above as fast as possible.
                </p>
                <Button variant="glow" size="lg" onClick={startTest} className="px-8">
                  Start 15s Challenge
                </Button>
              </div>
            ) : finished ? (
              <div className="p-6 rounded-2xl bg-surface/90 border border-gold text-center space-y-4 animate-in zoom-in-95 duration-200">
                <Trophy className="w-12 h-12 text-gold mx-auto" />
                <h4 className="text-2xl font-black text-white font-display">
                  Challenge Completed! Result: <span className="text-gold font-mono">{wpm} WPM</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Accuracy: <strong className="text-sky-300">{accuracy}%</strong> • Top 3 contestants in the Computer Lab will be awarded official Medals & Prizes!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button variant="secondary" size="md" onClick={resetTest}>
                    <RotateCcw className="w-4 h-4 mr-1.5" /> Try Again
                  </Button>
                  <Link href="/register?event=4">
                    <Button variant="glow" size="md">
                      Register For SwiftType Blitz (৳200) <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <textarea
                ref={inputRef}
                rows={3}
                value={typedText}
                onChange={handleTyping}
                placeholder="Start typing the text above here..."
                className="w-full p-4 rounded-2xl bg-surface-elevated border border-gold text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-inner"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
