import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: 'linear-gradient(135deg, #030712 0%, #0d1b2a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          border: '1.5px solid #F59E0B',
          color: '#F59E0B',
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-0.5px',
        }}
      >
        J
      </div>
    ),
    {
      ...size,
    }
  );
}
