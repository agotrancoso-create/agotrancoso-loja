import type { MetadataRoute } from 'next';
import { SITE_DOMAIN } from '@/lib/config';

const PRIVATE_ROUTES = ['/checkout', '/confirmacao', '/en/checkout', '/en/confirmacao', '/api/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_ROUTES,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: PRIVATE_ROUTES,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: PRIVATE_ROUTES,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: PRIVATE_ROUTES,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: PRIVATE_ROUTES,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: PRIVATE_ROUTES,
      },
    ],
    sitemap: [
      `${SITE_DOMAIN}/sitemap.xml`,
      `${SITE_DOMAIN}/image-sitemap.xml`,
    ],
    host: SITE_DOMAIN,
  };
}
