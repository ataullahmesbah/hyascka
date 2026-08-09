'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientOrbs } from '@/components/gradient-orbs';
import { services } from '@/constants/services';

// The four flagship offerings, pulled straight from the real services data
// so this panel never drifts out of sync with /services.
const capabilities = services.slice(0, 4);

const proof = [
  { value: '120+', label: 'AI systems shipped' },
  { value: '94%', label: 'Avg. task automation rate' },
  { value: '24/7', label: 'Systems running in production' },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <GradientOrbs className="opacity-70" />
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" aria-hidden />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-14 px-5 pb-24 tab:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-12 lg:pb-32">
        <div className="flex flex-col items-start gap-7 lg:pr-4 lg:pt-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Development &amp; Automation Agency
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[3.75rem] lg:leading-[1.04]"
          >
            We Build the AI Systems{' '}
            <span className="text-gradient-primary">Your Business Runs On</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            HYASCKA is a full-stack AI agency. We design, build, and ship AI agents,
            automation, and enterprise software — production systems that cut manual
            work, respond to customers instantly, and scale with your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" className="group h-12 gap-2 rounded-btn px-6 text-base">
              <Link href="/contact">
                Book a Strategy Call
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 gap-2 rounded-btn px-6 text-base bg-background/40 backdrop-blur-sm"
            >
              <Link href="/portfolio">
                See Our Work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-2 grid w-full grid-cols-3 gap-4 border-t border-border/60 pt-6 sm:max-w-md"
          >
            {proof.map((p) => (
              <div key={p.label}>
                <div className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {p.value}
                </div>
                <div className="mt-1 text-xs leading-snug text-muted-foreground">
                  {p.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <CapabilityPanel />
      </div>

      <ScrollIndicator />
    </section>
  );
}

/**
 * The hero's signature element: instead of an abstract animated demo, this
 * states plainly — in the visitor's first five seconds — exactly what
 * HYASCKA builds and what each thing does for the business hiring us.
 * Sourced directly from the real services list so it can't drift out of
 * sync with /services.
 */
function CapabilityPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto w-full max-w-md lg:sticky lg:top-28 lg:max-w-none"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-soft-lg">
        <div className="flex items-center justify-between px-3.5 pb-2 pt-2.5">
          <span className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What We Build
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            <span className="h-1 w-1 rounded-full bg-success animate-pulse" />
            In production today
          </span>
        </div>

        <div className="flex flex-col gap-1.5 p-1.5">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.09, duration: 0.5 }}
              className="group relative flex items-start gap-3.5 overflow-hidden rounded-xl border border-border/60 bg-background/40 p-3.5 transition-colors hover:border-border hover:bg-background/70"
            >
              <span
                className={`absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b ${cap.accent}`}
                aria-hidden
              />
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-gradient-to-br ${cap.accent} text-primary-foreground`}
              >
                <cap.icon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="font-display text-sm font-semibold">{cap.title}</div>
                <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {cap.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          href="/services"
          className="group flex items-center justify-between border-t border-border/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          Explore all services
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="relative mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12"
    >
      <div className="flex justify-center pb-6">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5 text-muted-foreground"
        >
          <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
          <div className="flex h-9 w-5.5 items-start justify-center rounded-full border border-border p-1">
            <motion.span
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}