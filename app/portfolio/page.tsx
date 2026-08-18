// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/portfolio/page.tsx
// ==========================================================
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { Reveal } from '@/components/reveal';
import { SectionHeader } from '@/components/section-header';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import cloudinaryImageLoader from '@/lib/cloudinary-image-loader';

export const metadata: Metadata = {
  title: 'Portfolio — HYASCKA',
  description:
    'Case studies and project showcases from HYASCKA — AI agents, automation systems, enterprise platforms, and intelligent products with real outcomes.',
};

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    include: { technologies: true },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { active: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Portfolio', href: '/portfolio' }]}
        title={
          <>
            Real systems,{' '}
            <span className="text-gradient-primary">measurable outcomes</span>
          </>
        }
        description="A selection of the intelligent products we've shipped across industries — each engineered for scale and built to last."
      />

      {/* Projects Grid */}
      <section className="relative py-24 sm:py-28 lg:py-32 bg-surface-secondary">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Featured Projects"
            title={<>Built with <span className="text-gradient-primary">precision</span></>}
            description="Each project combines strategy, engineering, and design to deliver real business outcomes."
          />

          {projects.length === 0 ? (
            <p className="mt-14 text-center text-muted-foreground">No projects published yet. Check back soon.</p>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.04}>
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg"
                  >
                    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-border/60 bg-surface-secondary p-6">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loader={cloudinaryImageLoader}
                          className="object-cover"
                        />
                      ) : (
                        <>
                          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
                          <div className="absolute -inset-8 bg-gradient-to-br from-primary/15 to-accent/10 opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />
                          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow-primary">
                            <TrendingUp className="h-8 w-8" />
                          </div>
                        </>
                      )}
                      <span className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
                        {p.category}
                      </span>
                      {p.featured && (
                        <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{p.title}</h3>
                      {p.overview && <p className="flex-1 text-sm leading-relaxed text-muted-foreground text-pretty line-clamp-3">{p.overview}</p>}
                      {p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
                          {p.technologies.slice(0, 4).map((t) => (
                            <span key={t.id} className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              {t.name}
                            </span>
                          ))}
                          {p.technologies.length > 4 && (
                            <span className="text-xs text-muted-foreground">+{p.technologies.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials (from DB) */}
      {testimonials.length > 0 && (
        <section className="relative py-24 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
            <SectionHeader
              eyebrow="Testimonials"
              title={<>Teams that shipped with <span className="text-gradient-primary">HYASCKA</span></>}
            />
            <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.06}>
                  <div className="group flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <svg key={i} className="h-4 w-4 fill-amber-500 text-amber-500" viewBox="0 0 20 20">
                          <path d="M10 1l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.5l-5.2 2.6 1-5.8L1.5 7.2l5.9-.9L10 1z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="flex-1 font-display text-base font-medium leading-relaxed tracking-tight text-pretty">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3.5 border-t border-border/60 pt-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white shadow-soft">
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
      )}

      <CTASection
        title={<>Your project could be <span className="text-gradient-primary">next</span></>}
        description="Book a consultation and let's explore what we can build together."
        primaryLabel="Start a project"
        secondaryLabel="View services"
        secondaryHref="/services"
      />
    </>
  );
}
