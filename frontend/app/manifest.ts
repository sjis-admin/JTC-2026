import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SJIS Inter-School Tech Carnival 2026',
    short_name: 'JTC 2026',
    description: 'Official portal for SJIS Inter-School Tech Carnival 2026 organized by Josephite Tech Club at St. Joseph International School.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#030712',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
