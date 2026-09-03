import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: 'cyan' | 'teal' | 'gold' | 'none';
}

export function Card({
  className,
  hover = true,
  glow = 'none',
  children,
  ...props
}: CardProps) {
  const glowStyles = {
    none: '',
    cyan: 'hover:border-jtc-cyan/50 hover:shadow-cyan-500/10 hover:shadow-xl',
    teal: 'hover:border-jtc-teal/50 hover:shadow-teal-500/10 hover:shadow-xl',
    gold: 'hover:border-amber-400/50 hover:shadow-amber-400/10 hover:shadow-xl',
  };

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 transition-all duration-300 relative overflow-hidden',
        hover && 'hover:-translate-y-1',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl font-bold text-white tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-slate-400 leading-relaxed mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-surface-border flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}
