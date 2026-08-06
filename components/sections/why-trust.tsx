'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/section-header';
import { StaggerGroup, staggerItem } from '@/components/reveal';
import { pillars } from '@/constants/benefits';

export function WhyTrust() {
  return (
    <section id="why" className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Why HYASCKA"
          title={
            <>
              Why businesses choose{' '}
              <span className="text-gradient-primary">HYASCKA</span>
            </>
          }
          description="Seven commitments that define how we work — and why teams trust us with their most important builds."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div key={p.title} variants={staggerItem} className={i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}>
              <div className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <p.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-display text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
