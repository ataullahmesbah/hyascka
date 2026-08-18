// ==========================================================
// NEW FILE
// LOCATION: app/sitemap.ts
// ==========================================================
import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Matches every other Prisma-backed route in this app (see blog/portfolio/
// services pages) — deferred to request time so the build doesn't need
// DATABASE_URL, and the sitemap always reflects the current published set.
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://hyascka.com';

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/services', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/solutions', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/resources', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/portfolio', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.8 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Never let a DB hiccup take the sitemap (or the build) down entirely —
  // fall back to the static routes above if the query fails.
  let serviceEntries: MetadataRoute.Sitemap = [];
  try {
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });
    serviceEntries = services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('sitemap: failed to load services, falling back to static routes only', error);
  }

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });
    blogEntries = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('sitemap: failed to load blog posts, falling back to static routes only', error);
  }

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
