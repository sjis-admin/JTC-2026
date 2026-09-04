'use client';

/**
 * AuthGate.tsx — Registration identity gate.
 *
 * Exclusively uses Google Sign-In for instant, secure authentication.
 * Automatically verifies identity and pre-fills name and email in the registration form.
 *
 * On success: calls onUnlock(email, name, picture?) to hand off to the form.
 */

import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  verifyGoogleToken,
  storeRegSession,
  AuthSessionResult,
} from '@/lib/api';
import { Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '557068883318-78gk6amnr0fsm75nnslh9n5pq2mrnkn2.apps.googleusercontent.com';

// ─── Inner gate (runs within GoogleOAuthProvider context) ─────────────────────
interface AuthGateInnerProps {
  onUnlock: (email: string, name: string, picture?: string) => void;
}

function AuthGateInner({ onUnlock }: AuthGateInnerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleCredential = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      setError('No credential received from Google. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result: AuthSessionResult = await verifyGoogleToken(credentialResponse.credential);
      storeRegSession(result.session_token);
      onUnlock(result.email, result.name || '', result.picture || '');
    } catch (err: any) {
      setError(err.message || 'Google sign-in verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-950">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 mb-4 shadow-lg shadow-amber-500/10">
            <Shield className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
            Verify Your Identity
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Please sign in with your Google account to access the JTC 2026 registration form.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 overflow-hidden">
          {/* Sign In Button Area */}
          <div className="w-full flex justify-center">
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              loading={loading}
              setLoading={setLoading}
            />
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Benefits / Security info */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Instant one-click access with your student or personal email</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Automatically fills in your name and email to save time</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Prevents automated bot spam and ensures secure passes</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-6">
          SJIS Inter-School Tech Carnival 2026 &middot; Secure Registration Portal
        </p>
      </div>
    </div>
  );
}

// ─── Google Sign-In Button wrapper ────────────────────────────────────────────
function GoogleSignInButton({
  onCredential,
  loading,
  setLoading,
}: {
  onCredential: (resp: { credential?: string }) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [GoogleLogin, setGoogleLogin] = useState<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<string>('280');

  useEffect(() => {
    import('@react-oauth/google').then((mod) => {
      setGoogleLogin(() => mod.GoogleLogin);
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        if (clientWidth > 0) {
          // Google GSI button width must be between 200 and 400 pixels
          const clamped = Math.min(380, Math.max(200, clientWidth));
          setButtonWidth(String(Math.floor(clamped)));
        }
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!GoogleLogin) {
    return (
      <div className="w-full h-11 rounded-xl bg-slate-800 border border-slate-600 animate-pulse" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center items-center overflow-hidden min-h-[44px]"
    >
      <GoogleLogin
        key={buttonWidth}
        onSuccess={(credentialResponse: { credential?: string }) => {
          setLoading(true);
          onCredential(credentialResponse);
        }}
        onError={() => {
          setLoading(false);
        }}
        size="large"
        width={buttonWidth}
        text="continue_with"
        shape="rectangular"
        theme="filled_black"
        locale="en"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-lg z-10">
          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
        </div>
      )}
    </div>
  );
}

// ─── Public export (wraps with GoogleOAuthProvider) ───────────────────────────
export interface AuthGateProps {
  onUnlock: (email: string, name: string, picture?: string) => void;
}

export default function AuthGate({ onUnlock }: AuthGateProps) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthGateInner onUnlock={onUnlock} />
    </GoogleOAuthProvider>
  );
}
