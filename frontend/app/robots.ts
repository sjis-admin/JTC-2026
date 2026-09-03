import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://jtc.sjis.edu.bd';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/events',
          '/events/*',
          '/rulebook',
          '/register',
          '/verify',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/jtc-portal-auth-2026',
          '/api/*',
          '/_next/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/jtc-portal-auth-2026',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
