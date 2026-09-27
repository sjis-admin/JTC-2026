'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import QRCodeSVG from '@/components/ui/QRCodeSVG';
import { RegistrationResponse, submitPaymentReference } from '@/lib/api';
import {
  Clock, CheckCircle2, ShieldCheck, Zap, Trash2, ArrowRight,
  ExternalLink, AlertTriangle, Calendar, MapPin, Award, User,
  RefreshCw, Copy, Check, ChevronDown, ChevronUp, Send
} from 'lucide-react';

interface ExistingRegistrationHubProps {
  registration: RegistrationResponse;
  status: 'PENDING' | 'VERIFIED';
  onPayNow: () => Promise<void>;
  onCancelPending: () => Promise<void>;
  onRegisterAnother: () => void;
  isRedirecting: boolean;
  isCancelling: boolean;
}

export default function ExistingRegistrationHub({
  registration: initialRegistration,
  status: initialStatus,
  onPayNow,
  onCancelPending,
  onRegisterAnother,
  isRedirecting,
  isCancelling,
}: ExistingRegistrationHubProps) {
  const [registration, setRegistration] = useState<RegistrationResponse>(initialRegistration);
  const [status, setStatus] = useState<'PENDING' | 'VERIFIED'>(initialStatus);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Manual TrxID Drawer State
  const [showManualPay, setShowManualPay] = useState(false);
  const [manualMethod, setManualMethod] = useState<'BKASH' | 'NAGAD' | 'BANK'>('BKASH');
  const [manualTrxId, setManualTrxId] = useState('');
  const [submittingTrx, setSubmittingTrx] = useState(false);
  const [trxFeedback, setTrxFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Keep internal state in sync with props
  useEffect(() => {
    setRegistration(initialRegistration);
    setStatus(initialStatus);
  }, [initialRegistration, initialStatus]);

  // ─── Live Countdown Hook (24-Hour Hold Window) ──────────────────────────────
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (status !== 'PENDING' || !registration.registered_at) return;

    const calculateRemaining = () => {
      const createdTime = new Date(registration.registered_at).getTime();
      const expiresAt = createdTime + 24 * 60 * 60 * 1000; // 24-hour hold TTL
      const diff = expiresAt - Date.now();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [registration.registered_at, status]);

  const isVerified = status === 'VERIFIED';
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify?code=${registration.short_code}`
    : `https://jtc.sjis.edu.bd/verify?code=${registration.short_code}`;

  const copyShortCode = () => {
    navigator.clipboard.writeText(registration.short_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleManualTrxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTrxId.trim()) return;
    setSubmittingTrx(true);
    setTrxFeedback(null);
    try {
      const res = await submitPaymentReference(
        registration.confirmation_code,
        manualTrxId.trim(),
        manualMethod
      );
      setRegistration(res.registration);
      setTrxFeedback({ type: 'success', message: res.message });
      setManualTrxId('');
    } catch (err: any) {
      setTrxFeedback({ type: 'error', message: err.message || 'Failed to submit transaction reference.' });
    } finally {
      setSubmittingTrx(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* ─── PENDING ORDER / PAY LATER HUB ────────────────────────────────────────── */}
      {!isVerified ? (
        <Card
          glow="gold"
          className="border-amber-500/50 bg-gradient-to-b from-amber-950/25 via-surface-elevated/95 to-surface-elevated/95 backdrop-blur-xl p-5 sm:p-8"
        >
          {/* Header Banner */}
          <div className="flex items-start gap-3.5 sm:gap-4 mb-6 pb-6 border-b border-surface-border">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                  Order Reserved • Pay Later
                </span>
                <button
                  type="button"
                  onClick={copyShortCode}
                  className="text-xs font-mono font-bold text-gold hover:text-white transition-colors inline-flex items-center gap-1 bg-surface px-2 py-0.5 rounded border border-surface-border"
                  title="Click to copy pass code"
                >
                  <span>{registration.short_code}</span>
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Unfinished Registration Found
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                Welcome back, <strong className="text-white">{registration.participant_name}</strong>! Your registration is saved. Complete payment to secure your festival admit card.
              </p>

              {/* Realtime Reservation Timer */}
              {timeLeft && (
                <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface/90 border border-amber-500/30 text-xs text-amber-300 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Spot Reserved for: <strong>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Manifest */}
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-xl bg-surface/90 border border-surface-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Contestant</span>
                <span className="text-white font-bold text-sm block">{registration.participant_name}</span>
                <span className="text-slate-300 block">{registration.participant_grade}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Institution</span>
                <span className="text-white font-medium block truncate">{registration.participant_school}</span>
                <span className="text-slate-400 font-mono text-[11px] block">{registration.participant_phone}</span>
              </div>
            </div>

            {/* Selected Events Breakdown */}
            <div className="p-4 rounded-xl bg-surface/60 border border-surface-border space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Selected Competitions ({registration.registration_events.length})</span>
                <span>Fee</span>
              </div>
              <div className="space-y-2">
                {registration.registration_events.map((ev, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-surface-border/50 last:border-none">
                    <div>
                      <span className="text-white font-semibold">{ev.event.name}</span>
                      {ev.is_team && (
                        <span className="text-[11px] text-gold block">Team: {ev.team_name}</span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-gold">৳{ev.fee_charged}</span>
                  </div>
                ))}
              </div>

              {registration.is_bundle && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 mt-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>5-in-1 Festival Bundle Package Applied (৳1,000)</span>
                </div>
              )}

              <div className="pt-3 border-t border-surface-border flex items-center justify-between text-sm font-bold">
                <span className="text-white">Total Amount Due</span>
                <span className="text-lg font-black text-gold font-mono tracking-wide">
                  ৳{registration.total_fee} BDT
                </span>
              </div>
            </div>

            {/* If a manual reference was previously submitted */}
            {registration.payment_reference && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-2">
                <span>
                  Submitted Reference: <strong className="font-mono text-white">{registration.payment_reference}</strong> ({registration.payment_method})
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  Under Admin Verification
                </span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            {/* Pay Now Button */}
            <Button
              variant="glow"
              size="lg"
              onClick={onPayNow}
              isLoading={isRedirecting}
              className="w-full text-sm sm:text-base font-extrabold shadow-xl shadow-gold/25 py-6 group"
            >
              <Zap className="w-5 h-5 mr-2 text-slate-950 fill-current group-hover:scale-110 transition-transform" />
              {isRedirecting ? 'Redirecting to Payment Gateway...' : `Complete Payment via SSLCommerz (৳${registration.total_fee})`}
            </Button>

            {/* Visual Payment Methods Trust Pills */}
            <div className="text-center pt-1 pb-2">
              <span className="text-[11px] text-slate-400 block mb-1.5">
                Instant verification supported via:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-semibold">
                <span className="px-2 py-0.5 rounded bg-pink-500/15 border border-pink-500/30 text-pink-300">bKash</span>
                <span className="px-2 py-0.5 rounded bg-orange-500/15 border border-orange-500/30 text-orange-300">Nagad</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300">Rocket</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300">VISA</span>
                <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300">Mastercard</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Internet Banking</span>
              </div>
            </div>

            {/* Manual TrxID Collapsible Drawer */}
            <div className="pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setShowManualPay(!showManualPay)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white py-1.5 transition-colors font-medium"
              >
                <span>Paid manually via merchant bKash/Nagad? Submit TrxID</span>
                {showManualPay ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showManualPay && (
                <form onSubmit={handleManualTrxSubmit} className="mt-3 p-4 rounded-xl bg-surface/90 border border-surface-border space-y-3 animate-in fade-in duration-200">
                  <div className="flex gap-2">
                    {(['BKASH', 'NAGAD', 'BANK'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setManualMethod(m)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          manualMethod === m
                            ? 'bg-gold text-slate-950 border-gold'
                            : 'bg-surface border-surface-border text-slate-400 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder={`Enter ${manualMethod} Transaction ID (e.g. BLA123XYZ)`}
                      value={manualTrxId}
                      onChange={(e) => setManualTrxId(e.target.value)}
                      className="text-xs font-mono uppercase"
                    />
                    <Button
                      type="submit"
                      variant="glow"
                      size="sm"
                      isLoading={submittingTrx}
                      className="font-bold text-xs shrink-0"
                    >
                      <Send className="w-3 h-3 mr-1" /> Submit
                    </Button>
                  </div>

                  {trxFeedback && (
                    <div className={`p-2.5 rounded-lg text-xs ${
                      trxFeedback.type === 'success'
                        ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                        : 'bg-rose-950/70 border border-rose-500/50 text-rose-200'
                    }`}>
                      {trxFeedback.message}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Cancel & Start Over Drawer / Prompt */}
            {!showCancelConfirm ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isCancelling || isRedirecting}
                  className="text-slate-400 hover:text-rose-400 font-semibold underline underline-offset-4 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Cancel Order & Choose Different Events
                </button>
                <Link
                  href={`/verify?code=${registration.short_code}`}
                  className="text-slate-400 hover:text-gold font-semibold transition-colors flex items-center gap-1"
                >
                  View Order Status <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-600/60 text-xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2 text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Are you sure?</strong> Cancelling will void pass <span className="font-mono text-white">{registration.short_code}</span> and release your reserved competition spots so you can select new events.
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={isCancelling}
                    className="text-xs"
                  >
                    Keep Order
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={onCancelPending}
                    isLoading={isCancelling}
                    className="text-xs font-bold"
                  >
                    Confirm & Start Fresh
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        /* ─── VERIFIED ENTRY PASS HUB ────────────────────────────────────────────── */
        <Card
          glow="gold"
          className="gradient-border-gold bg-surface-elevated/95 backdrop-blur-xl p-6 sm:p-8"
        >
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Official Gate Pass Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              You&apos;re Officially Registered!
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
              Your registration for SJIS Inter-School Tech Carnival 2026 is confirmed. Present your pass code or QR code at the entrance gate.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface/90 border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-5 mb-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Official Pass Code</span>
              <span className="text-3xl font-black text-gold font-mono tracking-widest text-glow-gold">
                {registration.short_code}
              </span>
              <p className="text-xs text-white font-semibold">{registration.participant_name}</p>
              <p className="text-xs text-slate-400">{registration.participant_school} • {registration.participant_grade}</p>
            </div>
            <div className="flex flex-col items-center">
              <QRCodeSVG value={verifyUrl} size={110} />
              <span className="text-[10px] font-mono text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Gate Scannable
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/verify?code=${registration.short_code}`} className="flex-1">
              <Button variant="glow" size="lg" className="w-full font-bold">
                <ExternalLink className="w-4 h-4 mr-2" /> View & Print Entry Pass
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={onRegisterAnother}
              className="font-semibold text-slate-300 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" /> Register Another Competition / Person
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
