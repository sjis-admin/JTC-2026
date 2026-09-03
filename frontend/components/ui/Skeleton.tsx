import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'gold' | 'card' | 'circle';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-surface-elevated/70 relative overflow-hidden',
        variant === 'gold' && 'bg-gold/10 border border-gold/20',
        variant === 'card' && 'bg-surface/80 border border-surface-border/60 rounded-2xl',
        variant === 'circle' && 'rounded-full',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export default Skeleton;
