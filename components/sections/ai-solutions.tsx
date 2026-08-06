'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import { solutionAreas } from '@/constants/solutions';

export function AISolutions() {
  return (
    <section id="solutions" className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              align="left"
              eyebrow="AI Solutions"
              title={
                <>
                  Build smarter businesses{' '}
                  <span className="text-gradient-primary">with AI</span>
                </>
              }
              description="We embed AI into the core of your operations — not as a feature, but as a capability that transforms how your business runs every day."
            />
            <Reveal delay={0.2} className="mt-7">
              <a
                href="/solutions"
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                Discover AI Solutions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-1 gap-3">
              {solutionAreas.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <a.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-base font-semibold tracking-tight">{a.title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {a.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
