import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Online — SJIS Inter-School Tech Carnival 2026',
  description:
    'Secure your delegate pass for SJIS Inter-School Tech Carnival 2026. Instant bKash, Nagad, SSLCommerz, and Bank payments with instant QR digital entry pass confirmation.',
  keywords: [
    'SJIS Registration 2026',
    'Tech Fest Registration Dhaka',
    'JTC Pass Registration',
    'Coding Marathon Register',
    'Drone Competition Register',
    'Gaming Quiz Registration Dhaka',
  ],
  alternates: {
    canonical: 'https://jtc.sjis.edu.bd/register',
  },
  openGraph: {
    title: 'Register Online — SJIS Inter-School Tech Carnival 2026',
    description: 'Register for individual and team competitions with instant digital delegate pass.',
    url: 'https://jtc.sjis.edu.bd/register',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
