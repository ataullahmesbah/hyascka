import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { Reveal } from '@/components/reveal';
import { SectionHeader } from '@/components/section-header';
import { ArrowUpRight } from 'lucide-react';
import { resourceCategories, upcomingResources } from '@/constants/resources';

export const metadata: Metadata = {
  title: 'Resources — HYASCKA',
  description:
    'Free guides, whitepapers, templates, ebooks, checklists, and documentation from the HYASCKA team to help you build and scale AI-powered systems.',
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }]}
        title={
          <>
            Free resources to help you{' '}
            <span className="text-gradient-primary">build with AI</span>
          </>
        }
        description="Guides, whitepapers, templates, and tools from our engineering team — everything you need to understand, plan, and execute your AI strategy."
      />

      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resourceCategories.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <Link
                  href={r.href}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <r.icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-display text-base font-semibold tracking-tight">{r.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {r.desc}
                  </p>
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-xs font-medium text-muted-foreground">{r.count}</span>
                    <ArrowUpRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 lg:py-24 bg-surface-secondary">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Coming Soon"
            title={<>Resources <span className="text-gradient-primary">in development</span></>}
            description="We're building a library of video content and live webinars to make AI engineering more accessible."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {upcomingResources.map((u, i) => (
              <Reveal key={u.title} delay={i * 0.08}>
                <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-dashed border-border bg-card/60 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-muted text-muted-foreground">
                    <u.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold tracking-tight">{u.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {u.desc}
                    </p>
                  </div>
                  <span className="ml-auto rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Soon
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={<>Want these resources <span className="text-gradient-primary">in your inbox?</span></>}
        description="Subscribe to our newsletter and we'll send new guides, templates, and AI insights as we publish them."
        primaryLabel="Subscribe via contact"
        secondaryLabel="Read the blog"
        secondaryHref="/blog"
      />
    </>
  );
}
