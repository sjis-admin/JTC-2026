'use client';

import React, { useState } from 'react';
import { adminFetch, lookupRegistration, RegistrationResponse } from '@/lib/api';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import QRCodeSVG from '@/components/ui/QRCodeSVG';
import {
  QrCode, Search, CheckCircle2, XCircle, User, Trophy, ShieldCheck, Check, AlertCircle, RefreshCw
} from 'lucide-react';

export default function AdminGateScannerPage() {
  const [codeInput, setCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegistrationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [admitted, setAdmitted] = useState(false);

  const handleScanOrLookup = async (codeToLookup: string) => {
    const clean = codeToLookup.trim();
    if (!clean) return;

    setErrorMsg('');
    setLoading(true);
    setResult(null);
    setAdmitted(false);

    try {
      const data = await lookupRegistration(clean);
      setResult(data);
    } catch (err) {
      setErrorMsg('No registration found with this code. Please check contestant slip.');
    } finally {
      setLoading(false);
    }
  };

  const handleGateAdmit = async () => {
    if (!result) return;
    try {
      await adminFetch(`/admin/registrations/${result.confirmation_code}/update_payment/`, {
        method: 'PATCH',
        body: JSON.stringify({ payment_status: 'VERIFIED', admin_notes: 'Gate Admitted via QR Scanner' }),
      });
      setAdmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-gold/40 text-xs font-mono font-bold text-gold mb-1">
          <QrCode className="w-3.5 h-3.5" /> RECEPTION & GATE CHECK-IN DESK
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Gate Pass Scanner & Attendance
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Scan contestant QR passes or type the 6-character short code to grant entrance kits and verify payments.
        </p>
      </div>

      {/* Lookup Bar */}
      <Card glow="none" className="p-6 border border-gold/40 bg-surface/90 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScanOrLookup(codeInput);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1">
            <Input
              placeholder="Scan QR or enter 6-char code (e.g. A9B4F1)..."
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="text-base font-mono uppercase"
              autoFocus
            />
          </div>
          <Button variant="glow" size="lg" type="submit" isLoading={loading} className="font-bold">
            <Search className="w-4 h-4 mr-1.5" /> Lookup Pass
          </Button>
        </form>
      </Card>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Scanned Result Pass */}
      {result && (
        <div className="gradient-border-gold shadow-2xl shadow-amber-500/15">
          <div className="glass-card rounded-[13px] p-6 sm:p-8 bg-surface-elevated/95 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold font-bold uppercase block">
                  Contestant Verified in Database
                </span>
                <h2 className="text-2xl font-black text-white font-mono">{result.participant_name}</h2>
                <p className="text-sm font-semibold text-slate-300">{result.participant_school}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Confirmation Code</span>
                <span className="text-2xl font-black text-gold font-mono tracking-widest text-glow-gold">
                  {result.short_code}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                <span className="text-slate-400 block font-semibold">Academic Level:</span>
                <span className="text-sm font-bold text-white">{result.participant_grade}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                <span className="text-slate-400 block font-semibold">Mobile Contact:</span>
                <span className="text-sm font-mono font-bold text-white">{result.participant_phone}</span>
              </div>
            </div>

            {/* Registered Competitions */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
                Authorized Competitions ({result.registration_events.length}):
              </span>
              <div className="space-y-1.5">
                {result.registration_events.map((ev, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface border border-surface-border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{ev.event.name}</span>
                      {ev.is_team && (
                        <span className="block text-[11px] text-gold font-semibold">Team: {ev.team_name}</span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-gold">৳{ev.fee_charged}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Admission Bar */}
            <div className="p-4 rounded-xl bg-surface/80 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
              <div>
                <span className="text-slate-400 block">Payment Reference:</span>
                <strong className="text-white uppercase font-bold">{result.payment_method}</strong>
                {result.payment_reference && (
                  <span className="block text-[11px] text-gold font-mono">TrxID: {result.payment_reference}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={admitted || result.payment_status === 'VERIFIED' ? 'gold' : 'champagne'}
                  size="md"
                >
                  {admitted ? 'Admitted at Gate' : result.payment_status_display}
                </Badge>
              </div>
            </div>

            {/* Gate Action */}
            <div className="pt-4 border-t border-surface-border flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setResult(null);
                  setCodeInput('');
                }}
              >
                Clear / Scan Next
              </Button>

              <Button
                variant="glow"
                size="lg"
                onClick={handleGateAdmit}
                disabled={admitted}
                className="font-black"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {admitted ? 'Contestant Admitted ✓' : 'Approve & Handover Contestant Kit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
