'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import {
  User,
  Bot,
  Workflow,
  Database,
  FileBarChart,
  LineChart,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientOrbs } from '@/components/gradient-orbs';

const flow = [
  { icon: User, label: 'Customer', sub: 'Inquiry received' },
  { icon: Bot, label: 'AI Agent', sub: 'Understands intent' },
  { icon: Workflow, label: 'Automation', sub: 'Routes workflow' },
  { icon: Database, label: 'CRM', sub: 'Updates record' },
  { icon: FileBarChart, label: 'Reports', sub: 'Generates summary' },
  { icon: LineChart, label: 'Analytics', sub: 'Tracks metrics' },
  { icon: CheckCircle2, label: 'Success', sub: 'Task completed' },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <GradientOrbs />
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" aria-hidden />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 pb-24 tab:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-12 lg:pb-32">
        <div className="flex flex-col items-start gap-6 lg:pr-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Digital Solutions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[4rem] lg:leading-[1.03]"
          >
            Building Intelligent AI Systems
            <br />
            for{' '}
            <span className="text-gradient-primary">Modern Businesses</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            HYASCKA helps startups, enterprises, and growing businesses build AI agents,
            intelligent automation, enterprise software, and high-performance digital
            experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" className="group h-12 gap-2 rounded-btn px-6 text-base">
              <Link href="/contact">
                Book Consultation
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 gap-2 rounded-btn px-6 text-base bg-background/40 backdrop-blur-sm"
            >
              <Link href="/services">
                <Play className="h-4 w-4" />
                Explore Services
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              120+ systems shipped
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Global remote team
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Production-grade AI
            </span>
          </motion.div>
        </div>

        <HeroDashboard />
      </div>

      <ScrollIndicator />
    </section>
  );
}

function HeroDashboard() {
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((s) => (s + 1) % flow.length);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      {/* floating glow chips */}
      <FloatingChip
        className="left-[-6%] top-[8%]"
        delay={0.7}
        value="72%"
        label="auto-resolution"
      />
      <FloatingChip
        className="right-[-4%] top-[55%]"
        delay={1}
        value="<2s"
        label="response time"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft-lg sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" />

        {/* window header */}
        <div className="relative mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-4/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
          <span className="ml-2 font-display text-xs font-semibold text-muted-foreground">
            AI Workflow Pipeline
          </span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            <span className="h-1 w-1 rounded-full bg-success animate-pulse" />
            Live
          </span>
        </div>

        {/* flow steps */}
        <div className="relative flex flex-col gap-2.5">
          {flow.map((step, i) => {
            const isActive = i === activeStep;
            const isDone = i < activeStep;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className={`relative flex items-center gap-3 rounded-xl border p-3 transition-all duration-300 ${
                  isActive
                    ? 'border-primary/50 bg-primary/8 shadow-glow-primary'
                    : isDone
                      ? 'border-success/30 bg-success/5'
                      : 'border-border/60 bg-background/40'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-btn transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isDone
                        ? 'bg-success/15 text-success'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <step.icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-sm font-semibold">{step.label}</div>
                  <div className="text-xs text-muted-foreground">{step.sub}</div>
                </div>
                {isDone && <CheckCircle2 className="h-4 w-4 text-success" />}
                {isActive && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-primary"
                  />
                )}
                {i < flow.length - 1 && (
                  <span className="absolute left-[26px] -bottom-[10px] h-2.5 w-px bg-border" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* bottom metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-3"
        >
          <MiniStat value="847" label="Processed" />
          <MiniStat value="94%" label="Accuracy" />
          <MiniStat value="24/7" label="Active" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-sm font-semibold text-gradient-primary">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function FloatingChip({
  className,
  value,
  label,
  delay = 0,
}: {
  className?: string;
  value: string;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute z-10 ${className}`}
    >
      <div className="animate-float-slow rounded-btn border border-border bg-background/80 px-3.5 py-2 backdrop-blur-md">
        <div className="font-display text-lg font-semibold leading-none">{value}</div>
        <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
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
