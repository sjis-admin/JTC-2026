import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Participant Pass — SJIS Tech Carnival 2026',
  description:
    'Verify official gate passes, registration authenticity, and delegate credentials for SJIS Inter-School Tech Carnival 2026.',
  keywords: [
    'Verify JTC Pass',
    'SJIS Gate Pass Verification',
    'Delegate QR Code Verification',
  ],
  alternates: {
    canonical: 'https://jtc.sjis.edu.bd/verify',
  },
  openGraph: {
    title: 'Verify Participant Pass — SJIS Tech Carnival 2026',
    description: 'Verify official gate passes and delegate credentials.',
    url: 'https://jtc.sjis.edu.bd/verify',
  },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
