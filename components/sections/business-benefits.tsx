'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/section-header';
import { StaggerGroup, staggerItem } from '@/components/reveal';
import { benefits } from '@/constants/benefits';

export function BusinessBenefits() {
  return (
    <section id="benefits" className="relative scroll-mt-20 bg-surface-secondary py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Business Benefits"
          title={
            <>
              What AI actually{' '}
              <span className="text-gradient-primary">does for your business</span>
            </>
          }
          description="We don't build AI for the sake of it. Every system we ship is tied to a measurable business outcome."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <motion.div key={b.title} variants={staggerItem}>
              <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <b.icon className="h-5.5 w-5.5" />
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-semibold text-gradient-primary">{b.metric}</div>
                    <div className="text-xs text-muted-foreground">{b.metricLabel}</div>
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight">{b.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                  {b.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
