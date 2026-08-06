'use client';

import * as React from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { Reveal } from '@/components/reveal';
import { stats } from '@/constants/stats';
import type { Stat } from '@/types';

const logos = [
  'Nexora', 'Vertex', 'Quantia', 'Helix AI', 'Northwind',
  'Lumen', 'Cobalt', 'Aerodrift', 'Synthese', 'Monarch',
];

export function TrustMarquee() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by teams building the next generation of intelligent products
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-9">
          <div className="relative overflow-hidden mask-fade-x">
            <div className="flex w-max animate-marquee items-center gap-12 pr-12">
              {[...logos, ...logos].map((logo, i) => (
                <span
                  key={`${logo}-${i}`}
                  className="font-display text-xl font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground sm:text-2xl"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-12">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label, icon: Icon }: Stat) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const count = useMotionValue(0);
  const [display, setDisplay] = React.useState('0');

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration: 1.6,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    });
    return () => controls.stop();
  }, [inView, value, count]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {display}
        <span className="text-gradient-primary">{suffix}</span>
      </div>
      <div className="text-xs leading-snug text-muted-foreground sm:text-sm">{label}</div>
    </div>
  );
}
