'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/section-header';
import { StaggerGroup, staggerItem } from '@/components/reveal';
import { industries } from '@/constants/industries';

export function Industries() {
  return (
    <section id="industries" className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Industries We Serve"
          title={
            <>
              Built for{' '}
              <span className="text-gradient-primary">every industry</span>{' '}
              that wants to move faster
            </>
          }
          description="From startups to enterprises, we adapt our AI expertise to the realities of your industry — not the other way around."
        />

        <StaggerGroup className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {industries.map((ind) => (
            <motion.div key={ind.name} variants={staggerItem}>
              <div className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow-primary">
                  <ind.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold tracking-tight">{ind.name}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground text-pretty sm:text-sm">
                    {ind.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
