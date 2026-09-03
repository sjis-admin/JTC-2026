'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Turnstile } from '@/components/ui/Turnstile';
import { API_BASE, setAdminToken } from '@/lib/api';
import { ShieldCheck, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get('from') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="flex flex-col items-center text-center space-y-2.5">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-surface border border-gold/40 text-gold shadow-lg shadow-gold/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-gold/30 text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" /> RESTRICTED EXECUTIVE GATEWAY
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white font-mono">
            JTC Control Portal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            SJIS Tech Carnival 2026 Executive Authentication
          </p>
        </div>
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
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="w-full space-y-1.5">
            <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password <span className="text-rose-400 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-surface/80 border border-surface-border text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-jtc-cyan focus:ring-1 focus:ring-jtc-cyan transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1"
                tabIndex={-1}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-gold" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Cloudflare Turnstile Bot Defense */}
          <Turnstile onSuccess={(token) => setTurnstileToken(token)} />

          <div className="pt-2">
            <Button variant="glow" type="submit" isLoading={loading} className="w-full font-bold">
              Sign In to Executive Dashboard
            </Button>
          </div>
        </form>
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
