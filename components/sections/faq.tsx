// FILE: components/sections/faq.tsx
// PURPOSE: Homepage FAQ section. Previously rendered a hardcoded list from
// constants/faq.ts with zero connection to the FAQ dashboard (PRD section
// 13 requires "Public UI must load database data" — the dashboard's FAQ
// CRUD had no visible effect anywhere on the site). Now a server component
// querying real, active, global (serviceId: null) FAQ rows.
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import { prisma } from '@/lib/prisma';

export async function FAQ() {
  const faqs = await prisma.fAQ.findMany({
    where: { active: true, serviceId: null },
    orderBy: { order: 'asc' },
  });

  if (faqs.length === 0) return null;

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
            {faqs.map((f) => (
              <AccordionItem
                key={f.id}
                value={f.id}
                className="rounded-btn border border-border bg-card px-5 shadow-soft data-[state=open]:border-primary/40"
              >
                <AccordionTrigger className="py-5 text-left font-display text-base font-medium tracking-tight hover:no-underline sm:text-lg">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
