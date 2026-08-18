// FILE: components/sections/testimonials.tsx
// PURPOSE: Homepage testimonials section. Previously rendered a hardcoded
// list from constants/testimonials.ts, completely disconnected from the
// real Testimonial model and the dashboard's Testimonials management page
// — the same class of bug found and fixed in components/sections/faq.tsx.
// Now a server component querying real, approved+active testimonials.
import { Star, Quote } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import { prisma } from '@/lib/prisma';

const ACCENTS = [
  'from-primary to-accent',
  'from-accent to-chart-4',
  'from-chart-4 to-primary',
];

export async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { active: true, status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="relative scroll-mt-20 bg-surface-secondary py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Testimonials"
          title={
            <>
              Teams that shipped with{' '}
              <span className="text-gradient-primary">HYASCKA</span>
            </>
          }
          description="Don't take our word for it — here's what technology and business leaders say after working with us."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <div className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg">
                <Quote className="absolute right-5 top-5 h-10 w-10 text-primary/8" />
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-chart-4/80 text-chart-4/80" />
                  ))}
                </div>
                <blockquote className="flex-1 font-display text-base font-medium leading-relaxed tracking-tight text-pretty">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3.5 border-t border-border/60 pt-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} text-sm font-semibold text-white shadow-soft`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold tracking-tight">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.position}{t.company ? `, ${t.company}` : ''}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
