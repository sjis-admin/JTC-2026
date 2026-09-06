'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  fetchEvents, fetchSchools, fetchSiteSettings, submitRegistration, initiateSSLCommerzPayment,
  fetchBundleInfo,
  EventItem, SchoolItem, SiteSettingsData, RegistrationPayload, BundleInfoData
} from '@/lib/api';
import { Turnstile } from '@/components/ui/Turnstile';
import {
  CheckCircle2, AlertCircle, User, Trophy, CreditCard, ShieldCheck, ArrowRight,
  ArrowLeft, Copy, Check, Info, Users, Sparkles, ShoppingBag, Trash2, Phone, Mail, School, ExternalLink, Zap, Lock
} from 'lucide-react';
import AuthGate from './AuthGate';

const GRADE_OPTIONS = [
  { value: '3', label: 'Grade 3 (Group A)' },
  { value: '4', label: 'Grade 4 (Group A)' },
  { value: '5', label: 'Grade 5 (Group B)' },
  { value: '6', label: 'Grade 6 (Group B)' },
  { value: '7', label: 'Grade 7 (Group C)' },
  { value: '8', label: 'Grade 8 (Group C)' },
  { value: '9', label: 'Grade 9 (Group D)' },
  { value: '10', label: 'Grade 10 / O-Level (Group D)' },
  { value: '11', label: 'Grade 11 / AS-Level / HSC 1st (Group D)' },
  { value: '12', label: 'Grade 12 / A2-Level / HSC 2nd (Group D)' },
  { value: 'UNI_1', label: 'University — 1st Year (Group E)' },
  { value: 'UNI_2', label: 'University — 2nd Year (Group E)' },
  { value: 'UNI_3', label: 'University — 3rd Year (Group E)' },
  { value: 'UNI_4', label: 'University — 4th Year (Group E)' },
];

const GRADE_TO_GROUP: Record<string, string> = {
  '3': 'A', '4': 'A',
  '5': 'B', '6': 'B',
  '7': 'C', '8': 'C',
  '9': 'D', '10': 'D', '11': 'D', '12': 'D',
  'UNI_1': 'E', 'UNI_2': 'E', 'UNI_3': 'E', 'UNI_4': 'E',
};

// Bangladesh Phone Carrier prefixes
const CARRIER_MAP: Record<string, string> = {
  '017': 'Grameenphone',
  '013': 'Grameenphone',
  '018': 'Robi',
  '016': 'Airtel',
  '019': 'Banglalink',
  '014': 'Banglalink',
  '015': 'Teletalk',
};

