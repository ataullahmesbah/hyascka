'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import { processSteps } from '@/constants/process';

export function Process() {
  return (
    <section id="process" className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32">
      <div className="absolute inset-0 bg-dots opacity-40 mask-fade-b" aria-hidden />
      <div className="relative mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Development Process"
          title={
            <>
              A proven path from{' '}
              <span className="text-gradient-primary">idea to impact</span>
            </>
          }
          description="Every engagement follows a disciplined seven-step process that de-risks delivery and puts working software in your hands fast."
        />

        <div className="relative mt-16 lg:mt-20">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-transparent sm:left-[31px]" />

          <div className="flex flex-col gap-10 sm:gap-12">
            {processSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.05} y={28}>
                <div className="relative flex gap-5 sm:gap-7">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-card shadow-soft sm:h-16 sm:w-16">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10" />
                    <s.icon className="relative h-6 w-6 text-primary sm:h-7 sm:w-7" />
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.05, type: 'spring', stiffness: 200 }}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white shadow-soft"
                    >
                      {i + 1}
                    </motion.span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 pt-1 sm:pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                        {s.title}
                      </h3>
                      <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {s.duration}
                      </span>
                    </div>
                    <p className="max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
