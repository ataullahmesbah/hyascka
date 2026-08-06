import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { Services } from '@/components/sections/services';
import { Process } from '@/components/sections/process';
import { Technologies } from '@/components/sections/technologies';
import { FAQ } from '@/components/sections/faq';
import { Reveal } from '@/components/reveal';
import { SectionHeader } from '@/components/section-header';
import { CheckCircle2 } from 'lucide-react';
import { allServicesList } from '@/constants/services';

export const metadata: Metadata = {
  title: 'Services — HYASCKA',
  description:
    'AI Agents, AI Automation, Custom Software, Website Development, Ecommerce, SEO, Branding, Digital Marketing, Enterprise Solutions, and API Integration by HYASCKA.',
};

const benefits = [
  'Senior-only engineering team — no hand-offs',
  'Production-grade AI with guardrails and observability',
  'Weekly demos with working software',
  'Clean, documented code your team can own',
  'Scalable architecture designed for growth',
  'Post-launch support and optimization',
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }]}
        title={
          <>
            Full-stack AI engineering, from{' '}
            <span className="text-gradient-primary">concept to scale</span>
          </>
        }
        description="We design and ship intelligent systems across the entire stack — whether you need a single AI agent or a complete digital transformation."
      />

      {/* Services Grid (reuses homepage component) */}
      <Services />

      {/* All Services Detailed List */}
      <section className="relative py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Service Details"
            title={<>Every service, <span className="text-gradient-primary">explained</span></>}
            description="A complete breakdown of what we offer — from AI agents to digital marketing and everything in between."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {allServicesList.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.04}>
                <div className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-lg">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-24 sm:py-28 lg:py-32 bg-surface-secondary">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Benefits"
            title={<>Why teams choose to <span className="text-gradient-primary">build with us</span></>}
            description="Every engagement comes with commitments that de-risk your project and ensure a successful outcome."
          />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b} delay={i * 0.05}>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                  <span className="text-sm font-medium text-foreground/85">{b}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <Process />

      {/* Technology Stack */}
      <Technologies />

      {/* FAQ */}
      <FAQ />

      <CTASection
        title={<>Let&apos;s scope your <span className="text-gradient-primary">next build</span></>}
        description="Tell us what you're trying to achieve. We'll help you map the right services to your goals."
        primaryLabel="Start your project"
        secondaryLabel="View our work"
        secondaryHref="/portfolio"
      />
    </>
  );
}
