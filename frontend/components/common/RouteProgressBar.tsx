'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    setVisible(true);
    setProgress(20);

    // Trickle progress gradually up to 85%
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 85;
        }
        // Ease the increments as progress grows
        const diff = Math.max(1, (85 - prev) * 0.15);
        return prev + diff;
      });
    }, 150);
  };

  const completeProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setProgress(100);
    finishTimerRef.current = setTimeout(() => {
      setVisible(false);
      // Reset width back to 0 after fade-out transition finishes
      setTimeout(() => setProgress(0), 250);
    }, 200);
  };

  // Complete progress on route/search changes
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  // Intercept internal link clicks and history popstate
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Don't trigger if modifier keys are pressed (e.g. open in new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      const target = anchor.getAttribute('target');
      if (target === '_blank') return;

      // Ignore external links, mailto, tel, downloads
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      // Check if target is same page/hash
      const currentUrl = window.location.pathname + window.location.search;
      const cleanHref = href.split('#')[0];
      if (cleanHref === currentUrl || cleanHref === '') {
        return;
      }

      startProgress();
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[2px] sm:h-[2.5px] overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-gold via-amber-400 to-yellow-200 transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transitionProperty: 'width, opacity',
          transitionDuration: progress === 100 ? '200ms, 300ms' : '350ms, 150ms',
        }}
      >
        {/* Soft golden cyber glow tip */}
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/40 shadow-[0_0_10px_#F5B700,0_0_4px_#FDE047]" />
      </div>
    </div>
  );
}

export default RouteProgressBar;
