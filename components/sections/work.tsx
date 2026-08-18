// FILE: components/sections/work.tsx
// PURPOSE: Homepage "Featured Projects" section. Previously rendered a
// hardcoded list from constants/projects.ts — the same class of bug found
// in FAQ/Testimonials — completely disconnected from the real, published/
// featured Project data that already powers /portfolio and
// /portfolio/[slug]. Now a server component querying that same data.
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { Reveal } from '@/components/reveal';
import { prisma } from '@/lib/prisma';

const ACCENTS = [
  'from-primary to-accent',
  'from-accent to-chart-3',
  'from-chart-3 to-chart-4',
  'from-chart-4 to-primary',
  'from-primary to-chart-5',
  'from-chart-5 to-accent',
];

export async function Work() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    take: 6,
    select: { id: true, slug: true, title: true, category: true, overview: true, image: true, metrics: true },
  });

  if (projects.length === 0) return null;

  return (
    <section id="work" className="relative scroll-mt-20 bg-surface-secondary py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Featured Projects"
          title={
            <>
              Real systems,{' '}
              <span className="text-gradient-primary">measurable outcomes</span>
            </>
          }
          description="A sample of the intelligent products we've shipped across industries — each engineered for scale and built to last."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <Link
                href={`/portfolio/${p.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg"
              >
                <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-border/60 bg-surface-secondary p-6">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
                      <div className={`absolute -inset-8 bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />
                      <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} text-white shadow-glow-primary`}>
                        <TrendingUp className="h-8 w-8" />
                      </div>
                    </>
                  )}
                  <span className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
                    {p.category}
                  </span>
                  {p.metrics && (
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 backdrop-blur-md">
                      <TrendingUp className="h-3.5 w-3.5 text-success" />
                      <span className="font-display text-sm font-semibold">{p.metrics}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{p.title}</h3>
                  {p.overview && <p className="flex-1 text-sm leading-relaxed text-muted-foreground text-pretty line-clamp-3">{p.overview}</p>}
                  <div className="mt-1 flex items-center justify-end border-t border-border/60 pt-4">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      View case study
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
