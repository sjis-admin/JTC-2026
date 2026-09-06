'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { lookupRegistration, initiateSSLCommerzPayment, RegistrationResponse } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import QRCodeSVG from '@/components/ui/QRCodeSVG';
import {
  CheckCircle2, Printer, ArrowRight, ShieldCheck, Mail, Phone, Calendar,
  MapPin, QrCode, Download, FileText, Sparkles, Building2, User, Award, Check,
  Lock, AlertCircle, Clock, Zap, AlertTriangle
} from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [data, setData] = useState<RegistrationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryingPayment, setRetryingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'pass' | 'receipt'>('pass');

  const paymentParam = searchParams.get('payment');
  const paymentMethodParam = searchParams.get('method');

  useEffect(() => {
    if (code) {
      lookupRegistration(code)
        .then((res) => {
          setData(res);
          // Only trigger celebratory confetti if payment is genuinely verified or total fee is 0
          if (res.payment_status === 'VERIFIED' || res.total_fee === 0) {
            try {
              confetti({
                particleCount: 140,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#F5B700', '#FFE58F', '#0052CC', '#353f4aff', '#10B981'],
              });
            } catch (e) {}
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [code]);

  if (loading) {
    return (
      <div className="pt-36 text-center text-slate-300 font-mono space-y-3">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Verifying registration and payment status...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-36 text-center text-slate-300 space-y-4 font-mono">
        <p>Registration details not found.</p>
        <Link href="/">
          <Button variant="secondary">Go to Home</Button>
        </Link>
      </div>
    );
  }

  const isVerified = data.payment_status === 'VERIFIED' || data.total_fee === 0;

  const handleRetryPayment = async () => {
    if (!data) return;
    setRetryingPayment(true);
    try {
      const res = await initiateSSLCommerzPayment(data.confirmation_code);
      if (res.gateway_url) {
        window.location.href = res.gateway_url;
      } else {
        alert('Could not initiate payment gateway session. Please contact organizers.');
      }
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed.');
    } finally {
      setRetryingPayment(false);
    }
  };

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify?code=${data.confirmation_code}`
    : `https://jtc.sjis.edu.bd/verify?code=${data.confirmation_code}`;

  const handlePrint = () => {
    if (!isVerified) {
      alert('Contestant Entry Pass and official receipt can only be printed after payment is verified.');
      return;
    }
    window.print();
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Top Interactive Status Banner */}
      <div className="print:hidden space-y-6">
        {/* State 1: Payment Successfully Verified */}
        {isVerified && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 shadow-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block text-sm">🎉 Payment Verified Successfully!</span>
              <span>Your entry fee of ৳{data.total_fee} BDT was authenticated. Your official contestant admit card and festival payment receipt are issued.</span>
            </div>
          </div>
        )}

        {/* State 2: Payment Cancelled or Incomplete via SSLCommerz */}
        {!isVerified && (paymentParam === 'cancelled' || paymentParam === 'failed' || data.payment_method === 'SSLCOMMERZ') && (
          <div className="p-5 rounded-2xl bg-amber-950/90 border border-amber-500/80 text-amber-200 text-xs sm:text-sm space-y-3 shadow-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-white block text-base">
                  {paymentParam === 'cancelled' ? '⚠️ Payment Cancelled at Gateway' : '⚠️ Online Payment Pending'}
                </span>
                <p className="text-amber-200 leading-relaxed">
                  Your registration information is reserved under reference <strong className="text-gold font-mono">{data.short_code}</strong>, but your online payment of <strong className="text-white font-mono">৳{data.total_fee} BDT</strong> was not completed.
                </p>
                <p className="text-amber-300 font-semibold text-xs">
                  🔒 Your official Entry Pass and Gate QR Code remain locked until payment is verified.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/30 flex flex-wrap items-center gap-3">
              <Button
                variant="glow"
                size="md"
                onClick={handleRetryPayment}
                isLoading={retryingPayment}
                className="font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/30 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Complete Payment Now (৳{data.total_fee} BDT via SSLCommerz)</span>
              </Button>
            </div>
          </div>
        )}

        {/* State 3: Manual Payment (bKash/Nagad/Bank) Awaiting Review */}
        {!isVerified && data.payment_method !== 'SSLCOMMERZ' && data.payment_status === 'PENDING' && (
          <div className="p-4 rounded-2xl bg-sky-950/90 border border-sky-500 text-sky-200 text-xs sm:text-sm flex items-start gap-3 shadow-xl">
            <Clock className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block text-sm">
                ⏳ Manual Payment Verification in Progress
              </span>
              <p>
                We received your registration and transaction ID (<strong className="font-mono text-white">{data.payment_reference || 'Submitted'}</strong>). Our accounts desk is verifying your payment with the provider.
              </p>
              <p className="text-sky-300">
                Your Entry Pass and QR Code will unlock once approved. You will also receive an SMS and email notification.
              </p>
            </div>
          </div>
        )}

        {/* State 4: Payment Rejected */}
        {data.payment_status === 'REJECTED' && (
          <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-600 text-rose-200 text-xs sm:text-sm flex items-center gap-3 shadow-xl">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold text-white block text-sm">✕ Payment Rejected</span>
              <span>The payment transaction for this registration was rejected. Please contact the JTC organizing committee or submit a new registration.</span>
            </div>
          </div>
        )}

        {/* State 5: Registration Expired (TTL) */}
        {data.payment_status === 'EXPIRED' && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-300 text-xs sm:text-sm flex items-start gap-3 shadow-xl">
            <Clock className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block text-sm">
                ⚠️ Registration Expired
              </span>
              <p>
                The payment window for this registration has expired due to non-completion within 24 hours. You may submit a new registration.
              </p>
              <div className="pt-2">
                <Link href="/register">
                  <Button variant="glow" size="sm" className="font-bold">
                    Start New Registration
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Header Hero Text */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-1 ring-8 ${
            isVerified ? 'bg-gold/20 text-gold ring-gold/10' : 'bg-amber-500/20 text-amber-400 ring-amber-500/10'
          }`}>
            {isVerified ? <CheckCircle2 className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            {isVerified ? 'Registration & Payment Verified!' : 'Registration Saved — Payment Required'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            {isVerified
              ? 'Your official contestant pass and payment receipt are ready. You can download or print your admit card below.'
              : 'Your entry pass and gate QR code will unlock automatically once your payment of ৳' + data.total_fee + ' BDT is verified.'}
          </p>

          {/* Action Bar */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {isVerified ? (
              <>
                <Button
                  variant="glow"
                  size="lg"
                  onClick={handlePrint}
                  className="px-6 py-3 rounded-xl font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download Official Pass & Receipt (PDF)</span>
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handlePrint}
                  className="text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </Button>
              </>
            ) : (
              data.payment_method === 'SSLCOMMERZ' && (
                <Button
                  variant="glow"
                  size="lg"
                  onClick={handleRetryPayment}
                  isLoading={retryingPayment}
                  className="px-6 py-3 rounded-xl font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>Pay ৳{data.total_fee} BDT Online to Unlock Pass</span>
                </Button>
              )
            )}
            <Link href="/">
              <Button variant="secondary" size="md" className="text-xs">
                Back to Home <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center justify-center gap-2 border-b border-surface-border pb-3">
          <button
            onClick={() => setActiveTab('pass')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pass'
                ? 'bg-gold text-slate-950 shadow-md font-black'
                : 'bg-surface text-slate-300 hover:text-white border border-surface-border'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Contestant Entry Pass {!isVerified && '(Locked)'}
          </button>
          <button
            onClick={() => setActiveTab('receipt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'receipt'
                ? 'bg-gold text-slate-950 shadow-md font-black'
                : 'bg-surface text-slate-300 hover:text-white border border-surface-border'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {isVerified ? 'Official Payment Receipt' : 'Payment Invoice'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE A4 DOCUMENT (Visible on screen and optimized for @media print) */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        {/* DOCUMENT PART 1: Official Entry Pass (Admit Card) */}
        <div className={`print:block ${activeTab === 'pass' ? 'block' : 'hidden'} ${
          isVerified ? 'gradient-border-gold' : 'border border-amber-500/50'
        } shadow-2xl shadow-amber-500/10 print:shadow-none print:border-2 print:border-slate-800 print:rounded-2xl print:p-0`}>
          <div className="rounded-[13px] p-6 sm:p-8 bg-surface-elevated/95 space-y-6 print:bg-white print:text-slate-950 print:p-6">
            
            {/* Locked Notice Watermark when Unverified */}
            {!isVerified && (
              <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/80 text-amber-200 text-center text-xs font-mono font-bold flex items-center justify-center gap-2 print:border-slate-400 print:bg-slate-100 print:text-slate-900">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>ENTRY PASS LOCKED — PAYMENT STATUS: {data.payment_status_display.toUpperCase()} (৳{data.total_fee} BDT)</span>
              </div>
            )}

            {/* Pass Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-surface-border print:border-slate-300 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface border border-gold/50 overflow-hidden shadow-lg shrink-0 print:border-slate-400">
                  <img
                    src="/images/jtc-logo.png"
                    alt="JTC Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gold print:text-amber-700 font-extrabold block">
                    Official Contestant Entry Pass & Admit Card
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white print:text-slate-950 font-mono">
                    JOSEPHITE TECH CLUB
                  </h2>
                  <p className="text-xs text-slate-300 print:text-slate-600 font-medium">
                    St. Joseph International School • 97 Asad Avenue, Mohammadpur, Dhaka 1207
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-surface print:bg-slate-100 p-3 rounded-xl border border-surface-border print:border-slate-300">
                <span className="text-[10px] uppercase text-slate-400 print:text-slate-600 font-bold block">
                  Pass Code (Short ID)
                </span>
                <div className="text-2xl font-black text-gold print:text-amber-800 font-mono tracking-widest">
                  {data.short_code}
                </div>
              </div>
            </div>

            {/* Special Gold/Emerald Bundle Crest */}
            {data.is_bundle && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-amber-950/90 border-2 border-emerald-400/60 print:border-2 print:border-emerald-600 print:bg-emerald-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl print:shadow-none">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-400/20 border border-emerald-400/50 print:bg-emerald-100 print:border-emerald-600 text-lg shrink-0">
                    ✨
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-300 print:text-emerald-800 text-sm tracking-wide block">
                      ✨ 5-in-1 Festival Bundle Attendee
                    </span>
                    <span className="text-[11px] text-slate-300 print:text-slate-700">
                      All-Access 5 Competition Package • VIP Contestant
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/40 print:border-amber-600 print:bg-amber-100 text-xs font-bold text-amber-300 print:text-amber-900 shrink-0">
                  <span className="text-sm">⚽</span>
                  <span>Includes 1 Complimentary Round of FC in Game Zone</span>
                </div>
              </div>
            )}

            {/* Participant Details & QR Verification Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-2 space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 print:text-slate-500 block font-semibold text-[11px]">Contestant Name</span>
                  <span className="text-lg font-black text-white print:text-slate-950">{data.participant_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-500 block font-semibold text-[11px]">Institution / School</span>
                  <span className="text-sm font-bold text-slate-200 print:text-slate-800">{data.participant_school}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 print:text-slate-500 block font-semibold text-[11px]">Academic Tier</span>
                    <span className="text-xs font-bold text-gold-light print:text-amber-800">{data.participant_grade}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-500 block font-semibold text-[11px]">Emergency Mobile</span>
                    <span className="text-xs font-mono text-slate-200 print:text-slate-800">{data.participant_phone}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Section: Valid QR when paid, Locked when unpaid */}
              {isVerified ? (
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface print:bg-slate-50 border border-gold/40 print:border-slate-300 text-center space-y-2">
                  <QRCodeSVG value={verifyUrl} size={110} />
                  <span className="text-[10px] font-mono text-gold-light print:text-slate-700 font-bold flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-gold print:text-amber-700" /> Gate Scan Verified
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface/80 print:bg-slate-50 border border-amber-500/40 print:border-slate-300 text-center space-y-2 min-h-[140px]">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-1">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 print:text-slate-900 uppercase tracking-wider block">
                    QR Code Locked
                  </span>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 max-w-[130px] leading-tight block">
                    Unlocks upon payment of ৳{data.total_fee} BDT
                  </span>
                </div>
              )}
            </div>

            {/* Registered Competitions */}
            <div className="space-y-2.5 pt-4 border-t border-surface-border print:border-slate-300">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 print:text-slate-900 block">
                Authorized Competitions ({data.registration_events.length}):
              </span>
              <div className="space-y-1.5">
                {data.registration_events.map((re, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-surface print:bg-slate-50 border border-surface-border print:border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white print:text-slate-950 text-xs sm:text-sm">{re.event.name}</span>
                      {re.is_team && (
                        <span className="block text-[11px] text-gold print:text-amber-800 mt-0.5 font-semibold">
                          Team: <strong>{re.team_name}</strong> {re.team_members && `(${re.team_members})`}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-gold print:text-slate-900">৳{re.fee_charged} BDT</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Instructions Footer */}
            <div className="pt-3 border-t border-surface-border print:border-slate-300 text-[11px] text-slate-400 print:text-slate-600 space-y-1">
              <p className="font-bold text-slate-300 print:text-slate-800">📌 Venue Protocol:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Report at the SJIS Main Entrance Registration Desk by 08:30 AM on the festival day.</li>
                <li>Bring your physical School/College Student ID Card for contestant kit collection.</li>
                <li>Coding & Gaming segment participants must bring their own laptops / peripherals.</li>
                <li className={isVerified ? 'text-emerald-400 print:text-emerald-700 font-semibold' : 'text-amber-400 print:text-amber-800 font-semibold'}>
                  {isVerified
                    ? '✓ Entry pass is verified and valid for festival gate admission.'
                    : '⚠️ Entry passes must be VERIFIED with payment cleared before festival kit issuance.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* DOCUMENT PART 2: Official Payment Receipt & Tax Invoice */}
        <div className={`print:block ${activeTab === 'receipt' ? 'block' : 'hidden'} ${
          isVerified ? 'gradient-border-gold' : 'border border-surface-border'
        } shadow-2xl shadow-amber-500/10 print:shadow-none print:border-2 print:border-slate-800 print:rounded-2xl print:p-0`}>
          <div className="rounded-[13px] p-6 sm:p-8 bg-surface-elevated/95 space-y-6 print:bg-white print:text-slate-950 print:p-6">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-surface-border print:border-slate-300 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface border border-gold/50 overflow-hidden shadow-lg shrink-0 print:border-slate-400">
                  <img
                    src="/images/jtc-logo.png"
                    alt="JTC Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className={`text-[10px] uppercase font-mono tracking-widest font-extrabold block ${
                    isVerified ? 'text-emerald-400 print:text-emerald-700' : 'text-amber-400 print:text-amber-800'
                  }`}>
                    {isVerified ? 'Official Payment Receipt & Tax Invoice' : 'Festival Registration Invoice (Unpaid)'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white print:text-slate-950 font-mono">
                    JOSEPHITE TECH CLUB
                  </h2>
                  <p className="text-xs text-slate-300 print:text-slate-600">
                    SJIS Inter-School Tech Carnival 2026 • St. Joseph International School
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-xs font-mono text-slate-400 print:text-slate-600 block">
                  Invoice Date: {new Date(data.registered_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <Badge
                  variant={isVerified ? 'gold' : data.payment_status === 'REJECTED' ? 'red' : 'champagne'}
                  size="md"
                  className="font-bold font-mono"
                >
                  STATUS: {data.payment_status_display.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Bill To & Invoice Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface print:bg-slate-50 border border-surface-border print:border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 print:text-slate-500 font-bold block uppercase text-[10px]">Billed To:</span>
                <strong className="text-white print:text-slate-900 text-sm block">{data.participant_name}</strong>
                <span className="text-slate-300 print:text-slate-700 block">{data.participant_school}</span>
                <span className="text-slate-400 print:text-slate-600 block font-mono">{data.participant_email} • {data.participant_phone}</span>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="text-slate-400 print:text-slate-500 font-bold block uppercase text-[10px]">Payment Details:</span>
                <div>
                  <span className="text-slate-400 print:text-slate-600">Method: </span>
                  <strong className="text-white print:text-slate-900">{data.payment_method}</strong>
                </div>
                {data.payment_reference && (
                  <div className="font-mono text-slate-300 print:text-slate-700 text-[11px]">
                    Trx Reference: <strong>{data.payment_reference}</strong>
                  </div>
                )}
                <div className="font-mono text-[11px] text-slate-400 print:text-slate-600">
                  Confirmation Code: {data.confirmation_code}
                </div>
              </div>
            </div>

            {/* Itemized Invoice Table */}
            <div className="space-y-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-border print:border-slate-300 text-[11px] font-mono text-slate-400 print:text-slate-600 uppercase">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Type</th>
                    <th className="py-2 text-right">Fee (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border print:divide-slate-200">
                  {data.registration_events.map((re, idx) => (
                    <tr key={idx} className="text-slate-200 print:text-slate-800">
                      <td className="py-2.5 font-medium">
                        <span className="text-white print:text-slate-950 font-bold block">{re.event.name}</span>
                        {re.is_team && (
                          <span className="text-[11px] text-gold print:text-amber-800">Team: {re.team_name}</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center font-mono text-[11px]">
                        {re.is_team ? 'Team' : 'Individual'}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-white print:text-slate-950">
                        ৳{re.fee_charged}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {data.is_bundle && (
                    <tr className="border-t border-surface-border print:border-slate-300 text-xs text-emerald-400 print:text-emerald-800 font-semibold">
                      <td colSpan={2} className="py-2.5">
                        ✨ 5-in-1 Tech Festival Bundle (৳400 Savings Applied + ⚽ 1 Free FC Round)
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-400 print:text-emerald-800">
                        -৳400 BDT
                      </td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-surface-border print:border-slate-400 text-sm">
                    <th colSpan={2} className="py-3 text-right font-bold text-white print:text-slate-950">
                      {isVerified ? 'Grand Total Paid:' : 'Grand Total Due:'}
                    </th>
                    <th className="py-3 text-right font-mono font-black text-gold print:text-slate-950 text-base">
                      ৳{data.total_fee} BDT
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Verification Stamp */}
            {isVerified ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 print:bg-emerald-50 border border-emerald-500/40 print:border-emerald-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400 print:text-emerald-700" />
                  <div>
                    <strong className="text-emerald-300 print:text-emerald-800 block">Payment Authenticated & Recorded</strong>
                    <span className="text-emerald-200 print:text-emerald-700 text-[11px]">
                      This is an electronically generated valid receipt. No signature required.
                    </span>
                  </div>
                </div>
                <span className="font-mono text-emerald-400 print:text-emerald-800 font-extrabold text-sm uppercase">
                  PAID ✓
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-950/40 print:bg-amber-50 border border-amber-500/40 print:border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400 print:text-amber-700 shrink-0" />
                  <div>
                    <strong className="text-amber-300 print:text-amber-800 block">Payment Pending / Unpaid</strong>
                    <span className="text-amber-200 print:text-amber-700 text-[11px]">
                      This invoice is currently unpaid. Complete payment to obtain an authenticated official receipt.
                    </span>
                  </div>
                </div>
                {data.payment_method === 'SSLCOMMERZ' && (
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={handleRetryPayment}
                    isLoading={retryingPayment}
                    className="font-bold shrink-0 print:hidden"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1" /> Pay ৳{data.total_fee} Now
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-white font-mono">Loading document...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
