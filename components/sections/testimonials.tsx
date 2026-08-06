'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { StaggerGroup, staggerItem } from '@/components/reveal';
import { testimonials } from '@/constants/testimonials';

export function Testimonials() {
  return (
    <section className="relative scroll-mt-20 bg-surface-secondary py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Testimonials"
          title={
            <>
              Teams that shipped with{' '}
              <span className="text-gradient-primary">HYASCKA</span>
            </>
          }
          description="Don't take our word for it — here's what technology and business leaders say after working with us."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={staggerItem}>
              <div className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg">
                <Quote className="absolute right-5 top-5 h-10 w-10 text-primary/8" />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-chart-4/80 text-chart-4/80" />
                  ))}
                </div>
                <blockquote className="flex-1 font-display text-base font-medium leading-relaxed tracking-tight text-pretty">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3.5 border-t border-border/60 pt-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${t.accent} text-sm font-semibold text-white shadow-soft`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold tracking-tight">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.position}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
