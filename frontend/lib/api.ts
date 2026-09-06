export function getApiBase(): string {
  if (typeof window === 'undefined') {
    // Server-side (SSR inside Docker or Node.js)
    if (process.env.INTERNAL_API_URL) return process.env.INTERNAL_API_URL;
    if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith('http')) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return 'http://backend:8000/api';
  }
  // Client-side (Browser)
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;
  if (publicUrl && publicUrl.startsWith('http')) return publicUrl;
  return '/api';
}

export const API_BASE = getApiBase();
export const ADMIN_AUTH_PATH = process.env.NEXT_PUBLIC_ADMIN_AUTH_PATH || '/jtc-portal-auth-2026';

export interface EventGroup {
  id?: number;
  code: 'A' | 'B' | 'C' | 'D' | 'E';
  label: string;
  grade_range: string;
}

export interface EventFAQ {
  id?: number;
  question: string;
  answer: string;
  order?: number;
}

export interface EventItem {
  id: number;
  name: string;
  slug: string;
  short_name: string;
  category: 'AI' | 'CODING' | 'DIGITAL_ART' | 'GAMING' | 'ESPORTS' | 'ROBOTICS' | 'QUIZ' | 'CREATIVE' | 'TYPING' | 'OTHER';
  description: string;
  rules?: string;
  judging_criteria?: string;
  event_type: 'INDIVIDUAL' | 'TEAM' | 'BOTH';
  individual_fee: number;
  team_fee: number;
  team_min: number;
  team_max: number;
  eligibility_groups: EventGroup[];
  submission_type: 'ONLINE' | 'PENDRIVE' | 'STAGE' | 'LAB' | 'PHYSICAL' | 'MIXED';
  venue_detail: string;
  is_active: boolean;
  highlight: boolean;
  icon: string;
  fee_display: string;
  registered_count: number;
  order: number;
  faqs?: EventFAQ[];
}

export interface SchoolItem {
  id: number;
  name: string;
  short_name: string;
  is_active?: boolean;
  order?: number;
}

export interface SiteSettingsData {
  carnival_name: string;
  carnival_start_date: string | null;
  carnival_end_date: string | null;
  venue: string;
  tagline: string;
  registration_open: boolean;
  registration_open_raw?: boolean;
  registration_start_date: string | null;
  registration_deadline: string | null;
  registration_status_message?: string;
  contact_email: string;
  contact_phone: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  announcement_banner: string;
  logo_url: string | null;
}

export interface RegistrationPayload {
  name: string;
  email: string;
  phone: string;
  school_id: number | null;
  school_name_other?: string;
  grade: string;
  is_bundle?: boolean;
  events: {
    event_id: number;
    is_team?: boolean;
    team_name?: string;
    team_members?: string;
  }[];
  payment_method: 'SSLCOMMERZ' | 'BKASH' | 'NAGAD' | 'BANK';
  payment_reference: string;
  turnstile_token?: string;
}

export interface BundleInfoData {
  price: number;
  original_total: number;
  savings: number;
  eligible_groups: string[];
  eligible_groups_display?: string;
  eligibility_note?: string;
  bonus: string;
  events: EventItem[];
}

export const BUNDLE_ELIGIBLE_GROUPS = ['A', 'B', 'C', 'D'];

export const BUNDLE_EVENT_SLUGS = [
  'coding-marathon',
  'gaming-quiz',
  'swifttype-blitz',
  'tech-art-bonanza',
  'tech-memes',
];

export interface RegistrationResponse {
  confirmation_code: string;
  short_code: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_grade: string;
  participant_school: string;
  total_fee: number;
  payment_method: string;
  payment_reference: string;
  payment_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'REFUNDED' | 'EXPIRED';
  payment_status_display: string;
  is_bundle: boolean;
  bundle_bonus_fc: boolean;
  email_sent: boolean;
  sms_sent: boolean;
  registered_at: string;
  registration_events: {
    event: EventItem;
    is_team: boolean;
    team_name: string;
    team_members: string;
    fee_charged: number;
  }[];
}

// ─── Public API Helpers ────────────────────────────────────────────────────────

