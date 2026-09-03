'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { lookupRegistration, RegistrationResponse } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import QRCodeSVG from '@/components/ui/QRCodeSVG';
import {
  CheckCircle2, Printer, ArrowRight, ShieldCheck, Mail, Phone, Calendar,
  MapPin, QrCode, Download, FileText, Sparkles, Building2, User, Award, Check
} from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [data, setData] = useState<RegistrationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pass' | 'receipt'>('pass');

  useEffect(() => {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#F5B700', '#FFE58F', '#0052CC', '#353f4aff', '#10B981'],
      });
    } catch (e) { }

    if (code) {
      lookupRegistration(code)
        .then((res) => setData(res))
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
        <p>Generating verified digital entry pass & payment receipt...</p>
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

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify?code=${data.confirmation_code}`
    : `https://jtc.sjis.edu.bd/verify?code=${data.confirmation_code}`;

  const paymentParam = searchParams.get('payment');
  const paymentMethodParam = searchParams.get('method');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Top Interactive Banner (Hidden on Print) */}
      <div className="print:hidden space-y-6">
        {paymentParam === 'success' && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 shadow-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block text-sm">🎉 Payment Verified Successfully via SSLCommerz!</span>
              <span>Your transaction was confirmed. Your digital entry pass and official festival receipt have been issued and authenticated.</span>
            </div>
          </div>
        )}

        {paymentParam === 'failed' && (
          <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-600 text-rose-200 text-xs sm:text-sm flex items-center gap-3 shadow-xl">
            <ShieldCheck className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Online Payment Incomplete</span>
              <span>The online transaction did not complete. Please retry your payment to activate your entry pass.</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/20 text-gold ring-8 ring-gold/10 mb-1">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Registration Confirmed!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Your official contestant pass and payment invoice are ready. You can download or print the PDF receipt below.
          </p>

          {/* Action Bar */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
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
            <Award className="w-3.5 h-3.5" /> Contestant Entry Pass
          </button>
          <button
            onClick={() => setActiveTab('receipt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'receipt'
                ? 'bg-gold text-slate-950 shadow-md font-black'
                : 'bg-surface text-slate-300 hover:text-white border border-surface-border'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Official Payment Receipt
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE A4 DOCUMENT (Visible on screen and optimized for @media print) */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        {/* DOCUMENT PART 1: Official Entry Pass (Admit Card) */}
        <div className={`print:block ${activeTab === 'pass' ? 'block' : 'hidden'} gradient-border-gold shadow-2xl shadow-amber-500/10 print:shadow-none print:border-2 print:border-slate-800 print:rounded-2xl print:p-0`}>
          <div className="rounded-[13px] p-6 sm:p-8 bg-surface-elevated/95 space-y-6 print:bg-white print:text-slate-950 print:p-6">
            {/* Pass Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-surface-border print:border-slate-300 gap-4">
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

              <div className="text-left sm:text-right bg-surface print:bg-slate-100 p-3 rounded-xl border border-surface-border print:border-slate-300">
                <span className="text-[10px] uppercase text-slate-400 print:text-slate-600 font-bold block">
                  Pass Code (Short ID)
                </span>
                <div className="text-2xl font-black text-gold print:text-amber-800 font-mono tracking-widest">
                  {data.short_code}
                </div>
              </div>
            </div>

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

              {/* Scannable Gate QR Code */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface print:bg-slate-50 border border-gold/40 print:border-slate-300 text-center space-y-2">
                <QRCodeSVG value={verifyUrl} size={110} />
                <span className="text-[10px] font-mono text-gold-light print:text-slate-700 font-bold flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-gold print:text-amber-700" /> Gate Scan Verified
                </span>
              </div>
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
              </ul>
            </div>
          </div>
        </div>

        {/* DOCUMENT PART 2: Official Payment Receipt & Tax Invoice */}
        <div className={`print:block ${activeTab === 'receipt' ? 'block' : 'hidden'} gradient-border-gold shadow-2xl shadow-amber-500/10 print:shadow-none print:border-2 print:border-slate-800 print:rounded-2xl print:p-0`}>
          <div className="rounded-[13px] p-6 sm:p-8 bg-surface-elevated/95 space-y-6 print:bg-white print:text-slate-950 print:p-6">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-surface-border print:border-slate-300 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 print:text-emerald-700 font-extrabold block">
                  Official Payment Receipt & Tax Invoice
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white print:text-slate-950 font-mono">
                  JOSEPHITE TECH CLUB
                </h2>
                <p className="text-xs text-slate-300 print:text-slate-600">
                  SJIS Inter-School Tech Carnival 2026 • SSLCommerz Authenticated
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-xs font-mono text-slate-400 print:text-slate-600 block">
                  Invoice Date: {new Date(data.registered_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <Badge
                  variant={data.payment_status === 'VERIFIED' ? 'gold' : 'champagne'}
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
                  <span className="text-slate-400 print:text-slate-600">Gateway: </span>
                  <strong className="text-white print:text-slate-900">{data.payment_method} (SSLCommerz)</strong>
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
                  <tr className="border-t-2 border-surface-border print:border-slate-400 text-sm">
                    <th colSpan={2} className="py-3 text-right font-bold text-white print:text-slate-950">Grand Total Paid:</th>
                    <th className="py-3 text-right font-mono font-black text-gold print:text-slate-950 text-base">
                      ৳{data.total_fee} BDT
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Verification Stamp */}
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
