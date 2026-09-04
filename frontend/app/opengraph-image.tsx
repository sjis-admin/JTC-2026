import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SJIS Inter-School Tech Carnival 2026 — Josephite Tech Club';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #020617 0%, #030d22 50%, #071536 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
          position: 'relative',
          border: '12px solid #0F2042',
        }}
      >
        {/* Background glow circle */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Brand Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 24px',
            borderRadius: 50,
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1.5px solid rgba(245, 158, 11, 0.5)',
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 800, color: '#F59E0B', letterSpacing: '2px' }}>
            JOSEPHITE TECH CLUB • ST. JOSEPH INTERNATIONAL SCHOOL
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 54,
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.15,
            margin: '0 0 16px 0',
            color: '#FFFFFF',
            letterSpacing: '-1px',
          }}
        >
          SJIS Inter-School Tech Carnival 2026
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 22,
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
            margin: '0 0 40px 0',
          }}
        >
          Compete across 18 arenas in Coding Marathon, AI Prompting, Robotics, Drone Challenge, and E-Sports.
        </p>

        {/* Badges Bar */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: 16,
              color: '#38BDF8',
              fontWeight: 700,
            }}
          >
            ⚡ 17 Competitions
          </div>
          <div
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: 16,
              color: '#F59E0B',
              fontWeight: 700,
            }}
          >
            🏆 Gold Crests & Prize Money
          </div>
          <div
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: 16,
              color: '#34D399',
              fontWeight: 700,
            }}
          >
            🎫 Instant QR Pass
          </div>
        </div>

        {/* Footer domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 15,
            color: '#64748B',
            fontWeight: 600,
            letterSpacing: '1px',
          }}
        >
          OFFICIAL REGISTRATION PORTAL • jtc.sjis.edu.bd
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
