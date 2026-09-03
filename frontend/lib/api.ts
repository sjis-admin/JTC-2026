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
  events: {
    event_id: number;
    is_team?: boolean;
    team_name?: string;
    team_members?: string;
  }[];
  payment_method: 'SSLCOMMERZ' | 'BKASH' | 'NAGAD' | 'BANK' | 'CASH';
  payment_reference: string;
  turnstile_token?: string;
}

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
  payment_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'REFUNDED';
  payment_status_display: string;
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
    const res = await fetch(`${getApiBase()}/settings/`, { next: { revalidate: 60 } });
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
      announcement_banner: '⚡ Registrations for SJIS Inter-School Tech Carnival 2026 are now open! Explore 19 exciting events and register today.',
      logo_url: null,
    };
  }
}

export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/events/`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    console.error('API fetchEvents failed:', err);
    return [];
  }
}

export async function fetchEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const res = await fetch(`${getApiBase()}/events/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`API fetchEventBySlug(${slug}) failed:`, err);
    return null;
  }
}

export async function fetchSchools(): Promise<SchoolItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/schools/`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch schools');
    return await res.json();
  } catch (err) {
    console.error('API fetchSchools failed:', err);
    return [];
  }
}

export async function submitRegistration(payload: RegistrationPayload): Promise<RegistrationResponse> {
  const res = await fetch(`${getApiBase()}/registrations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
