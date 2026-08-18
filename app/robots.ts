// ==========================================================
// NEW FILE
// LOCATION: app/robots.ts
// ==========================================================
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://hyascka.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard',
        '/dashboard/',
        '/profile',
        '/settings',
        '/admin',
        '/checkout',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/accept-invite',
        '/unauthorized',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
