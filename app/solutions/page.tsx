import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { AISolutions } from '@/components/sections/ai-solutions';
import { AIAgents } from '@/components/sections/ai-agents';
import { AutomationWorkflow } from '@/components/sections/automation-workflow';
import { BusinessBenefits } from '@/components/sections/business-benefits';
import { Reveal } from '@/components/reveal';
import { SectionHeader } from '@/components/section-header';
import { solutions } from '@/constants/solutions';

export const metadata: Metadata = {
  title: 'Solutions — HYASCKA',
  description:
    'AI Agents, Business Automation, CRM, ERP, Enterprise Applications, Internal Dashboards, Reporting, Analytics, Customer Support, and Business Intelligence solutions by HYASCKA.',
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Solutions', href: '/solutions' }]}
        title={
          <>
            Intelligent solutions for{' '}
            <span className="text-gradient-primary">every business problem</span>
          </>
        }
        description="We design and deploy AI systems that solve specific, measurable problems — not technology looking for a use case."
      />

      <AISolutions />
      <AIAgents />
      <AutomationWorkflow />
      <BusinessBenefits />

      {/* Detailed Solutions */}
      <section className="relative py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Solution Catalog"
            title={<>Every solution, <span className="text-gradient-primary">mapped to your problem</span></>}
            description="Each solution below is defined by the problem it solves, how it works, the benefits it delivers, and the technology behind it."
          />

          <div className="mt-14 flex flex-col gap-5">
            {solutions.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.03} y={28}>
                <div className="group relative grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-lg lg:grid-cols-[auto_1fr_1fr] lg:gap-8 lg:p-8">
                  {/* icon + title */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">{s.title}</h3>
                  </div>

                  {/* problem + solution */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-destructive/80">Problem</span>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">{s.problem}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Solution</span>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/85 text-pretty">{s.solution}</p>
                    </div>
                  </div>

                  {/* benefits + tech */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Benefits</span>
                      <ul className="mt-2 flex flex-col gap-1.5">
                        {s.benefits.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-sm text-foreground/85">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Technology</span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.tech.map((t) => (
                          <span key={t} className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={<>Find the right <span className="text-gradient-primary">solution</span> for your team</>}
        description="Book a free consultation and we'll help you identify which solutions fit your biggest opportunities."
        primaryLabel="Book a consultation"
        secondaryLabel="See our work"
        secondaryHref="/portfolio"
      />
    </>
  );
}
