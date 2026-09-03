'use client';

import React from 'react';

interface QRCodeSVGProps {
  value: string;
  size?: number;
  className?: string;
}

// Lightweight QR code generator using public SVG API / clean data matrix
export default function QRCodeSVG({ value, size = 140, className = '' }: QRCodeSVGProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    value
  )}&color=061533&bgcolor=F5B700&margin=4`;

  return (
    <div className={`p-2 rounded-xl bg-gold inline-block shadow-lg shadow-gold/20 ${className}`}>
      <img
        src={qrUrl}
        alt={`QR Code for ${value}`}
        width={size}
        height={size}
        className="rounded-lg"
      />
    </div>
  );
}
