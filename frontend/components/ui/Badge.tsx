import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'champagne' | 'navy' | 'cyan' | 'teal' | 'red' | 'purple' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'gold',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    gold: 'bg-gold/15 text-gold border border-gold/40 shadow-sm shadow-gold/10 font-bold',
    champagne: 'bg-amber-100/10 text-gold-light border border-gold-light/30 font-semibold',
    navy: 'bg-sjis-royal text-slate-200 border border-surface-border font-semibold',
    cyan: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    teal: 'bg-teal-500/15 text-teal-300 border border-teal-500/30',
    red: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    neutral: 'bg-surface-elevated text-slate-300 border border-surface-border',
    outline: 'bg-transparent text-slate-400 border border-surface-border',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-medium tracking-wide',
    md: 'text-xs px-3 py-1 rounded-full font-semibold tracking-wide',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1 uppercase',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
