'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/reveal';
import { cn } from '@/lib/utils';

export function CTASection({
  title,
  description,
  primaryLabel = 'Book a consultation',
  primaryHref = '/contact',
  secondaryLabel = 'Explore services',
  secondaryHref = '/services',
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}) {
  return (
    <section className={cn('relative py-24 sm:py-28 lg:py-32', className)}>
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/8 via-card to-accent/8 p-8 text-center shadow-soft-lg sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
            {/* floating shapes */}
            <motion.div
              animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute left-[10%] top-[15%] h-16 w-16 rounded-2xl border border-primary/20 bg-primary/5"
            />
            <motion.div
              animate={{ y: [0, 18, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="pointer-events-none absolute right-[12%] bottom-[18%] h-12 w-12 rounded-full border border-accent/20 bg-accent/5"
            />

            <div className="relative flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Let&apos;s build together
              </span>

              <h2 className="max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {title ?? (
                  <>
                    Ready to Build{' '}
                    <span className="text-gradient-primary">Your Next AI Solution?</span>
                  </>
                )}
              </h2>

              <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                {description ??
                  "Let's discuss your project and build something extraordinary together."}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="group h-12 gap-2 rounded-btn px-6 text-base">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 gap-2 rounded-btn px-6 text-base bg-background/40 backdrop-blur-sm"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Free 30-min consultation
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Response within 1 business day
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
