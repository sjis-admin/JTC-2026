'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Turnstile } from '@/components/ui/Turnstile';
import { API_BASE, setAdminToken } from '@/lib/api';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get('from') || '/admin';

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          turnstile_token: turnstileToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.non_field_errors?.[0] || 'Invalid username or password');
      }

      setAdminToken(data.access);
      router.push(fromUrl);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-surface border border-gold/40 text-gold shadow-lg shadow-gold/20 mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-gold/30 text-[10px] font-mono font-bold text-gold uppercase tracking-wider block mx-auto w-fit">
          <Sparkles className="w-3 h-3" /> RESTRICTED EXECUTIVE GATEWAY
        </div>
        <h1 className="text-2xl font-extrabold text-white font-mono">
          JTC Control Portal
        </h1>
        <p className="text-xs text-slate-400">
          SJIS Tech Carnival 2026 Executive Authentication
        </p>
      </div>

      <Card glow="gold" className="border border-surface-border bg-surface-elevated/90">
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {fromUrl !== '/admin' && (
            <div className="p-2.5 rounded-lg bg-surface border border-surface-border text-[11px] text-gold-light flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Authentication required to access requested executive panel.</span>
            </div>
          )}

          <Input
            label="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Cloudflare Turnstile Bot Defense */}
          <Turnstile onSuccess={(token) => setTurnstileToken(token)} />

          <div className="pt-2">
            <Button variant="glow" type="submit" isLoading={loading} className="w-full font-bold">
              Sign In to Executive Dashboard
            </Button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-surface-border text-center text-[11px] text-slate-500">
          Default credentials: <code className="text-slate-400">admin</code> / <code className="text-slate-400">admin123</code>
        </div>
      </Card>
    </div>
  );
}

export default function SecureGatewayPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background cyber-grid">
      <Suspense fallback={<div className="text-gold font-mono text-xs">Verifying Gateway Credentials...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