export async function fetchSiteSettings(): Promise<SiteSettingsData> {
  try {
    const res = await fetch(`${getApiBase()}/settings/`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (err) {
    console.warn('API fetchSiteSettings fallback:', err);
    return {
      carnival_name: 'SJIS Inter-School Tech Carnival 2026',
      carnival_start_date: '2026-10-01',
      carnival_end_date: '2026-10-02',
      venue: 'St. Joseph International School, 97 Asad Avenue, Mohammadpur, Dhaka 1207',
      tagline: 'Inspiring Innovation, Igniting Future Technologists',
      registration_open: true,
      registration_start_date: '2026-09-01T00:00:00+06:00',
      registration_deadline: '2026-09-28T23:59:59+06:00',
      contact_email: 'jtc@sjis.edu.bd',
      contact_phone: '+880 2-9116271',
      facebook_url: 'https://facebook.com',
      instagram_url: 'https://instagram.com',
      youtube_url: 'https://youtube.com',
      announcement_banner: '⚡ Registrations for SJIS Inter-School Tech Carnival 2026 are now open! Explore 18 exciting events and register today.',
      logo_url: null,
    };
  }
}

import { CARNIVAL_EVENTS } from './carnivalEvents';

export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/events/`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.results || [];
    return list.length > 0 ? list : CARNIVAL_EVENTS;
  } catch (err) {
    console.warn('API fetchEvents failed or offline, using official Holy Grail events fallback:', err);
    return CARNIVAL_EVENTS;
  }
}

export async function fetchBundleInfo(): Promise<BundleInfoData> {
  try {
    const res = await fetch(`${getApiBase()}/bundle-info/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch bundle info');
    return await res.json();
  } catch (err) {
    console.warn('fetchBundleInfo fallback to static data:', err);
    // Fallback: derive from CARNIVAL_EVENTS
    const bundleSlugs = ['coding-marathon', 'gaming-quiz', 'swifttype-blitz', 'tech-art-bonanza', 'tech-memes'];
    const bundleEvents = CARNIVAL_EVENTS.filter(e => bundleSlugs.includes(e.slug));
    const originalTotal = bundleEvents.reduce((s, e) => s + e.individual_fee, 0);
    const price = 1000;
    return {
      price,
      original_total: originalTotal,
      savings: originalTotal - price,
      eligible_groups: ['A', 'B', 'C', 'D'],
      eligible_groups_display: 'Groups A to D (Grade 3 to Grade 12)',
      eligibility_note: 'The 5-in-1 Festival Bundle Offer is exclusively applicable for School & College contestants (Groups A to D, Grade 3 to Grade 12). University participants (Group E) must register for individual collegiate competitions.',
      bonus: 'One free round of FC playing in the Game Zone!',
      events: bundleEvents,
    };
  }
}

export async function fetchEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const res = await fetch(`${getApiBase()}/events/${slug}/`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.slug) return data;
    }
  } catch (err) {
    console.warn(`API fetchEventBySlug(${slug}) fallback:`, err);
  }
  return CARNIVAL_EVENTS.find((e) => e.slug === slug) || null;
}

export async function fetchSchools(): Promise<SchoolItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/schools/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch schools');
    return await res.json();
  } catch (err) {
    console.error('API fetchSchools failed:', err);
    return [];
  }
}

export async function submitRegistration(payload: RegistrationPayload): Promise<RegistrationResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  // Attach the registration gate session token if present (non-blocking if missing)
  if (typeof window !== 'undefined') {
    const sessionToken = sessionStorage.getItem('jtc_reg_session');
    if (sessionToken) headers['X-Auth-Session'] = sessionToken;
  }

  const res = await fetch(`${getApiBase()}/registrations/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = typeof data === 'object' ? Object.values(data).flat().join(', ') : 'Registration failed';
    throw new Error(errorMsg);
  }
  return data;
}

export async function lookupRegistration(code: string): Promise<RegistrationResponse> {
  const res = await fetch(`${getApiBase()}/registrations/${code}/`);
  if (!res.ok) throw new Error('Registration not found');
  return await res.json();
}

// ─── Auth Gate API Helpers ─────────────────────────────────────────────────────

export interface AuthSessionResult {
  session_token: string;
  email: string;
  name?: string;
  picture?: string;
  auth_method: 'google' | 'guest';
}

/** Verifies a Google ID token with our backend and returns a session JWT. */
export async function verifyGoogleToken(credential: string): Promise<AuthSessionResult> {
  const res = await fetch(`${getApiBase()}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Google verification failed.');
  return data as AuthSessionResult;
}

/** Sends a 6-digit OTP to the provided guest email. */
export async function sendGuestOtp(email: string): Promise<{ detail: string }> {
  const res = await fetch(`${getApiBase()}/auth/guest/otp/send/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');
  return data;
}

/** Verifies the OTP and returns a session JWT on success. */
export async function verifyGuestOtp(email: string, otp: string): Promise<AuthSessionResult> {
  const res = await fetch(`${getApiBase()}/auth/guest/otp/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'OTP verification failed.');
  return data as AuthSessionResult;
}

/** Stores the session token in sessionStorage (cleared on tab close). */
export function storeRegSession(token: string): void {
  if (typeof window !== 'undefined') sessionStorage.setItem('jtc_reg_session', token);
}

/** Clears the registration session token. */
export function clearRegSession(): void {
  if (typeof window !== 'undefined') sessionStorage.removeItem('jtc_reg_session');
}

export async function initiateSSLCommerzPayment(code: string): Promise<{ gateway_url: string; status: string }> {
  const res = await fetch(`${getApiBase()}/payments/sslcommerz/initiate/${code}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || data.status !== 'SUCCESS') {
    throw new Error(data.error || 'Failed to initiate SSLCommerz payment gateway.');
  }
  return data;
}

// ─── Admin API Helpers ─────────────────────────────────────────────────────────

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jtc_admin_token');
}

export function setAdminToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jtc_admin_token', token);
    // Set cookie for Next.js Edge Middleware route guards (7-day max-age)
    document.cookie = `jtc_admin_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  }
}

export function clearAdminToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jtc_admin_token');
    // Clear cookie for Next.js Edge Middleware
    document.cookie = 'jtc_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
}

export async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${getApiBase()}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearAdminToken();
    if (typeof window !== 'undefined' && !window.location.pathname.includes(ADMIN_AUTH_PATH)) {
      window.location.href = ADMIN_AUTH_PATH;
    }
    throw new Error('Unauthorized');
  }

  return res;
}
