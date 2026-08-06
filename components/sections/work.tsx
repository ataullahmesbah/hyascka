'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { StaggerGroup, staggerItem } from '@/components/reveal';
import { projects } from '@/constants/projects';
import type { Project } from '@/types';

export function Work() {
  return (
    <section id="work" className="relative scroll-mt-20 bg-surface-secondary py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Featured Projects"
          title={
            <>
              Real systems,{' '}
              <span className="text-gradient-primary">measurable outcomes</span>
            </>
          }
          description="A sample of the intelligent products we've shipped across industries — each engineered for scale and built to last."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <motion.div key={p.title} variants={staggerItem}>
              <ProjectCard {...p} />
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function ProjectCard({ icon: Icon, category, title, description, metric, metricLabel, accent }: Project) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg">
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-border/60 bg-surface-secondary p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className={`absolute -inset-8 bg-gradient-to-br ${accent} opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-glow-primary`}
        >
          <Icon className="h-8 w-8" />
        </motion.div>
        <span className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
          {category}
        </span>
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 backdrop-blur-md">
          <TrendingUp className="h-3.5 w-3.5 text-success" />
          <span className="font-display text-sm font-semibold">{metric}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
        <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {metricLabel}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View case study
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
