'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Save, Check, Bell, MessageSquare, Mail, Calendar, Sparkles, Clock, AlertTriangle, ShieldCheck, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';

const toInputDateTime = (val: string | null | undefined) => {
  if (!val) return '';
  if (val.length === 10) return `${val}T00:00`;
  return val.slice(0, 16);
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [showStorePass, setShowStorePass] = useState(false);

  useEffect(() => {
    adminFetch('/admin/settings/')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      Object.keys(settings).forEach((key) => {
        if (key !== 'logo' && key !== 'logo_url' && settings[key] !== null && settings[key] !== undefined) {
          formData.append(key, settings[key]);
        }
      });

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await adminFetch('/admin/settings/', {
        method: 'PATCH',
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Compute live preview status
  const getComputedStatus = () => {
    if (!settings) return null;
    if (!settings.registration_open) {
      return { status: 'PAUSED', color: 'bg-rose-950/80 text-rose-300 border-rose-600', label: 'Manual Pause Active', desc: 'Registrations are locked by the Master Toggle.' };
    }

    const now = new Date();
    if (settings.registration_start_date) {
      const start = new Date(settings.registration_start_date);
      if (now < start) {
        return { status: 'UPCOMING', color: 'bg-amber-950/80 text-amber-300 border-amber-600', label: 'Upcoming / Scheduled', desc: `Registration opens on ${start.toLocaleString()}` };
      }
    }

    if (settings.registration_deadline) {
      const end = new Date(settings.registration_deadline);
      if (now > end) {
        return { status: 'CLOSED', color: 'bg-rose-950/80 text-rose-300 border-rose-600', label: 'Registration Closed', desc: `Registration deadline passed on ${end.toLocaleString()}` };
      }
    }

    return { status: 'ACTIVE', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-600', label: 'Live & Accepting Registrations', desc: 'Participants can freely register online.' };
  };

  const currentStatus = getComputedStatus();

  if (loading) {
    return <div className="text-gold font-mono text-sm">Loading site configuration...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-gold/40 text-xs font-mono font-bold text-gold mb-1">
          <Sparkles className="w-3.5 h-3.5" /> PLATFORM CONTROLS & DATES
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Site Settings & Registration Window
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure dynamic registration start/end days, carnival dates, GreenWeb SMS, and notification channels.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Settings and registration window successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Dynamic Registration Window Control */}
        <Card glow="gold" className="border border-gold/40 bg-surface-elevated/95 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 text-gold font-display">
                <Clock className="w-5 h-5 text-gold" /> Dynamic Registration Window
              </CardTitle>
              <p className="text-xs text-slate-300 mt-0.5">
                Control the precise start and closing dates/times when students can submit entries.
              </p>
            </div>
            {currentStatus && (
              <span className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${currentStatus.color}`}>
                ● {currentStatus.label}
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-surface-border text-xs text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-mono text-[11px]">Active Policy:</strong>
              <span>{currentStatus?.desc}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Registration Opens (Start Date & Time)
              </label>
              <input
                type="datetime-local"
                value={toInputDateTime(settings?.registration_start_date)}
                onChange={(e) => setSettings({ ...settings, registration_start_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white text-xs font-mono focus:border-gold outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Leave empty to open immediately.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Registration Closes (Deadline Date & Time)
              </label>
              <input
                type="datetime-local"
                value={toInputDateTime(settings?.registration_deadline)}
                onChange={(e) => setSettings({ ...settings, registration_deadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white text-xs font-mono focus:border-gold outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Leave empty for no closing deadline.</span>
            </div>
          </div>

          <div className="pt-2 border-t border-surface-border">
            <label className="flex items-center gap-2.5 text-slate-100 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.registration_open || false}
                onChange={(e) => setSettings({ ...settings, registration_open: e.target.checked })}
                className="w-4 h-4 accent-gold rounded cursor-pointer"
              />
              <span>Master Registration Toggle (Check to enable; uncheck to instantly freeze/pause all registrations)</span>
            </label>
          </div>
        </Card>

        {/* Carnival Event Dates */}
        <Card glow="none" className="border border-surface-border bg-surface space-y-4">
          <CardTitle className="text-lg flex items-center gap-2 text-gold">
            <Calendar className="w-5 h-5 text-gold" /> Carnival Festival Dates
          </CardTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Carnival Start Date"
              type="date"
              value={settings?.carnival_start_date || ''}
              onChange={(e) => setSettings({ ...settings, carnival_start_date: e.target.value })}
            />
            <Input
              label="Carnival End Date"
              type="date"
              value={settings?.carnival_end_date || ''}
              onChange={(e) => setSettings({ ...settings, carnival_end_date: e.target.value })}
            />
          </div>
        </Card>

        {/* Branding & Info */}
        <Card glow="none" className="border border-surface-border bg-surface space-y-4">
          <CardTitle className="text-lg flex items-center gap-2 text-gold">
            Branding & Carnival Identity
          </CardTitle>

          <Input
            label="Carnival Title"
            value={settings?.carnival_name || ''}
            onChange={(e) => setSettings({ ...settings, carnival_name: e.target.value })}
          />

          <Input
            label="Tagline / Subtitle"
            value={settings?.tagline || ''}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />

          <Input
            label="Campus Venue Details"
            value={settings?.venue || ''}
            onChange={(e) => setSettings({ ...settings, venue: e.target.value })}
          />

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold uppercase text-slate-300">
              Upload Custom JTC Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface-elevated file:text-gold hover:file:bg-surface cursor-pointer"
            />
            {settings?.logo_url && (
              <div className="mt-3 flex items-center gap-3.5 p-3 rounded-xl bg-surface-elevated/80 border border-gold/30">
                <div className="w-14 h-14 rounded-lg bg-surface border border-gold/40 flex items-center justify-center overflow-hidden p-1.5 shrink-0 shadow-inner">
                  <img
                    src={settings.logo_url}
                    alt="Active JTC Logo"
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>
                <div className="text-xs space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-200 font-semibold">Active Logo Live across Website & Admin</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate select-all">{settings.logo_url}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Information, Helpdesk & Social Links */}
        <Card glow="none" className="border border-surface-border bg-surface space-y-4">
          <CardTitle className="text-lg flex items-center gap-2 text-gold">
            <Phone className="w-5 h-5 text-teal-400" /> Helpdesk Contact Numbers & Socials
          </CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Helpline / Contact Numbers"
              placeholder="e.g. +880 2-9116271, +880 1700-000000"
              value={settings?.contact_phone || ''}
              onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
            />
            <Input
              label="Support / Helpdesk Email"
              placeholder="e.g. jtc@sjis.edu.bd"
              value={settings?.contact_email || ''}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Input
              label="Facebook Page URL"
              placeholder="https://facebook.com/..."
              value={settings?.facebook_url || ''}
              onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
            />
            <Input
              label="Instagram Profile URL"
              placeholder="https://instagram.com/..."
              value={settings?.instagram_url || ''}
              onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
            />
            <Input
              label="YouTube Channel URL"
              placeholder="https://youtube.com/..."
              value={settings?.youtube_url || ''}
              onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
            />
          </div>
        </Card>

        {/* SSLCommerz Payment Gateway Configuration */}
        <Card glow="none" className="border border-surface-border bg-surface space-y-4">
          <CardTitle className="text-lg flex items-center justify-between text-gold">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" /> SSLCommerz Instant Payment Gateway
            </div>
            {settings?.sslcommerz_is_sandbox ? (
              <Badge variant="gold" size="sm">SANDBOX / TEST MODE</Badge>
            ) : (
              <Badge variant="teal" size="sm">LIVE PRODUCTION MODE</Badge>
            )}
          </CardTitle>

          <div className="pt-1 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-slate-200 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.sslcommerz_enabled !== false}
                onChange={(e) => setSettings({ ...settings, sslcommerz_enabled: e.target.checked })}
                className="accent-gold"
              />
              <span>Enable Instant Online Checkout (Cards / bKash / Nagad / Rocket)</span>
            </label>

            <label className="flex items-center gap-2 text-amber-300 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.sslcommerz_is_sandbox || false}
                onChange={(e) => setSettings({ ...settings, sslcommerz_is_sandbox: e.target.checked })}
                className="accent-amber-400"
              />
              <span>Sandbox / Testing Mode (Uncheck for Live Payments)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Store ID (Merchant ID)"
              placeholder="e.g. sjis2026live"
              value={settings?.sslcommerz_store_id || ''}
              onChange={(e) => setSettings({ ...settings, sslcommerz_store_id: e.target.value })}
              helperText="Issued in your official SSLCommerz welcome email"
            />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Store Password / Secret Key
                </label>
                {settings?.sslcommerz_store_pass && (
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved & Active
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showStorePass ? 'text' : 'password'}
                  placeholder="Enter your store password"
                  value={settings?.sslcommerz_store_pass || ''}
                  onChange={(e) => setSettings({ ...settings, sslcommerz_store_pass: e.target.value })}
                  className="w-full bg-surface border border-surface-border focus:border-gold/60 focus:ring-1 focus:ring-gold/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowStorePass(!showStorePass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold transition-colors cursor-pointer"
                  title={showStorePass ? 'Hide password' : 'Show password'}
                >
                  {showStorePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Secret credential provided by SSLCommerz</p>
            </div>
          </div>
        </Card>

        {/* Announcement Marquee */}
        <Card glow="none" className="border border-surface-border bg-surface space-y-4">
          <CardTitle className="text-lg flex items-center gap-2 text-gold">
            <Bell className="w-5 h-5 text-amber-400" /> Scrolling Announcement Banner
          </CardTitle>
          <Input
            label="Banner Announcement Text"
            placeholder="e.g. ⚡ Registrations are now live for SJIS Inter-School Tech Carnival 2026!"
            value={settings?.announcement_banner || ''}
            onChange={(e) => setSettings({ ...settings, announcement_banner: e.target.value })}
          />
        </Card>

        {/* GreenWeb SMS Config */}
        <Card glow="none" className="border border-surface-border bg-surface space-y-4">
          <CardTitle className="text-lg flex items-center gap-2 text-gold">
            <MessageSquare className="w-5 h-5 text-emerald-400" /> GreenWeb SMS Gateway
          </CardTitle>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-slate-200 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.sms_enabled || false}
                onChange={(e) => setSettings({ ...settings, sms_enabled: e.target.checked })}
                className="accent-gold"
              />
              <span>Enable Automatic GreenWeb SMS on Registration</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GreenWeb Token / Username"
              placeholder="e.g. 10234..."
              value={settings?.sms_user || ''}
              onChange={(e) => setSettings({ ...settings, sms_user: e.target.value })}
            />
            <Input
              label="Sender Mask / ID"
              placeholder="JTCSJIS"
              value={settings?.sms_from || 'JTCSJIS'}
              onChange={(e) => setSettings({ ...settings, sms_from: e.target.value })}
            />
          </div>
        </Card>

        {/* Email Gateway */}
        <Card glow="none" className="border border-surface-border bg-surface space-y-4">
          <CardTitle className="text-lg flex items-center gap-2 text-gold">
            <Mail className="w-5 h-5 text-sky-400" /> Email Notifications
          </CardTitle>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-slate-200 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.email_confirmation_enabled || false}
                onChange={(e) => setSettings({ ...settings, email_confirmation_enabled: e.target.checked })}
                className="accent-gold"
              />
              <span>Send HTML Confirmation Email upon Registration</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact / Support Email"
              value={settings?.contact_email || ''}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            />
            <Input
              label="Sender Display Name"
              value={settings?.email_from_name || 'Josephite Tech Club'}
              onChange={(e) => setSettings({ ...settings, email_from_name: e.target.value })}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="glow" size="lg" type="submit" isLoading={saving} className="font-bold">
            <Save className="w-4 h-4 mr-1.5" /> Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
