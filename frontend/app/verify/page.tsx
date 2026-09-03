'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import QRCodeSVG from '@/components/ui/QRCodeSVG';
import { lookupRegistration, RegistrationResponse } from '@/lib/api';
import { Search, CheckCircle2, XCircle, Clock, ShieldCheck, Printer, ArrowRight, Sparkles, QrCode } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');

  const [searchCode, setSearchCode] = useState(codeParam || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegistrationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLookup = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setErrorMsg('');
    setLoading(true);
    setResult(null);

    try {
      const data = await lookupRegistration(codeToSearch.trim());
      setResult(data);
    } catch (err: any) {
      setErrorMsg('No registration found with this confirmation code. Please double-check your code.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codeParam) {
      handleLookup(codeParam);
    }
  }, [codeParam]);

  const verifyUrl = typeof window !== 'undefined' ? window.location.href : `https://jtc.sjis.edu.bd/verify?code=${searchCode}`;

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-gold/40 text-xs font-semibold text-gold">
          <ShieldCheck className="w-3.5 h-3.5" /> Official Verification Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Verify Contestant Entry Pass
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Enter your Pass Code (e.g. <strong className="text-gold font-mono">JTC260001</strong>) or full confirmation code to check verification & entry status.
        </p>
      </div>

      {/* Search Bar */}
      <Card glow="none" className="p-6 mb-8 border border-surface-border bg-surface-elevated/90 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup(searchCode);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1">
            <Input
              placeholder="e.g. JTC260001"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="text-base font-mono uppercase"
            />
          </div>
          <Button variant="glow" size="lg" isLoading={loading} type="submit" className="font-bold">
            <Search className="w-4 h-4 mr-1.5" /> Verify Status
          </Button>
        </form>
      </Card>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-600 text-rose-300 text-xs sm:text-sm flex items-center gap-2 mb-6">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="gradient-border-gold shadow-2xl shadow-amber-500/15">
          <div className="glass-card rounded-[13px] p-6 sm:p-8 bg-surface-elevated/95 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold font-bold uppercase block">
                  Status: Verified in Database
                </span>
                <h2 className="text-xl font-black text-white font-mono">{result.participant_name}</h2>
                <p className="text-xs text-slate-300">{result.participant_school}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Pass Code</span>
                <span className="text-2xl font-black text-gold font-mono tracking-widest text-glow-gold">
                  {result.short_code}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-2 space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Academic Level</span>
                  <span className="text-sm font-bold text-white">{result.participant_grade}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Contact Email & Phone</span>
                  <span className="text-xs font-mono text-slate-200 block">{result.participant_email}</span>
                  <span className="text-xs font-mono text-slate-200 block">{result.participant_phone}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface border border-gold/40 text-center space-y-2">
                <QRCodeSVG value={verifyUrl} size={110} />
                <span className="text-[10px] font-mono text-gold-light font-bold flex items-center gap-1">
                  <QrCode className="w-3 h-3" /> Gate Scannable
                </span>
              </div>
            </div>

            {/* Registered Events */}
            <div className="pt-4 border-t border-surface-border space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
                Registered Events ({result.registration_events.length}):
              </span>
              <div className="space-y-2">
                {result.registration_events.map((ev, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface border border-surface-border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">{ev.event.name}</span>
                      {ev.is_team && (
                        <span className="block text-[11px] text-gold mt-0.5">Team: {ev.team_name}</span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-gold">৳{ev.fee_charged}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Status */}
            <div className="p-4 rounded-xl bg-surface/80 border border-surface-border flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Payment:</span>
                <span className="text-white font-bold uppercase">{result.payment_method}</span>
                {result.payment_reference && (
                  <span className="block text-[10px] text-slate-300 font-mono">Trx: {result.payment_reference}</span>
                )}
              </div>
              <Badge
                variant={result.payment_status === 'VERIFIED' ? 'gold' : result.payment_status === 'REJECTED' ? 'red' : 'champagne'}
                size="md"
              >
                {result.payment_status_display}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-white font-mono">Loading verification...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
