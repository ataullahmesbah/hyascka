'use client';

import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { techMarqueeItems, techCategories } from '@/constants/technologies';

export function Technologies() {
  return (
    <section id="tech" className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Technology Stack"
          title={
            <>
              Built with a{' '}
              <span className="text-gradient-primary">modern, battle-tested</span> stack
            </>
          }
          description="We choose technologies for longevity, performance, and maintainability — so your product stays fast and your team stays productive."
        />

        <Reveal delay={0.1} className="mt-12">
          <TooltipProvider delayDuration={200}>
            <div className="group relative overflow-hidden mask-fade-x border-y border-border/60 py-6">
              <div className="flex w-max animate-marquee items-center gap-3 pr-3 group-hover:[animation-play-state:paused]">
                {[...techMarqueeItems, ...techMarqueeItems].map((item, i) => (
                  <Tooltip key={`${item.name}-${i}`}>
                    <TooltipTrigger asChild>
                      <span
                        role="button"
                        tabIndex={0}
                        className="flex cursor-default items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 font-display text-sm font-semibold tracking-tight text-foreground/80 shadow-soft transition-colors hover:border-primary/40 hover:text-foreground"
                      >
                        <span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" />
                        {item.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="font-medium">
                      {item.desc}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </TooltipProvider>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {techCategories.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06}>
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/40 sm:p-7">
                <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-primary/5 blur-3xl transition-opacity duration-500 group-hover:bg-primary/10" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {g.title}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground/85 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
