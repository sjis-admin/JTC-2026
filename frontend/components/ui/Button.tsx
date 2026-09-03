import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'glow' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-extrabold hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-[0.98]',
      glow: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black hover:shadow-amber-400/50 hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all border border-amber-300/40',
      gold: 'bg-gradient-to-r from-gold via-gold-light to-gold text-slate-950 font-black hover:brightness-110 shadow-lg shadow-gold/30 active:scale-[0.98] border border-gold/40',
      secondary: 'bg-surface-elevated text-gold-light border border-gold/40 hover:border-gold hover:bg-surface hover:text-white active:scale-[0.98]',
      outline: 'bg-transparent border border-gold/70 text-gold-light hover:bg-gold/10 hover:text-white active:scale-[0.98]',
      danger: 'bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold hover:brightness-110 active:scale-[0.98]',
      ghost: 'bg-transparent text-slate-300 hover:text-gold-light hover:bg-white/5 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
      lg: 'px-6 py-3 text-sm sm:text-base rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
