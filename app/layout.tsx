// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/layout.tsx
// ==========================================================
import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/components/providers';
import { Navbar, type NavServiceGroup } from '@/components/navbar';
import { Footer, type FooterSocialLink } from '@/components/sections/footer';
import { LoadingScreen } from '@/components/loading-screen';
import { BackToTop } from '@/components/back-to-top';
import { AuthNotice } from '@/components/auth/auth-notice';
import { AnalyticsScripts } from '@/components/analytics-scripts';
import { prisma } from '@/lib/prisma';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hyascka.com'),
  title: 'HYASCKA — AI-First Digital Solutions Company',
  description:
    'HYASCKA builds AI agents, intelligent automation, enterprise software, and high-performance digital experiences for startups and enterprises.',
  keywords: [
    'AI agents',
    'AI automation',
    'enterprise software',
    'custom web applications',
    'digital transformation',
    'AI development company',
  ],
  openGraph: {
    title: 'HYASCKA — AI-First Digital Solutions Company',
    description:
      'We build AI agents, intelligent automation, enterprise software, and modern digital experiences that drive business growth.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HYASCKA — AI-First Digital Solutions Company',
    description:
      'We build AI agents, intelligent automation, enterprise software, and modern digital experiences.',
  },
};

// Site-wide Organization + WebSite structured data — helps both
// traditional search (Google rich results) and AI answer engines
// (ChatGPT/Perplexity/Google AI Overviews) correctly identify who
// HYASCKA is and how to search the site, without needing a per-page
// override. Page-level schema (BlogPosting, etc.) layers on top of this.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HYASCKA',
  url: 'https://hyascka.com',
  logo: 'https://hyascka.com/logo/logo1.png',
  description:
    'HYASCKA builds AI agents, intelligent automation, enterprise software, and high-performance digital experiences for startups and enterprises.',
  sameAs: [],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HYASCKA',
  url: 'https://hyascka.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://hyascka.com/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

// Feeds the navbar's Services mega-menu (constants/navigation.ts §28) —
// fetched once here, server-side, so the client Navbar component never
// needs its own data-fetching effect. A DB hiccup falls back to an empty
// array; Navbar renders a plain "Browse all services" link in that case
// rather than breaking the whole site's header.
async function getNavServiceGroups(): Promise<NavServiceGroup[]> {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        services: {
          where: { status: 'PUBLISHED' },
          orderBy: { order: 'asc' },
          select: { id: true, title: true, slug: true },
        },
      },
    });
    return categories
      .filter((c) => c.services.length > 0)
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug, services: c.services }));
  } catch (error) {
    console.error('layout: failed to load nav service groups', error);
    return [];
  }
}

// Feeds the footer's social icons (PRD section 19) — same server-fetch-
// then-pass-as-prop pattern as getNavServiceGroups above.
async function getFooterSocialLinks(): Promise<FooterSocialLink[]> {
  try {
    const links = await prisma.socialLink.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { id: true, platform: true, url: true, icon: true, label: true },
    });
    return links;
  } catch (error) {
    console.error('layout: failed to load footer social links', error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serviceGroups, socialLinks] = await Promise.all([
    getNavServiceGroups(),
    getFooterSocialLinks(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(!s){document.documentElement.classList.toggle('dark',m)}else if(s==='dark'){document.documentElement.classList.add('dark')}else if(s==='light'){document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${sans.variable} ${display.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AnalyticsScripts />
            <LoadingScreen />
            <Navbar serviceGroups={serviceGroups} />
            <main className="min-h-screen">{children}</main>
            <Footer socialLinks={socialLinks} />
            <BackToTop />
            <Suspense fallback={null}>
              <AuthNotice />
            </Suspense>
            <Toaster
              position="top-center"
              theme="system"
              toastOptions={{
                style: {
                  background: '#0A1F44',
                  color: '#F5F7FA',
                  border: '1px solid #1E3A6E',
                  fontSize: '14px',
                },
                className: 'font-sans',
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}