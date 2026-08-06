'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import { aiAgents } from '@/constants/solutions';

export function AIAgents() {
  return (
    <section id="agents" className="relative scroll-mt-20 bg-surface-secondary py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="AI Agents Showcase"
          title={
            <>
              An ecosystem of agents{' '}
              <span className="text-gradient-primary">working around the clock</span>
            </>
          }
          description="Each agent is purpose-built for a business function — connected, monitored, and coordinated through a central orchestration layer."
        />

        <Reveal delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft-lg sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-grid opacity-20" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="relative flex shrink-0 flex-col items-center gap-3">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow-primary"
                >
                  <Circle className="h-8 w-8" />
                  <motion.span
                    animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-2xl border-2 border-primary"
                  />
                </motion.div>
                <div className="text-center">
                  <div className="font-display text-sm font-semibold">Orchestration</div>
                  <div className="text-xs text-muted-foreground">Central Hub</div>
                </div>
              </div>

              <div className="hidden h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent lg:block" />

              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {aiAgents.map((a, i) => (
                  <motion.div
                    key={a.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="group relative flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-4 transition-all duration-300 hover:border-primary/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <a.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-sm font-semibold">{a.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                        {a.status} · {a.tasks} tasks
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
