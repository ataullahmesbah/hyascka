// FILE: app/portfolio/[slug]/page.tsx
// PURPOSE: Public project/case-study detail page — did not exist before
// (PRD section 7 explicitly asks for one). Follows the same
// generateMetadata + breadcrumb + GradientOrbs hero pattern as
// app/services/[slug]/page.tsx for visual/SEO consistency.
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { GradientOrbs } from '@/components/gradient-orbs';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/reveal';
import { CTASection } from '@/components/cta-section';

export const dynamic = 'force-dynamic';

async function getProject(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { technologies: true },
  });
  if (!project || !project.published) return null;
  return project;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Project Not Found — HYASCKA' };

  return {
    title: project.seoTitle || `${project.title} — HYASCKA Portfolio`,
    description: project.seoDescription || project.overview || undefined,
    alternates: { canonical: `/portfolio/${project.slug}` },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.overview ?? undefined,
    creator: { '@type': 'Organization', name: 'HYASCKA', url: 'https://hyascka.com' },
    url: `https://hyascka.com/portfolio/${project.slug}`,
    ...(project.image && { image: project.image }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-40 lg:pb-20">
        <GradientOrbs />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" aria-hidden />

        <div className="relative mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/portfolio" className="hover:text-foreground">Portfolio</Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{project.title}</span>
          </nav>

          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {project.category}
          </span>

          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.04]">
            {project.title}
          </h1>

          {project.overview && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {project.overview}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {project.projectUrl && (
              <Button asChild size="lg" className="group gap-2 rounded-btn px-6">
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                  Visit Project
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
            )}
            <Button asChild variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <Link href="/portfolio">
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {project.image && (
        <section className="relative pb-4">
          <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
            <Reveal>
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface-secondary">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1280px"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {(project.challenge || project.solution || project.outcome) && (
        <section className="relative py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-5 tab:px-8 lg:grid-cols-[1.4fr_1fr] lg:px-12">
            <div className="flex flex-col gap-10">
              {project.challenge && (
                <Reveal>
                  <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    The Challenge
                  </h2>
                  <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground text-pretty">
                    {project.challenge}
                  </div>
                </Reveal>
              )}
              {project.solution && (
                <Reveal delay={0.05}>
                  <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Our Solution
                  </h2>
                  <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground text-pretty">
                    {project.solution}
                  </div>
                </Reveal>
              )}
              {project.outcome && (
                <Reveal delay={0.1}>
                  <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    The Outcome
                  </h2>
                  <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground text-pretty">
                    {project.outcome}
                  </div>
                </Reveal>
              )}
            </div>

            <Reveal delay={0.15}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Project Details
                </h3>
                <dl className="mt-5 flex flex-col gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="mt-0.5 font-medium">{project.category}</dd>
                  </div>
                  {project.clientName && (
                    <div>
                      <dt className="text-muted-foreground">Client</dt>
                      <dd className="mt-0.5 font-medium">{project.clientName}</dd>
                    </div>
                  )}
                  {project.technologies.length > 0 && (
                    <div>
                      <dt className="text-muted-foreground">Technologies</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {project.technologies.map((t) => (
                          <span key={t.id} className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {t.name}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {project.techStack.length > 0 && project.technologies.length === 0 && (
                    <div>
                      <dt className="text-muted-foreground">Tech Stack</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {tech}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {project.projectUrl && (
                    <div>
                      <dt className="text-muted-foreground">Live URL</dt>
                      <dd className="mt-0.5">
                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                          Visit site <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="relative py-4 pb-20 sm:pb-24">
          <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
            <h2 className="mb-6 font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Gallery
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.gallery.map((src, i) => (
                <Reveal key={src} delay={i * 0.04}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface-secondary">
                    <Image
                      src={src}
                      alt={`${project.title} — screenshot ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title={<>Want a project like <span className="text-gradient-primary">{project.title}</span>?</>}
        description="Book a consultation and let's explore what we can build together."
        primaryLabel="Start a project"
        secondaryLabel="Back to Portfolio"
        secondaryHref="/portfolio"
      />
    </>
  );
}
