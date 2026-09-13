'use client';

import React from 'react';

export interface TurnstileProps {
  onSuccess?: (token: string) => void;
  onError?: (error: any) => void;
  onExpire?: () => void;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
}

/**
 * Inert stub: Cloudflare Turnstile has been decommissioned in favor of Google OAuth
 * and Edge Middleware security guards.
 */
export function Turnstile({ onSuccess }: TurnstileProps) {
  React.useEffect(() => {
    if (onSuccess) {
      onSuccess('bypassed');
    }
  }, [onSuccess]);

  return null;
}

export default Turnstile;
