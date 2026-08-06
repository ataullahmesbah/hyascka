import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { Reveal } from '@/components/reveal';
import { SectionHeader } from '@/components/section-header';
import { Technologies } from '@/components/sections/technologies';
import { FAQ } from '@/components/sections/faq';
import { Target, Eye, Heart } from 'lucide-react';
import { approach, coreValues, timeline, team } from '@/constants/about';

export const metadata: Metadata = {
  title: 'About — HYASCKA',
  description:
    'HYASCKA is an AI-first digital solutions company. Learn about our mission, vision, values, approach, and the team building intelligent software for ambitious businesses.',
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About HYASCKA"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }]}
        title={
          <>
            We build the intelligent software that{' '}
            <span className="text-gradient-primary">moves businesses forward</span>
          </>
        }
        description="HYASCKA is an AI-first digital solutions company. We help startups, businesses, and enterprises build AI agents, intelligent automation, enterprise applications, and high-performance digital experiences."
      />

      {/* Company Overview */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-surface-secondary">
        <div className="mx-auto max-w-4xl px-5 tab:px-8 lg:px-12">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Company Overview
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
              HYASCKA was founded on a simple belief: every business — regardless of size —
              deserves access to enterprise-grade AI systems that solve real problems. We combine
              the discipline of a senior software consultancy with deep, practical experience
              deploying AI in production. Our team has shipped over 120 intelligent systems across
              25+ countries, helping organizations automate work, improve efficiency, and accelerate
              growth.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission, Vision, Core Values */}
      <section className="relative py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight">Mission</h3>
                <p className="text-base leading-relaxed text-muted-foreground text-pretty">
                  Help organizations automate repetitive work, improve operational efficiency, and
                  accelerate long-term growth through AI.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight">Vision</h3>
                <p className="text-base leading-relaxed text-muted-foreground text-pretty">
                  A world where every business has access to enterprise-grade AI systems that solve
                  real problems and create lasting value.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight">Core Values</h3>
                <p className="text-base leading-relaxed text-muted-foreground text-pretty">
                  Honesty over hype. Production quality over demos. Partnership over transactions.
                  Outcomes over output.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="relative py-24 sm:py-28 lg:py-32 bg-surface-secondary">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Our Approach"
            title={<>How we <span className="text-gradient-primary">work</span></>}
            description="Four principles that guide every engagement — from first call to long-term partnership."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.06}>
                <div className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <a.icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-display text-base font-semibold tracking-tight">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values expanded */}
      <section className="relative py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <SectionHeader
            eyebrow="What We Stand For"
            title={<>Principles that guide <span className="text-gradient-primary">every decision</span></>}
            description="Our values aren't wall art — they show up in every line of code we ship and every conversation we have."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <v.icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-display text-base font-semibold tracking-tight">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Philosophy */}
      <section className="relative py-24 sm:py-28 lg:py-32 bg-surface-secondary">
        <div className="mx-auto max-w-4xl px-5 tab:px-8 lg:px-12">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Technology Philosophy
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              <p>
                We choose technologies for longevity, not novelty. Our stack is built on proven,
                battle-tested tools that will still be maintainable in five years — augmented with
                the best of modern AI engineering.
              </p>
              <p>
                We avoid lock-in. Every system we build is documented, transferable, and designed so
                your team can own and extend it. We favor open standards, clean APIs, and
                architecture that scales without rewrites.
              </p>
              <p>
                And we never ship AI without guardrails. Every agent we deploy includes evaluation
                suites, observability, and human-in-the-loop controls — because production AI
                demands production discipline.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Our Journey"
            title={<>From idea to <span className="text-gradient-primary">global impact</span></>}
            description="The milestones that shaped HYASCKA into the company it is today."
          />
          <div className="relative mt-16">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-transparent sm:left-[31px]" />
            <div className="flex flex-col gap-10 sm:gap-12">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={i * 0.06} y={28}>
                  <div className="relative flex gap-5 sm:gap-7">
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-card shadow-soft">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10" />
                      <span className="relative font-display text-xs font-bold text-primary">{t.year}</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 pt-1 sm:pt-2">
                      <h3 className="font-display text-lg font-semibold tracking-tight">{t.title}</h3>
                      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Placeholder */}
      <section className="relative py-24 sm:py-28 lg:py-32 bg-surface-secondary">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <SectionHeader
            eyebrow="The Team"
            title={<>Senior people who <span className="text-gradient-primary">ship</span></>}
            description="Every engagement is staffed with experienced engineers and AI practitioners — no junior hand-offs, no offshore layers."
          />
          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06}>
                <div className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${m.accent} text-xl font-semibold text-white shadow-soft`}>
                    {m.initials}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold tracking-tight">{m.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Technologies />
      <FAQ />
      <CTASection
        title={<>Work <span className="text-gradient-primary">with us</span></>}
        description="Tell us about your business and the problem you want to solve. We'll get back within one business day."
        primaryLabel="Book a consultation"
        secondaryLabel="View our work"
        secondaryHref="/portfolio"
      />
    </>
  );
}
