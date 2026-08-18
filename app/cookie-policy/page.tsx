// FILE: app/cookie-policy/page.tsx
// PURPOSE: Cookie Policy — PRD section 30 required page, did not exist
// before. Follows the exact structure of the existing privacy-policy and
// terms pages for visual/voice consistency. Standard boilerplate only —
// no invented company facts (registration, address, jurisdiction).
import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Cookie Policy — HYASCKA',
  description: 'How HYASCKA uses cookies and similar technologies on this website.',
};

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Cookie Policy', href: '/cookie-policy' }]}
        title="Cookie Policy"
        description="Last updated: August 2026"
      />
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 tab:px-8 lg:px-12">
          <div className="flex flex-col gap-8">
            <Block title="1. What Cookies Are">
              Cookies are small text files stored on your device when you visit a website. They help
              the site remember your preferences and understand how it&apos;s being used.
            </Block>
            <Block title="2. Cookies We Use">
              <strong className="font-medium text-foreground">Essential cookies</strong> — required for
              core site functionality, such as remembering your logged-in session and theme preference
              (light/dark mode). The site cannot function properly without these.
              <br /><br />
              <strong className="font-medium text-foreground">Analytics cookies</strong> — set by
              third-party tools (such as Google Analytics, Google Tag Manager, Meta Pixel, or Microsoft
              Clarity) only when those integrations are enabled in our site configuration. These help
              us understand how visitors use the site so we can improve it. See our{' '}
              <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>{' '}
              for what data these tools may collect.
            </Block>
            <Block title="3. Which Integrations May Set Cookies">
              Depending on what is currently enabled, this site may load Google Analytics 4, Google
              Tag Manager, Meta (Facebook) Pixel, and/or Microsoft Clarity. Each of these is
              independently switched on or off in our site administration — none load unless
              explicitly enabled. We do not control the specific cookies these third-party services
              set; refer to each provider&apos;s own privacy/cookie documentation for details.
            </Block>
            <Block title="4. Managing Cookies">
              Most browsers let you block or delete cookies through their settings. Blocking essential
              cookies may affect site functionality, such as staying logged in. Blocking analytics
              cookies will not affect your ability to browse or use the site.
            </Block>
            <Block title="5. Changes to This Policy">
              We may update this Cookie Policy as our use of cookies and tracking tools changes.
              Material changes will be reflected in the &ldquo;Last updated&rdquo; date above.
            </Block>
            <Block title="6. Contact">
              Questions about this Cookie Policy can be sent to privacy@hyaska.com.
            </Block>
          </div>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <p className="text-base leading-relaxed text-muted-foreground text-pretty">{children}</p>
    </div>
  );
}
