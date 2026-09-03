'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string; // ISO format
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isFinished: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const items = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-5 w-full">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center flex-1 max-w-[85px]">
          <div className="w-full h-14 sm:h-18 md:h-22 rounded-xl sm:rounded-2xl bg-surface/90 border border-gold/40 flex items-center justify-center shadow-lg shadow-gold/10 relative overflow-hidden backdrop-blur-md group hover:border-gold transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />
            <span className="text-xl sm:text-2xl md:text-3xl font-black text-white font-mono tracking-tight text-glow-gold">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gold-light mt-1.5 sm:mt-2 tracking-widest uppercase">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