// Strict RFC-compliant Email Regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// BD Mobile Number Regex
const BD_PHONE_REGEX = /^(?:\+?88|0088)?(01[3-9]\d{8})$/;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedEventId = searchParams.get('event');

  // ─── Auth Gate State ──────────────────────────────────────────────────────
  const [authUnlocked, setAuthUnlocked] = useState<boolean>(false);
  const [authPicture, setAuthPicture] = useState<string>('');

  // Check if session already exists (e.g. user refreshed the page mid-flow)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('jtc_reg_session');
      if (token) setAuthUnlocked(true);
    }
  }, []);

  const handleAuthUnlock = (unlockedEmail: string, unlockedName: string, picture?: string) => {
    // Pre-fill form fields from verified identity
    if (unlockedEmail) setEmail(unlockedEmail);
    if (unlockedName) setName(unlockedName);
    if (picture) setAuthPicture(picture);
    setAuthUnlocked(true);
  };

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Data sources
  const [events, setEvents] = useState<EventItem[]>([]);
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [schoolId, setSchoolId] = useState<string>('');
  const [schoolOther, setSchoolOther] = useState('');
  const [grade, setGrade] = useState('9');

  // Touched state for realtime validation feedback
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string>('');

  // Selected Events & Team metadata
  const [selectedEvents, setSelectedEvents] = useState<{
    [eventId: number]: {
      is_team: boolean;
      team_name: string;
      team_members: string;
    };
  }>({});

  const [paymentMethod, setPaymentMethod] = useState<'SSLCOMMERZ' | 'BKASH' | 'NAGAD' | 'BANK'>('SSLCOMMERZ');
  const [paymentReference, setPaymentReference] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [draftRestored, setDraftRestored] = useState<boolean>(false);

  // Bundle Package state
  const [isBundleSelected, setIsBundleSelected] = useState<boolean>(false);
  const [bundleInfo, setBundleInfo] = useState<BundleInfoData | null>(null);

  // ─── 1. Restore saved draft on mount ───────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jtc_registration_draft_v1');
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.name) setName(draft.name);
        if (draft.email) setEmail(draft.email);
        if (draft.phone) setPhone(draft.phone);
        if (draft.schoolId) setSchoolId(draft.schoolId);
        if (draft.schoolOther) setSchoolOther(draft.schoolOther);
        if (draft.grade) setGrade(draft.grade);
        if (draft.selectedEvents && Object.keys(draft.selectedEvents).length > 0) {
          setSelectedEvents(draft.selectedEvents);
        }
        if (draft.isBundleSelected) setIsBundleSelected(true);
        if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);
        if (draft.paymentReference) setPaymentReference(draft.paymentReference);
        setDraftRestored(true);
      }
    } catch (e) {
      console.warn('Draft restore notice:', e);
    }
  }, []);

  // ─── 2. Auto-save draft on input change ─────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const hasContent = Boolean(name || email || phone || schoolOther || Object.keys(selectedEvents).length > 0);
        if (hasContent) {
          localStorage.setItem(
            'jtc_registration_draft_v1',
            JSON.stringify({
              name,
              email,
              phone,
              schoolId,
              schoolOther,
              grade,
              selectedEvents,
              isBundleSelected,
              paymentMethod,
              paymentReference,
              savedAt: new Date().toISOString(),
            })
          );
        }
      } catch (e) {
        // storage quota / private window
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [name, email, phone, schoolId, schoolOther, grade, selectedEvents, paymentMethod, paymentReference, isBundleSelected]);

  const clearDraft = () => {
    try {
      localStorage.removeItem('jtc_registration_draft_v1');
    } catch (e) {}
    setName('');
    setEmail('');
    setPhone('');
    setSchoolId('1');
    setSchoolOther('');
    setGrade('9');
    setSelectedEvents({});
    setIsBundleSelected(false);
    setPaymentReference('');
    setDraftRestored(false);
  };

  useEffect(() => {
    async function loadData() {
      const [evList, schList, stData, bndInfo] = await Promise.all([
        fetchEvents(), fetchSchools(), fetchSiteSettings(), fetchBundleInfo()
      ]);
      setEvents(evList);
      setSchools(schList);
      setSiteSettings(stData);
      setBundleInfo(bndInfo);

      if (preselectedEventId) {
        const id = parseInt(preselectedEventId, 10);
        if (id) {
          const targetEvent = evList.find((e) => e.id === id);
          if (targetEvent && targetEvent.eligibility_groups.length > 0) {
            // Check if current group is eligible; if not, switch to first eligible group's grade
            const isEligibleNow = targetEvent.eligibility_groups.some(
              (g) => g.code === GRADE_TO_GROUP[grade]
            );
            if (!isEligibleNow) {
              const firstGroupCode = targetEvent.eligibility_groups[0].code;
              const matchingGrade = Object.keys(GRADE_TO_GROUP).find(
                (k) => GRADE_TO_GROUP[k] === firstGroupCode
              );
              if (matchingGrade) {
                setGrade(matchingGrade);
              }
            }
            setSelectedEvents({ [id]: { is_team: false, team_name: '', team_members: '' } });
          }
        }
      }
    }
    loadData();
  }, [preselectedEventId]);

  const currentGroup = GRADE_TO_GROUP[grade] || 'D';

  // Filter events eligible for selected grade group
  const eligibleEvents = useMemo(() => {
    return events.filter((e) =>
      e.eligibility_groups.some((g) => g.code === currentGroup)
    );
  }, [events, currentGroup]);

  // Prune any selected events that become ineligible when grade changes
  useEffect(() => {
    if (events.length === 0) return;
    setSelectedEvents((prev) => {
      const eligibleIds = new Set(
        events
          .filter((e) => e.eligibility_groups.some((g) => g.code === currentGroup))
          .map((e) => e.id)
      );
      const cleaned: typeof prev = {};
      let changed = false;
      for (const [idStr, val] of Object.entries(prev)) {
        const numId = parseInt(idStr, 10);
        if (eligibleIds.has(numId)) {
          cleaned[numId] = val;
        } else {
          changed = true;
        }
      }
      return changed ? cleaned : prev;
    });
  }, [grade, currentGroup, events]);

  // Real-time Phone Carrier Detection
  const phoneCarrier = useMemo(() => {
    const clean = phone.replace(/[\s\-()]/g, '');
    let prefix = '';
    if (clean.startsWith('01') && clean.length >= 3) {
      prefix = clean.substring(0, 3);
    } else if (clean.startsWith('+8801') && clean.length >= 6) {
      prefix = '0' + clean.substring(4, 6);
    } else if (clean.startsWith('8801') && clean.length >= 5) {
      prefix = '0' + clean.substring(3, 5);
    }
    return CARRIER_MAP[prefix] || null;
  }, [phone]);

  // Real-time Validation Errors
  const validationErrors = useMemo(() => {
    const errors: { [key: string]: string } = {};

    // Name Validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      errors.name = 'Full name is required.';
    } else if (trimmedName.length < 3) {
      errors.name = 'Name must be at least 3 characters long.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errors.name = 'Name should only contain letters and standard characters.';
    }

    // Email Validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    // Phone Validation
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    if (!cleanPhone) {
      errors.phone = 'Mobile phone number is required.';
    } else if (!BD_PHONE_REGEX.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017xxxxxxxx).';
    }

    // School Validation
    if (!schoolId) {
      errors.school = 'Please select your institution / school.';
    } else if (schoolId === 'other' && (!schoolOther.trim() || schoolOther.trim().length < 3)) {
      errors.schoolOther = 'Please enter your school / college / university name (min 3 chars).';
    }

    return errors;
  }, [name, email, phone, schoolId, schoolOther]);

  // Step 2 Team Validations
  const step2TeamErrors = useMemo(() => {
    const teamErrors: { [eventId: number]: string } = {};
    for (const [idStr, meta] of Object.entries(selectedEvents)) {
      const event = events.find((e) => e.id === parseInt(idStr, 10));
      if (event && (meta.is_team || event.event_type === 'TEAM')) {
        if (!meta.team_name.trim()) {
          teamErrors[event.id] = `Team Name is required for "${event.name}".`;
        } else if (meta.team_name.trim().length < 2) {
          teamErrors[event.id] = `Team Name must be at least 2 characters.`;
        }
      }
    }
    return teamErrors;
  }, [selectedEvents, events]);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Toggle event selection — deselects bundle if active
  const toggleEvent = (e: EventItem) => {
    setIsBundleSelected(false);
    setSelectedEvents((prev) => {
      const copy = { ...prev };
      if (copy[e.id]) {
        delete copy[e.id];
      } else {
        const isTeamDefault = e.event_type === 'TEAM';
        copy[e.id] = { is_team: isTeamDefault, team_name: '', team_members: '' };
      }
      return copy;
    });
  };

  const selectBundle = () => { setSelectedEvents({}); setIsBundleSelected(true); };
  const deselectBundle = () => setIsBundleSelected(false);

  const removeEvent = (eventId: number) => {
    setSelectedEvents((prev) => {
      const copy = { ...prev };
      delete copy[eventId];
      return copy;
    });
  };

  // Calculate total fee
  const totalFee = useMemo(() => {
    if (isBundleSelected && bundleInfo) return bundleInfo.price;
    return Object.entries(selectedEvents).reduce((sum, [eventIdStr, meta]) => {
      const event = events.find((e) => e.id === parseInt(eventIdStr, 10));
      if (!event) return sum;
      if (meta.is_team && (event.event_type === 'TEAM' || event.event_type === 'BOTH')) {
        return sum + event.team_fee;
      }
      return sum + event.individual_fee;
    }, 0);
  }, [selectedEvents, events, isBundleSelected, bundleInfo]);

  // STEP 1 PROCEED
  const handleStep1Next = () => {
    setSubmitAttempted(true);
    setGlobalError('');

    // Mark all Step 1 fields touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      school: true,
      schoolOther: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      setGlobalError('Please fix the errors in the form before proceeding.');
      return;
    }

    setSubmitAttempted(false);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // STEP 2 PROCEED
  const handleStep2Next = () => {
    setGlobalError('');
    if (isBundleSelected) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const count = Object.keys(selectedEvents).length;
    if (count === 0) {
      setGlobalError('Please select at least one competition to enter, or choose the Bundle Package.');
      return;
    }
    if (Object.keys(step2TeamErrors).length > 0) {
      const firstErr = Object.values(step2TeamErrors)[0];
      setGlobalError(firstErr);
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // STEP 3 SUBMISSION
  const handleSubmit = async () => {
    setGlobalError('');
    setLoading(true);

    try {
      const payload: RegistrationPayload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.replace(/[\s\-()]/g, ''),
        school_id: schoolId === 'other' ? null : parseInt(schoolId, 10),
        school_name_other: schoolId === 'other' ? schoolOther.trim() : '',
        grade,
        is_bundle: isBundleSelected,
        events: isBundleSelected
          ? (bundleInfo?.events || []).map((e) => ({ event_id: e.id, is_team: false }))
          : Object.entries(selectedEvents).map(([idStr, meta]) => ({
              event_id: parseInt(idStr, 10),
              is_team: meta.is_team,
              team_name: meta.team_name.trim(),
              team_members: meta.team_members.trim(),
            })),
        payment_method: paymentMethod,
        payment_reference: paymentReference.trim(),
        turnstile_token: turnstileToken,
      };

      const res = await submitRegistration(payload);

      // Clear saved draft upon successful submission
      try {
        localStorage.removeItem('jtc_registration_draft_v1');
      } catch (e) {}

      // If SSLCommerz Instant Online Payment is chosen, redirect to SSLCommerz Gateway
      if (paymentMethod === 'SSLCOMMERZ' && totalFee > 0) {
        try {
          const sslRes = await initiateSSLCommerzPayment(res.confirmation_code);
          if (sslRes.gateway_url) {
            window.location.href = sslRes.gateway_url;
            return;
          }
        } catch (gatewayErr: any) {
          console.error('SSLCommerz gateway initiation error:', gatewayErr);
          // Fallback to success pass page if gateway fails in development
        }
      }

      router.push(`/register/success?code=${res.confirmation_code}`);
    } catch (err: any) {
      setGlobalError(err.message || 'Registration failed. Please check your data and retry.');
      setLoading(false);
    }
  };

  const copyBkash = () => {
    navigator.clipboard.writeText('01700000000');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Auth Gate: show gate if not yet verified ──────────────────────────────────
  if (!authUnlocked) {
    return <AuthGate onUnlock={handleAuthUnlock} />;
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-gold/40 text-xs font-semibold text-gold">
          <Sparkles className="w-3.5 h-3.5" /> Official Registration Portal
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
          Carnival Registration
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Josephite Tech Club • St. Joseph International School
        </p>
        {/* Verified identity badge */}
        {(name || email) && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-xs font-semibold text-green-400 mt-1">
            {authPicture ? (
              <Image src={authPicture} alt="" width={18} height={18} className="rounded-full" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            )}
            <span>Verified: <strong>{email}</strong></span>
          </div>
        )}
      </div>

      {/* Auto-Restored Draft Banner */}
      {draftRestored && (
        <div className="mb-6 p-4 rounded-xl bg-surface-elevated/90 border border-teal-500/40 text-slate-200 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-teal-500/5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>
              <strong>Draft Restored:</strong> We automatically recovered your previously filled information.
            </span>
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="text-slate-400 hover:text-rose-400 text-xs underline font-semibold transition-colors text-left sm:text-right"
          >
            Clear Draft & Start Fresh
          </button>
        </div>
      )}

      {/* Dynamic Registration Closed / Scheduled Gate */}
      {siteSettings && !siteSettings.registration_open && (
        <Card glow="none" className="p-8 text-center border-rose-500/50 bg-rose-950/20 max-w-2xl mx-auto mb-10">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl text-rose-300 mb-2">Registration is Currently Closed</CardTitle>
          <CardDescription className="text-slate-300 max-w-md mx-auto mb-6">
            Online registration for SJIS Inter-School Tech Carnival 2026 has either concluded or has not opened yet. Please stay tuned to our official channels.
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/events">
              <Button variant="glow" size="lg" className="w-full sm:w-auto font-bold">
                Browse All 17 Competitions
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-semibold">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Stepper Progress */}
      {(!siteSettings || siteSettings.registration_open) && (
        <>
          <div className="flex items-center justify-between max-w-lg mx-auto mb-8 sm:mb-10 relative px-1 sm:px-2">
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-surface-border -translate-y-1/2 -z-0" />
        {[
          { num: 1, label: 'Personal Info' },
          { num: 2, label: 'Competitions' },
          { num: 3, label: 'Payment & Pass' },
        ].map((s) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;
          return (
            <div key={s.num} className="flex flex-col items-center relative z-10 bg-background px-1 sm:px-2 text-center min-w-[70px] sm:min-w-[110px]">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all duration-300 ${
                  isDone
                    ? 'bg-gold text-slate-950 shadow-md shadow-gold/20'
                    : isCurrent
                    ? 'bg-gradient-to-tr from-gold via-yellow-400 to-amber-500 text-slate-950 ring-4 ring-gold/20 shadow-lg shadow-gold/30 font-black'
                    : 'bg-surface border border-surface-border text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold mt-1.5 sm:mt-2 leading-tight block ${
                  isCurrent ? 'text-gold-light' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Global Error Banner */}
      {globalError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* STEP 1: Personal Details with Realtime Enterprise Validation */}
      {step === 1 && (
        <Card glow="none" className="border border-surface-border bg-surface-elevated/90 backdrop-blur-xl">
          <CardTitle className="text-xl sm:text-2xl mb-1">Contestant Information</CardTitle>
          <CardDescription className="mb-6">
            Please enter your accurate contact and academic details for verification, digital entry pass, and certificates.
          </CardDescription>

          <div className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold" /> Full Name (as per Student ID) <span className="text-rose-400">*</span>
                </label>
                {touched.name && !validationErrors.name && (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Abrar Fahim"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => markTouched('name')}
                className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-white placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                  (touched.name || submitAttempted) && validationErrors.name
                    ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-950/20'
                    : 'border-surface-border focus:border-gold'
                }`}
              />
              {(touched.name || submitAttempted) && validationErrors.name && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.name}
                </p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gold" /> Email Address <span className="text-rose-400">*</span>
                  </label>
                  {touched.email && !validationErrors.email && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  required
                  placeholder="abrar@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched('email')}
                  className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-white placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                    (touched.email || submitAttempted) && validationErrors.email
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-950/20'
                      : 'border-surface-border focus:border-gold'
                  }`}
                />
                {(touched.email || submitAttempted) && validationErrors.email ? (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.email}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400">Digital entry pass and receipt will be emailed here</p>
                )}
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gold" /> Mobile Phone Number <span className="text-rose-400">*</span>
                  </label>
                  {phoneCarrier && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.2 rounded bg-gold/15 text-gold font-bold border border-gold/30">
                      {phoneCarrier}
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => markTouched('phone')}
                  className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-white placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                    (touched.phone || submitAttempted) && validationErrors.phone
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-950/20'
                      : 'border-surface-border focus:border-gold'
                  }`}
                />
                {(touched.phone || submitAttempted) && validationErrors.phone ? (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.phone}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400">SMS confirmation dispatched via GreenWeb SMS</p>
                )}
              </div>
            </div>

            {/* Institution & Grade Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-gold" /> Institution / School Name <span className="text-rose-400">*</span>
                </label>
                <select
                  value={schoolId}
                  onChange={(e) => {
                    setSchoolId(e.target.value);
                    markTouched('school');
                  }}
                  onBlur={() => markTouched('school')}
                  className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-sm focus:outline-none focus:border-gold cursor-pointer transition-all ${
                    (touched.school || submitAttempted) && validationErrors.school
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-950/20 text-white'
                      : schoolId === ''
                      ? 'border-surface-border text-slate-400'
                      : 'border-surface-border text-white'
                  }`}
                >
                  <option value="" disabled className="bg-surface text-slate-400">
                    -- Select your School / College --
                  </option>
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.id} className="bg-surface text-white">
                      {sch.name}
                    </option>
                  ))}
                  <option value="other" className="bg-surface text-gold font-bold">
                    -- Other Institution (Type Name Below) --
                  </option>
                </select>
                {(touched.school || submitAttempted) && validationErrors.school && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.school}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-gold" /> Grade / Academic Level <span className="text-rose-400">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white text-sm focus:outline-none focus:border-gold cursor-pointer"
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value} className="bg-surface text-white">
                      {g.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gold-light font-semibold">
                  Automatically categorized into <strong className="text-gold font-mono">Group {currentGroup}</strong>
                </p>
              </div>
            </div>

            {/* Custom School Input when "Other" is selected */}
            {schoolId === 'other' && (
              <div className="space-y-1.5 animate-in fade-in duration-150">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  Custom School / College / University Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Type your Institution's full official name"
                  value={schoolOther}
                  onChange={(e) => setSchoolOther(e.target.value)}
                  onBlur={() => markTouched('schoolOther')}
                  className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-white placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                    (touched.schoolOther || submitAttempted) && validationErrors.schoolOther
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-950/20'
                      : 'border-surface-border focus:border-gold'
                  }`}
                />
                {(touched.schoolOther || submitAttempted) && validationErrors.schoolOther && (
                  <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.schoolOther}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-surface-border flex justify-end">
            <Button
              variant="glow"
              size="lg"
              onClick={handleStep1Next}
              className="w-full sm:w-auto px-7 py-3 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 hover:shadow-amber-400/40 hover:scale-[1.01] active:scale-[0.98] transition-all group"
            >
              <span>Proceed to Competitions</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/20 text-slate-900 font-extrabold uppercase">
                Step 2 →
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Competition Selection & Live Cart */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Selection Area */}
          <div className="lg:col-span-2 space-y-4">

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* BUNDLE COMPETITION PACKAGE CARD — Premium Attractive UI       */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {bundleInfo && bundleInfo.eligible_groups.includes(currentGroup) && (
              <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                isBundleSelected
                  ? 'ring-2 ring-emerald-400 shadow-2xl shadow-emerald-500/25'
                  : 'ring-1 ring-emerald-600/50 hover:ring-emerald-500/80 shadow-lg shadow-emerald-900/20'
              }`}>
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f0f] via-[#071a12] to-[#0d1a14]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_60%)]" />
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'repeating-linear-gradient(0deg,#00ff88,#00ff88 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,#00ff88,#00ff88 1px,transparent 1px,transparent 32px)'}} />

                <div className="relative p-5 sm:p-6">
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isBundleSelected ? 'bg-emerald-400 text-slate-900 shadow-lg shadow-emerald-400/40' : 'bg-emerald-900/60 border border-emerald-700 text-emerald-400'
                      }`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">Bundle Competition Package</span>
                          {isBundleSelected && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold animate-pulse">✓ SELECTED</span>
                          )}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                          Only <span className="text-emerald-400 font-mono">৳1,000</span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Register once — compete in <strong className="text-white">5 exciting events</strong>!
                        </p>
                      </div>
                    </div>

                    {/* Savings badge */}
                    <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-400/15 border border-emerald-400/40 text-center">
                        <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">You Save</span>
                        <span className="text-xl font-black text-emerald-400 font-mono">৳{bundleInfo.savings}</span>
                      </div>
                      <span className="text-xs text-slate-300 font-mono font-medium line-through decoration-rose-400/80">Original: ৳{bundleInfo.original_total}</span>
                    </div>
                  </div>

                  {/* 5 Events Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {bundleInfo.events.map((ev) => (
                      <div key={ev.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        isBundleSelected
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                          : 'bg-surface/60 border-surface-border text-slate-300'
                      }`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isBundleSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className="truncate">{ev.short_name || ev.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bundle Bonus Banner */}
                  <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border mb-5 transition-all ${
                    isBundleSelected
                      ? 'bg-amber-400/10 border-amber-400/40'
                      : 'bg-surface/40 border-surface-border'
                  }`}>
                    <span className="text-2xl">⚽</span>
                    <div>
                      <span className={`text-xs font-black uppercase tracking-wider ${isBundleSelected ? 'text-amber-300' : 'text-slate-400'}`}>Bundle Bonus!</span>
                      <p className="text-xs text-slate-300 leading-tight">{bundleInfo.bonus}</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  {isBundleSelected ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        Bundle Package Selected — ৳1,000 Total
                      </div>
                      <button
                        type="button"
                        onClick={deselectBundle}
                        className="px-4 py-2.5 rounded-xl border border-surface-border text-slate-400 text-xs font-semibold hover:text-rose-400 hover:border-rose-500/40 transition-all"
                      >
                        ✕ Deselect
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={selectBundle}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-sm transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-400/50 hover:scale-[1.01] active:scale-[0.99] group"
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Select Bundle — Pay Only ৳1,000 for 5 Events</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Individual Events Divider */}
            <div className="flex items-center gap-3 px-1">
              <div className="flex-1 h-px bg-surface-border" />
              <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider shrink-0">— or pick individual events —</span>
              <div className="flex-1 h-px bg-surface-border" />
            </div>

            <Card glow="none" className="border border-surface-border bg-surface-elevated/90 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Select Competitions to Enter</CardTitle>
                  <CardDescription>
                    Showing events eligible for <strong className="text-gold font-bold">Group {currentGroup} ({GRADE_OPTIONS.find(g => g.value === grade)?.label})</strong>.
                  </CardDescription>
                </div>
                <Badge variant="gold" size="md">
                  Group {currentGroup} Active
                </Badge>
              </div>

              <div className="space-y-3 mt-6">
                {eligibleEvents.map((ev) => {
                  const isSelected = !!selectedEvents[ev.id];
                  const meta = selectedEvents[ev.id];
                  const teamError = step2TeamErrors[ev.id];

                  return (

                    <div
                      key={ev.id}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-gold/10 border-gold shadow-md shadow-gold/10'
                          : 'bg-surface/60 border-surface-border hover:border-slate-500'
                      }`}
                      onClick={() => toggleEvent(ev)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 rounded text-gold accent-gold cursor-pointer shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                              <span className="font-bold text-white text-sm sm:text-base leading-snug">{ev.name}</span>
                              <span className="text-[10px] uppercase font-mono px-1.5 sm:px-2 py-0.5 rounded bg-surface border border-surface-border text-gold-light whitespace-nowrap">
                                {ev.category.replace('_', ' ')}
                              </span>
                            </div>

                            <div className="shrink-0 self-start sm:self-auto">
                              <span className="inline-block text-xs sm:text-sm font-mono font-bold text-gold">
                                {ev.fee_display}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{ev.description}</p>
                        </div>
                      </div>

                      {/* Team Fields when selected and event is Team/Both */}
                      {isSelected && (ev.event_type === 'TEAM' || ev.event_type === 'BOTH') && (
                        <div
                          className="mt-4 pt-4 border-t border-surface-border/60 space-y-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {ev.event_type === 'BOTH' && (
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-200 mb-2">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`event_type_${ev.id}`}
                                  checked={!meta?.is_team}
                                  onChange={() =>
                                    setSelectedEvents((p) => ({
                                      ...p,
                                      [ev.id]: { ...p[ev.id], is_team: false },
                                    }))
                                  }
                                  className="accent-gold"
                                />
                                Individual (৳{ev.individual_fee})
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`event_type_${ev.id}`}
                                  checked={meta?.is_team}
                                  onChange={() =>
                                    setSelectedEvents((p) => ({
                                      ...p,
                                      [ev.id]: { ...p[ev.id], is_team: true },
                                    }))
                                  }
                                  className="accent-gold"
                                />
                                Team Participation (৳{ev.team_fee})
                              </label>
                            </div>
                          )}

                          {(meta?.is_team || ev.event_type === 'TEAM') && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[11px] font-bold text-slate-200 uppercase block mb-1">
                                    Team Name <span className="text-rose-400">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. CyberJosephites"
                                    value={meta?.team_name || ''}
                                    onChange={(e) =>
                                      setSelectedEvents((p) => ({
                                        ...p,
                                        [ev.id]: { ...p[ev.id], team_name: e.target.value },
                                      }))
                                    }
                                    className={`w-full px-3 py-2 rounded-lg bg-surface border text-white placeholder:text-slate-500 text-xs focus:outline-none ${
                                      teamError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-surface-border focus:border-gold'
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-bold text-slate-200 uppercase block mb-1">
                                    Teammate Names (comma-separated)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Tanvir Ahmed, Rafi Hasan"
                                    value={meta?.team_members || ''}
                                    onChange={(e) =>
                                      setSelectedEvents((p) => ({
                                        ...p,
                                        [ev.id]: { ...p[ev.id], team_members: e.target.value },
                                      }))
                                    }
                                    className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-gold"
                                  />
                                </div>
                              </div>
                              {teamError && (
                                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" /> {teamError}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sticky Cart Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <Card glow="none" className="border border-gold/40 bg-surface-elevated/95 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <span className="text-xs uppercase font-bold text-slate-200 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-gold" /> Selection Cart
                </span>
                {isBundleSelected ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold">Bundle ✓</span>
                ) : (
                  <Badge variant="gold" size="sm">
                    {Object.keys(selectedEvents).length} Item(s)
                  </Badge>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2 py-3 max-h-64 overflow-y-auto">
                {isBundleSelected && bundleInfo ? (
                  <>
                    <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Bundle Package (5 Events)
                        </span>
                        <span className="font-mono font-black text-emerald-400">৳1,000</span>
                      </div>
                      <div className="space-y-1">
                        {bundleInfo.events.map((ev) => (
                          <div key={ev.id} className="flex items-center gap-1.5 text-[10px] text-emerald-200/70">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{ev.short_name || ev.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-[10px] text-amber-300">
                      <span>⚽</span>
                      <span className="font-semibold">Bonus: FC Game Zone Round included!</span>
                    </div>
                  </>
                ) : Object.keys(selectedEvents).length > 0 ? (
                  Object.entries(selectedEvents).map(([idStr, meta]) => {
                    const event = events.find((e) => e.id === parseInt(idStr, 10));
                    if (!event) return null;
                    const fee = meta.is_team ? event.team_fee : event.individual_fee;

                    return (
                      <div key={idStr} className="p-2.5 rounded-lg bg-surface flex items-center justify-between text-xs gap-2 border border-surface-border">
                        <div className="truncate flex-1">
                          <span className="font-bold text-white block truncate">{event.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {meta.is_team ? 'Team' : 'Individual'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-gold">৳{fee}</span>
                          <button
                            type="button"
                            onClick={() => removeEvent(event.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No competitions selected yet.</p>
                )}
              </div>

              {/* Running Total & Action */}
              <div className="pt-4 border-t border-surface-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold">Total Amount Due:</span>
                  <span className={`text-2xl font-black font-mono ${isBundleSelected ? 'text-emerald-400' : 'text-white text-glow-gold'}`}>
                    ৳{totalFee} BDT
                  </span>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="glow"
                    size="lg"
                    className="w-full justify-center text-sm font-black py-3 rounded-xl shadow-xl shadow-amber-500/20 group flex items-center gap-2"
                    onClick={handleStep2Next}
                  >
                    <span>Proceed to Payment</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/20 text-slate-900 font-extrabold uppercase">
                      Step 3 →
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full justify-center py-2 text-xs" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Step 1
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* STEP 3: 100% Online SSLCommerz Payment Gateway */}
      {step === 3 && (
        <Card glow="none" className="border border-gold/40 bg-surface-elevated/95 backdrop-blur-xl space-y-6 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-gold/40 text-xs font-mono font-bold text-gold mb-1.5">
              <Zap className="w-3.5 h-3.5" /> SECURE ONLINE PAYMENT GATEWAY
            </div>
            <CardTitle className="text-xl sm:text-2xl">Complete Festival Registration</CardTitle>
            <CardDescription>
              All entry fees are processed securely via SSLCommerz with instant digital entry pass verification.
            </CardDescription>
          </div>

          {/* Registration Review Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface/80 border border-surface-border text-xs space-y-3">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block border-b border-surface-border pb-2">
              Contestant & Arena Manifest:
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1">
              <span className="text-slate-400 shrink-0">Contestant:</span>
              <strong className="text-white text-left sm:text-right">{name} ({GRADE_OPTIONS.find(g => g.value === grade)?.label})</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1">
              <span className="text-slate-400 shrink-0">Institution:</span>
              <strong className="text-white text-left sm:text-right break-words">{schoolId === 'other' ? schoolOther : schools.find(s => s.id === parseInt(schoolId))?.name}</strong>
            </div>
            
            {/* Bundle or Individual Events display */}
            {isBundleSelected && bundleInfo ? (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-black uppercase tracking-wider text-[11px]">Bundle Competition Package (5 Events)</span>
                </div>
                <div className="pl-5 space-y-1">
                  {bundleInfo.events.map((ev) => (
                    <div key={ev.id} className="flex items-center gap-1.5 text-emerald-200/80">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{ev.short_name || ev.name}</span>
                      <span className="text-slate-500 font-mono ml-auto">৳{ev.individual_fee}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-300 mt-1">
                  <span>⚽</span>
                  <span className="font-bold">Bundle Bonus: {bundleInfo.bonus}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 line-through decoration-rose-400/80 font-mono">Original: ৳{bundleInfo.original_total}</span>
                  <span className="text-emerald-400 font-bold">You save ৳{bundleInfo.savings}!</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1">
                <span className="text-slate-400 shrink-0">Selected Events ({Object.keys(selectedEvents).length}):</span>
                <span className="text-slate-200 font-semibold text-left sm:text-right break-words">
                  {Object.keys(selectedEvents).map(id => events.find(e => e.id === parseInt(id))?.name).join(', ')}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-slate-200 border-t border-surface-border pt-3 text-sm">
              <span className="font-bold text-white">Grand Total Fee:</span>
              <strong className="text-gold font-mono text-xl font-black text-glow-gold">৳{totalFee} BDT</strong>
            </div>
          </div>

          {/* SSLCommerz Gateway Channel Container */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-surface via-[#001f4d] to-surface-elevated border border-gold/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center text-gold border border-gold/40 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">SSLCommerz Automated Payment</h4>
                  <p className="text-[11px] text-slate-300">Official Payment Gateway Partner of JTC 2026</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600 font-extrabold tracking-wider self-start sm:self-auto">
                Instant Pass Activation ⚡
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              Upon clicking the button below, you will be redirected to the secure SSLCommerz payment page to complete your payment of <strong className="text-gold font-mono font-bold">৳{totalFee} BDT</strong>.
            </p>

            {/* Payment Channel Pills */}
            <div className="space-y-2 pt-2 border-t border-surface-border/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Supported Channels:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
                <span className="px-3 py-1 rounded-lg bg-surface border border-surface-border font-semibold flex items-center gap-1.5">
                  💳 Visa / MasterCard / Amex
                </span>
                <span className="px-3 py-1 rounded-lg bg-surface border border-surface-border text-pink-400 font-bold">
                  bKash
                </span>
                <span className="px-3 py-1 rounded-lg bg-surface border border-surface-border text-orange-400 font-bold">
                  Nagad
                </span>
                <span className="px-3 py-1 rounded-lg bg-surface border border-surface-border text-purple-400 font-bold">
                  Rocket
                </span>
                <span className="px-3 py-1 rounded-lg bg-surface border border-surface-border text-emerald-400 font-bold">
                  Upay
                </span>
                <span className="px-3 py-1 rounded-lg bg-surface border border-surface-border text-sky-400 font-semibold">
                  🏦 All Major BD Banks
                </span>
              </div>
            </div>
          </div>

          {/* Cloudflare Turnstile Bot Defense */}
          <Turnstile onSuccess={(tok) => setTurnstileToken(tok)} />

          {/* Navigation & Submit CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-surface-border gap-3">
            <Button variant="secondary" size="sm" onClick={() => setStep(2)} className="w-full sm:w-auto py-2.5">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Competitions
            </Button>
            <Button
              variant="glow"
              size="lg"
              isLoading={loading}
              onClick={handleSubmit}
              className="w-full sm:w-auto px-5 sm:px-8 py-3.5 rounded-xl font-black text-xs sm:text-base shadow-2xl shadow-amber-500/30 group flex items-center justify-center gap-2 text-center"
            >
              <Zap className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Proceed to SSLCommerz Checkout (৳{totalFee} BDT)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </Button>
          </div>
        </Card>
      )}
      </>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-white font-mono">Loading registration form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
