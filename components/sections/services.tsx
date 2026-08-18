// FILE: components/sections/services.tsx
// PURPOSE: Homepage "What we build" section. Previously rendered a
// hardcoded list from constants/services.ts — the same class of bug found
// in FAQ/Testimonials/Work — completely disconnected from the real,
// dashboard-managed Service model that already powers /services and the
// navbar mega-menu. Now a server component querying that same data.
// (constants/services.ts is still used by components/sections/hero.tsx's
// small decorative capability preview and was left as-is there.)
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import { cn } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

const ACCENTS = [
  'from-primary to-accent',
  'from-accent to-chart-3',
  'from-chart-3 to-chart-4',
  'from-chart-4 to-primary',
  'from-primary to-chart-5',
  'from-chart-5 to-accent',
  'from-accent to-chart-4',
  'from-chart-3 to-primary',
];

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Sparkles;
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? Sparkles;
}

export async function Services() {
  const services = await prisma.service.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    take: 8,
    select: { id: true, slug: true, title: true, shortDescription: true, icon: true, featured: true },
  });

  if (services.length === 0) return null;

  return (
    <section id="services" className="relative scroll-mt-20 bg-surface-secondary py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="What we build"
          title={
            <>
              Full-stack AI engineering, from{' '}
              <span className="text-gradient-primary">concept to scale</span>
            </>
          }
          description="We design and ship intelligent systems across the entire stack — whether you need a single AI agent or a complete digital transformation."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = resolveIcon(s.icon);
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal key={s.id} delay={Math.min(i * 0.05, 0.2)}>
                <Link
                  href={`/services/${s.slug}`}
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg',
                    s.featured && 'lg:ring-1 lg:ring-primary/30'
                  )}
                >
                  <div
                    className={cn(
                      'absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20',
                      accent
                    )}
                  />
                  <div
                    className={cn(
                      'relative flex h-12 w-12 items-center justify-center rounded-btn bg-gradient-to-br text-white shadow-soft',
                      accent
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{s.title}</h3>
                  {s.shortDescription && (
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {s.shortDescription}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  {s.featured && (
                    <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Core
                    </span>
                  )}
                  <div className={cn('absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r transition-transform duration-400 group-hover:scale-x-100', accent)} />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
