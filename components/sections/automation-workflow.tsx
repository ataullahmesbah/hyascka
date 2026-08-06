'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import { workflowSteps } from '@/constants/benefits';

export function AutomationWorkflow() {
  return (
    <section id="automation" className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="AI Automation Workflow"
          title={
            <>
              Visualize your business{' '}
              <span className="text-gradient-primary">running on autopilot</span>
            </>
          }
          description="From the moment a customer reaches out to the moment the task is complete — AI orchestrates every step in between."
        />

        <Reveal delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-grid opacity-20" />

            <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {workflowSteps.map((step, i) => (
                <React.Fragment key={step.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-2.5 text-center"
                  >
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary sm:h-14 sm:w-14">
                      <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                    </div>
                    <div className="font-display text-xs font-semibold sm:text-sm">{step.title}</div>
                    <div className="hidden text-xs leading-relaxed text-muted-foreground sm:block">
                      {step.desc}
                    </div>
                  </motion.div>

                  {i < workflowSteps.length - 1 && (
                    <div className="hidden items-center lg:flex">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                        className="h-0.5 w-full origin-left bg-gradient-to-r from-primary/40 to-accent/40"
                      />
                      <motion.span
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="relative mt-8 flex flex-wrap items-center gap-6 border-t border-border/60 pt-6"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-gradient-primary">87%</span>
                <span className="text-sm text-muted-foreground">of tasks fully automated</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-gradient-primary">12h</span>
                <span className="text-sm text-muted-foreground">saved per week, per team</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-gradient-primary">&lt;2s</span>
                <span className="text-sm text-muted-foreground">average processing time</span>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
