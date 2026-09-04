'use client';

/**
 * AuthGate.tsx — Registration identity gate.
 *
 * Renders before the registration form. The user must either:
 *   1. Sign in with Google (one-click, auto-fills name + email)
 *   2. Continue as Guest (email OTP verification)
 *
 * On success: calls onUnlock(email, name, picture?) to hand off to the form.
 */

import React, { useState, useRef, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import {
  verifyGoogleToken,
  sendGuestOtp,
  verifyGuestOtp,
  storeRegSession,
  AuthSessionResult,
} from '@/lib/api';
import { Mail, ArrowRight, Shield, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

// ─── Email regex (same as in page.tsx) ────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ─── OTP Input — 6 individual digit boxes ─────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, ch: string) => {
    if (!/^\d*$/.test(ch)) return;
    const arr = value.padEnd(6, ' ').split('');
    arr[i] = ch.slice(-1) || ' ';
    const next = arr.join('').trimEnd();
    onChange(next);
    if (ch && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) onChange(pasted);
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-11 h-14 text-center text-xl font-black rounded-xl border-2 bg-slate-800 text-white border-slate-600 focus:border-amber-400 focus:outline-none transition-colors caret-amber-400"
          style={{ caretColor: '#f59e0b' }}
        />
      ))}
    </div>
  );
}

// ─── Inner gate (needs GoogleOAuthProvider context) ───────────────────────────
interface AuthGateInnerProps {
  onUnlock: (email: string, name: string, picture?: string) => void;
}

function AuthGateInner({ onUnlock }: AuthGateInnerProps) {
  const [mode, setMode] = useState<'choice' | 'guest-email' | 'guest-otp'>('choice');
  const [guestEmail, setGuestEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Resend OTP countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ─── Google Login ──────────────────────────────────────────────────────────
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // tokenResponse.access_token — but we need the ID token
      // useGoogleLogin with flow='implicit' gives access_token.
      // We use flow='auth-code' alternative via the credential callback below.
      // This path won't be reached with credential flow.
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed. Please try again.');
      setGoogleLoading(false);
    },
    flow: 'implicit',
  });

  const handleGoogleCredential = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      setError('No credential received from Google. Please try again.');
      setGoogleLoading(false);
      return;
    }
    setGoogleLoading(true);
    setError('');
    try {
      const result: AuthSessionResult = await verifyGoogleToken(credentialResponse.credential);
      storeRegSession(result.session_token);
      onUnlock(result.email, result.name || '', result.picture || '');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── Guest Email Submit ────────────────────────────────────────────────────
  const handleGuestEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const email = guestEmail.trim().toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await sendGuestOtp(email);
      setMode('guest-otp');
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Guest OTP Verify ─────────────────────────────────────────────────────
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.replace(/\s/g, '').length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const result: AuthSessionResult = await verifyGuestOtp(guestEmail.trim().toLowerCase(), otp.trim());
      storeRegSession(result.session_token);
      onUnlock(result.email, '', undefined);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    setOtp('');
    setLoading(true);
    try {
      await sendGuestOtp(guestEmail.trim().toLowerCase());
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
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
            To register for JTC 2026, please verify who you are.<br />
            This keeps your registration secure and spam-free.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-2xl">

          {/* ── Choice screen ─────────────────────────────────────────────── */}
          {mode === 'choice' && (
            <div className="space-y-4">
              {/* Google Button — rendered via @react-oauth/google's renderButton */}
              <div>
                <p className="text-xs text-slate-400 text-center mb-3 uppercase tracking-widest font-semibold">
                  Recommended
                </p>
                <GoogleSignInButton
                  onCredential={handleGoogleCredential}
                  loading={googleLoading}
                  setLoading={setGoogleLoading}
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-xs text-slate-500 font-medium">or</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Guest button */}
              <button
                type="button"
                onClick={() => { setMode('guest-email'); setError(''); }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-600 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 text-sm font-semibold transition-all duration-200 hover:border-slate-500 group"
              >
                <Mail className="w-4.5 h-4.5 text-slate-400 group-hover:text-slate-300 transition-colors" />
                Continue as Guest (Email Verification)
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform ml-auto" />
              </button>

              {/* Security note */}
              <p className="text-center text-xs text-slate-500 pt-2 leading-relaxed">
                🔒 We only use your email to send your confirmation.<br />
                No passwords stored. No social login data saved.
              </p>
            </div>
          )}

          {/* ── Guest email entry ──────────────────────────────────────────── */}
          {mode === 'guest-email' && (
            <form onSubmit={handleGuestEmailSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => { setMode('choice'); setError(''); }}
                  className="text-slate-400 hover:text-slate-200 transition-colors text-sm flex items-center gap-1"
                >
                  ← Back
                </button>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Enter your email</h2>
                <p className="text-slate-400 text-sm">
                  We'll send a 6-digit verification code to your inbox.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  autoFocus
                  value={guestEmail}
                  onChange={(e) => { setGuestEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Send Verification Code
              </button>
            </form>
          )}

          {/* ── OTP verification ──────────────────────────────────────────── */}
          {mode === 'guest-otp' && (
            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/15 border border-green-500/30 mb-3">
                  <Mail className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-white font-bold text-lg mb-1">Check your inbox</h2>
                <p className="text-slate-400 text-sm">
                  We sent a 6-digit code to<br />
                  <span className="text-amber-400 font-semibold">{guestEmail}</span>
                </p>
              </div>

              {/* OTP Digit Boxes */}
              <OtpInput value={otp} onChange={setOtp} />

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.replace(/\s/g, '').length < 6}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Verify & Open Registration Form
              </button>

              {/* Resend + change email */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('guest-email'); setOtp(''); setError(''); }}
                  className="hover:text-slate-300 transition-colors"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || loading}
                  className="flex items-center gap-1 hover:text-slate-300 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          {/* Global error (choice screen) */}
          {mode === 'choice' && error && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
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
// Uses @react-oauth/google's GoogleLogin component for the official styled button.
function GoogleSignInButton({
  onCredential,
  loading,
  setLoading,
}: {
  onCredential: (resp: { credential?: string }) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  // Dynamically import GoogleLogin to avoid SSR issues
  const [GoogleLogin, setGoogleLogin] = useState<any>(null);

  useEffect(() => {
    import('@react-oauth/google').then((mod) => {
      setGoogleLogin(() => mod.GoogleLogin);
    });
  }, []);

  if (!GoogleLogin) {
    return (
      <div className="w-full h-11 rounded-xl bg-slate-800 border border-slate-600 animate-pulse" />
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={(credentialResponse: { credential?: string }) => {
          setLoading(true);
          onCredential(credentialResponse);
        }}
        onError={() => {
          setLoading(false);
          // Error handled by parent via onError prop
        }}
        size="large"
        width="380"
        text="signin_with"
        shape="rectangular"
        theme="filled_black"
        locale="en"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-xl">
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
  if (!GOOGLE_CLIENT_ID) {
    // Fallback: if Google Client ID not configured, go straight to guest flow
    return (
      <GoogleOAuthProvider clientId="placeholder">
        <AuthGateInner onUnlock={onUnlock} />
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthGateInner onUnlock={onUnlock} />
    </GoogleOAuthProvider>
  );
}
