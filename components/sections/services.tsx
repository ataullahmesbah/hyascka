'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { StaggerGroup, staggerItem } from '@/components/reveal';
import { cn } from '@/lib/utils';
import { services } from '@/constants/services';
import type { Service } from '@/types';

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-20 bg-surface-secondary py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="What we build"
          title={
            <>
              Full-stack AI engineering, from{' '}
              <span className="text-gradient-primary">concept to scale</span>
            </>
          }
          description="We design and ship intelligent systems across the entire stack — whether you need a single AI agent or a complete digital transformation."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <motion.div key={s.title} variants={staggerItem}>
              <ServiceCard {...s} />
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, description, accent, featured }: Service) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg',
        featured && 'lg:ring-1 lg:ring-primary/30'
      )}
    >
      <div
        className={cn(
          'absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20',
          accent
        )}
      />
      <div
        className={cn(
          'relative flex h-12 w-12 items-center justify-center rounded-btn bg-gradient-to-br text-white shadow-soft',
          accent
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
        {description}
      </p>
      <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
        Learn more
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      {featured && (
        <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Core
        </span>
      )}
      <motion.div
        animate={{ scaleX: hover ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className={cn('absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r', accent)}
      />
    </div>
  );
}
