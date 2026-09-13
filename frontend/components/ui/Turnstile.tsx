'use client';

import React, { useEffect, useRef } from 'react';

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: (error: any) => void;
  onExpire?: () => void;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: (err: any) => void;
          'expired-callback'?: () => void;
          theme?: 'dark' | 'light' | 'auto';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export function Turnstile({
  onSuccess,
  onError,
  onExpire,
  className = '',
  theme = 'dark',
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const hasBypassedRef = useRef(false);

  // Keep callback refs stable to prevent infinite re-render loops
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const isEnabled = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === 'true';
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x0000000000000000000000000000000AA';

  useEffect(() => {
    // Development / local server bypass - run strictly once
    if (!isEnabled) {
      if (!hasBypassedRef.current) {
        hasBypassedRef.current = true;
        onSuccessRef.current('dev-bypass-token');
      }
      return;
    }

    // Load Cloudflare Turnstile script dynamically if not present
    let script = document.querySelector('script[src*="turnstile"]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => onSuccessRef.current(token),
            'error-callback': (err: any) => onErrorRef.current && onErrorRef.current(err),
            'expired-callback': () => onExpireRef.current && onExpireRef.current(),
            theme: theme,
          });
        } catch (e) {
          console.warn('Turnstile render error:', e);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore cleanup error
        }
        widgetIdRef.current = null;
      }
    };
  }, [isEnabled, siteKey, theme]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={`flex justify-center my-3 ${className}`}>
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-surface-border bg-surface/50 p-1" />
    </div>
  );
}

export default Turnstile;
