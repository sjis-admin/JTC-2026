'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { toggleRegistration, adminFetch, fetchSiteSettings } from '@/lib/api';
import {
  Power,
  PowerOff,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MasterRegistrationControlProps {
  variant?: 'header' | 'banner' | 'card';
  className?: string;
  onStatusChange?: (open: boolean) => void;
}

export default function MasterRegistrationControl({
  variant = 'header',
  className = '',
  onStatusChange,
}: MasterRegistrationControlProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('Registration is currently open.');
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  const loadStatus = async () => {
    try {
      // Fetch fresh settings
      const data = await fetchSiteSettings({ fresh: true });
      if (data) {
        setIsOpen(data.registration_open_raw !== undefined ? data.registration_open_raw : data.registration_open);
        setIsActive(data.registration_open);
        setStatusMessage(data.registration_status_message || (data.registration_open ? 'Registration is open.' : 'Registration is closed.'));
      }
    } catch (err) {
      console.warn('Failed to load live registration status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();

    const handleSync = (e: any) => {
      if (e.detail) {
        setIsOpen(e.detail.registration_open);
        setIsActive(e.detail.is_active);
        if (e.detail.status_message) {
          setStatusMessage(e.detail.status_message);
        }
        if (onStatusChange) {
          onStatusChange(e.detail.registration_open);
        }
      }
    };

    window.addEventListener('jtc_registration_status_changed', handleSync);
    return () => {
      window.removeEventListener('jtc_registration_status_changed', handleSync);
    };
  }, [onStatusChange]);

  const handleToggle = async () => {
    const targetState = !isOpen;
    setUpdating(true);
    try {
      const res = await toggleRegistration(targetState);
      setIsOpen(res.registration_open);
      setIsActive(res.is_active);
      setStatusMessage(res.status_message);
      setShowModal(false);

      const msg = targetState
        ? 'Registration successfully turned ON. Students can now register.'
        : 'Registration turned OFF. Frontend & Backend are now blocking submissions.';
      setToastMessage({ text: msg, type: targetState ? 'success' : 'danger' });
      setTimeout(() => setToastMessage(null), 4500);

      if (onStatusChange) {
        onStatusChange(res.registration_open);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle registration state.');
    } finally {
      setUpdating(false);
    }
  };

  const isActuallyOpen = isOpen && isActive;

  // ─── Modal Dialog ────────────────────────────────────────────────────────────
  const confirmationModal = showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-surface-elevated border border-surface-border shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border',
              isOpen
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-400 shadow-lg shadow-rose-950/50'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-950/50'
            )}
          >
            {isOpen ? <PowerOff className="w-6 h-6 animate-pulse" /> : <Power className="w-6 h-6 text-emerald-400" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              {isOpen ? 'Turn OFF Student Registration?' : 'Turn ON Student Registration?'}
            </h3>
            <p className="text-xs text-slate-400">Master Carnival Registration Gate</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface border border-surface-border space-y-2 text-xs text-slate-300">
          <p>
            {isOpen ? (
              <>
                <strong className="text-rose-400 block mb-1">Impact Warning:</strong>
                Turning OFF registration will <span className="text-white font-bold">instantly block</span> all new registrations across the frontend portal and reject all student submission & authentication requests on the backend with <code className="text-gold font-mono px-1 py-0.5 bg-black/40 rounded">HTTP 403 Forbidden</code>.
              </>
            ) : (
              <>
                <strong className="text-emerald-400 block mb-1">Ready to Open:</strong>
                Turning ON registration will <span className="text-white font-bold">immediately open</span> the registration portal to contestants, re-enabling online event selection, bundle discounts, and payment confirmation.
              </>
            )}
          </p>
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 pt-1 border-t border-surface-border">
            <Radio className="w-3 h-3 text-gold animate-pulse" /> Live Status: {statusMessage}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowModal(false)}
            disabled={updating}
            className="text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleToggle}
            disabled={updating}
            className={cn(
              'text-xs font-bold px-4 py-2 flex items-center gap-2 shadow-lg',
              isOpen
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            )}
          >
            {updating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isOpen ? 'Yes, Turn OFF Now' : 'Yes, Turn ON Now'}
          </Button>
        </div>
      </div>
    </div>
  );

  // ─── Variant: Banner (For Dashboard Hero) ───────────────────────────────────
  if (variant === 'banner') {
    return (
      <>
        {confirmationModal}
        <div
          className={cn(
            'p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden',
            isActuallyOpen
              ? 'bg-gradient-to-r from-emerald-950/70 via-surface-elevated/90 to-surface-elevated border-emerald-500/50 shadow-xl shadow-emerald-950/20'
              : 'bg-gradient-to-r from-rose-950/80 via-surface-elevated/95 to-surface-elevated border-rose-500/60 shadow-xl shadow-rose-950/30',
            className
          )}
        >
          {/* Subtle background glow */}
          <div
            className={cn(
              'absolute top-0 right-0 w-64 h-32 blur-3xl pointer-events-none rounded-full',
              isActuallyOpen ? 'bg-emerald-500/10' : 'bg-rose-500/15'
            )}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-inner',
                  isActuallyOpen
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400'
                    : 'bg-rose-500/20 border-rose-400/40 text-rose-400'
                )}
              >
                {isActuallyOpen ? (
                  <Unlock className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Lock className="w-5 h-5 text-rose-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase border inline-flex items-center gap-1.5',
                      isActuallyOpen
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-sm'
                        : 'bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-sm'
                    )}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        isActuallyOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                      )}
                    />
                    {isActuallyOpen ? 'REGISTRATIONS: LIVE / ON' : 'REGISTRATIONS: PAUSED / OFF'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">• Master Gate</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mt-1 font-display">
                  {isActuallyOpen
                    ? 'Registration Portal is Live & Accepting Entries'
                    : 'Registration is Frozen — Students Are Blocked'}
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                  {isActuallyOpen
                    ? 'Students can browse competitions and submit registration fees. All backend validations are active.'
                    : 'Portal is currently locked. Students visiting the registration page will see an official closed notice.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <Button
                type="button"
                size="md"
                onClick={() => setShowModal(true)}
                disabled={loading || updating}
                className={cn(
                  'font-bold text-xs sm:text-sm px-4 py-2.5 flex items-center gap-2 rounded-xl transition-all shadow-lg cursor-pointer',
                  isActuallyOpen
                    ? 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400/50 hover:shadow-rose-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 hover:shadow-emerald-600/30'
                )}
              >
                {updating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isActuallyOpen ? (
                  <PowerOff className="w-4 h-4" />
                ) : (
                  <Power className="w-4 h-4" />
                )}
                <span>{isActuallyOpen ? 'Turn OFF Registration' : 'Turn ON Registration'}</span>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Variant: Card (For Settings Page) ──────────────────────────────────────
  if (variant === 'card') {
    return (
      <>
        {confirmationModal}
        <div
          className={cn(
            'p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3',
            isActuallyOpen
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200',
            className
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'w-3 h-3 rounded-full shrink-0',
                isActuallyOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              )}
            />
            <div>
              <span className="font-bold text-xs block text-white">
                Master Toggle Status: {isActuallyOpen ? 'Active (Open)' : 'Disabled (Paused)'}
              </span>
              <span className="text-[11px] text-slate-300">{statusMessage}</span>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => setShowModal(true)}
            disabled={loading || updating}
            className={cn(
              'text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 shrink-0 self-start sm:self-center',
              isActuallyOpen
                ? 'bg-rose-700/80 hover:bg-rose-600 text-white border border-rose-500/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50'
            )}
          >
            {updating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isActuallyOpen ? (
              <PowerOff className="w-3.5 h-3.5" />
            ) : (
              <Power className="w-3.5 h-3.5" />
            )}
            <span>{isActuallyOpen ? 'Turn OFF Registration' : 'Turn ON Registration'}</span>
          </Button>
        </div>
      </>
    );
  }

  // ─── Variant: Header (Top Navigation Bar) ───────────────────────────────────
  return (
    <>
      {confirmationModal}
      <div className={cn('flex items-center gap-2 sm:gap-3', className)}>
        {/* Live Status Pill */}
        <div
          className={cn(
            'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold transition-colors select-none',
            isActuallyOpen
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-950/40'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-sm shadow-rose-950/40 animate-pulse'
          )}
        >
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              isActuallyOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            )}
          />
          <span className="tracking-wide">
            {isActuallyOpen ? 'REGISTRATION: ON' : 'REGISTRATION: OFF'}
          </span>
        </div>

        {/* Master Action Button */}
        <Button
          type="button"
          size="sm"
          onClick={() => setShowModal(true)}
          disabled={loading || updating}
          className={cn(
            'text-xs font-extrabold px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer',
            isActuallyOpen
              ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/60 hover:border-rose-400 shadow-rose-950/40'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow-emerald-950/60 shadow-lg'
          )}
          title={isActuallyOpen ? 'Click to pause/freeze registrations' : 'Click to resume registrations'}
        >
          {updating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isActuallyOpen ? (
            <PowerOff className="w-3.5 h-3.5 text-rose-300" />
          ) : (
            <Power className="w-3.5 h-3.5 text-white" />
          )}
          <span>{isActuallyOpen ? 'Turn OFF' : 'Turn ON'}</span>
        </Button>

        {/* Feedback Toast */}
        {toastMessage && (
          <div
            className={cn(
              'fixed bottom-6 right-6 z-50 p-4 rounded-xl border shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in slide-in-from-bottom-5 duration-300 max-w-md',
              toastMessage.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500 shadow-emerald-950/80'
                : 'bg-rose-950/95 text-rose-200 border-rose-500 shadow-rose-950/80'
            )}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}
      </div>
    </>
  );
}
