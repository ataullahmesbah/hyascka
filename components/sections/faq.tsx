'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import { faqs } from '@/constants/faq';

export function FAQ() {
  return (
    <section id="faq" className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32 bg-surface-secondary">
      <div className="mx-auto max-w-3xl px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Frequently Asked Questions"
          title={
            <>
              Answers before you{' '}
              <span className="text-gradient-primary">ask</span>
            </>
          }
          description="The questions we hear most often from founders and technology leaders evaluating a build partner."
        />

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="rounded-btn border border-border bg-card px-5 shadow-soft data-[state=open]:border-primary/40"
              >
                <AccordionTrigger className="py-5 text-left font-display text-base font-medium tracking-tight hover:no-underline sm:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
