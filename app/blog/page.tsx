// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/blog/page.tsx
// ==========================================================
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { Reveal } from '@/components/reveal';
import { ArrowRight, ArrowUpRight, Clock, User } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import cloudinaryImageLoader from '@/lib/cloudinary-image-loader';

export const metadata: Metadata = {
  title: 'Blog — HYASCKA',
  description:
    'AI insights, technology updates, and engineering perspectives from the HYASCKA team on building intelligent software, automation, and enterprise systems.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      author: { select: { id: true, name: true, email: true } },
      category: true,
      tags: true,
    },
    orderBy: { publishedAt: 'desc' },
  });

  const featuredPost = blogs.find((b) => b.featuredImage) ?? blogs[0];
  const otherPosts = blogs.filter((b) => b.id !== featuredPost?.id);
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <>
      <PageHero
        eyebrow="Blog & Insights"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }]}
        title={
          <>
            AI insights from the{' '}
            <span className="text-gradient-primary">HYASCKA team</span>
          </>
        }
        description="Practical perspectives on building AI systems, automation, and enterprise software — from the engineers who do it every day."
      />

      {/* Category pills */}
      <section className="relative pt-4 pb-8">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {blogs.length === 0 ? (
        <section className="relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12 text-center">
            <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">No posts published yet</h2>
            <p className="mt-3 text-muted-foreground">Check back soon for the latest insights from our team.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured article */}
          {featuredPost && (
            <section className="relative py-8 sm:py-12 lg:py-16">
              <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
                <Reveal>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-soft-lg transition-all duration-500 hover:border-primary/40 sm:p-10 lg:flex-row lg:items-center lg:gap-10"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {featuredPost.category && (
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            {featuredPost.category.name}
                          </span>
                        )}
                        {featuredPost.publishedAt && (
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(featuredPost.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">{featuredPost.readingTime} min read</span>
                      </div>
                      <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-snug tracking-tight text-balance sm:text-3xl">
                        {featuredPost.title}
                      </h2>
                      {featuredPost.excerpt && (
                        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-white">
                          {(featuredPost.author?.name ?? 'U').split(' ').map((n) => n[0]).join('')}
                        </span>
                        <span className="font-medium text-foreground/85">{featuredPost.author?.name ?? 'HYASCKA Team'}</span>
                      </div>
                      <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
                        Read article
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                    {featuredPost.featuredImage && (
                      <div className="relative flex h-40 w-full shrink-0 overflow-hidden rounded-2xl lg:h-48 lg:w-72">
                        <Image
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 288px"
                          loader={cloudinaryImageLoader}
                          className="object-cover"
                        />
                      </div>
                    )}
                  </Link>
                </Reveal>
              </div>
            </section>
          )}

          {/* All posts grid */}
          <section className="relative py-8 sm:py-12 lg:py-16">
            <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
              <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Latest Articles</h2>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {otherPosts.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.04}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg"
                    >
                      {p.featuredImage ? (
                        <div className="relative flex h-32 overflow-hidden rounded-xl">
                          <Image
                            src={p.featuredImage}
                            alt={p.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loader={cloudinaryImageLoader}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-primary/8 to-accent/8">
                          <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary">
                            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-accent" />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {p.category && (
                          <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-foreground/80">{p.category.name}</span>
                        )}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.readingTime} min</span>
                      </div>
                      <h3 className="flex-1 font-display text-lg font-semibold leading-snug tracking-tight">{p.title}</h3>
                      {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
                      <div className="flex items-center justify-between border-t border-border/60 pt-3">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          {p.author?.name ?? 'HYASCKA'}
                        </span>
                        {p.publishedAt && <span className="text-xs text-muted-foreground">{new Date(p.publishedAt).toLocaleDateString()}</span>}
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Read more
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <CTASection
        title={<>Never miss an <span className="text-gradient-primary">insight</span></>}
        description="Subscribe to our newsletter for the latest AI insights, engineering deep dives, and product updates."
        primaryLabel="Subscribe via contact"
        secondaryLabel="Explore resources"
        secondaryHref="/resources"
      />
    </>
  );
}
