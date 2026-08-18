// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/blog/[slug]/page.tsx
// ==========================================================
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { Reveal } from '@/components/reveal';
import { CommentSection } from '@/components/blog/comment-section';
import { ArrowLeft, ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getPost(slug: string) {
  return prisma.blog.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      author: { select: { name: true, image: true } },
      category: true,
      tags: true,
    },
  });
}

async function getRelatedPosts(categoryId: string | null, excludeId: string) {
  if (!categoryId) return [];
  return prisma.blog.findMany({
    where: { status: 'PUBLISHED', categoryId, id: { not: excludeId } },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: { id: true, slug: true, title: true, excerpt: true, featuredImage: true },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post not found — HYASCKA', robots: { index: false, follow: false } };

  const description = post.seoDescription ?? post.excerpt ?? post.content?.slice(0, 160) ?? undefined;

  return {
    title: post.seoTitle || `${post.title} — HYASCKA Blog`,
    description,
    alternates: { canonical: post.canonicalUrl || `/blog/${post.slug}` },
    // Every post reachable here is already status=PUBLISHED (getPost 404s
    // otherwise) — this is defense-in-depth should a future preview route
    // ever render an unpublished post through this same metadata function.
    robots: { index: post.status === 'PUBLISHED', follow: true },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    image: post.featuredImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Person', name: post.author?.name ?? 'HYASCKA Team' },
    publisher: {
      '@type': 'Organization',
      name: 'HYASCKA',
      logo: { '@type': 'ImageObject', url: 'https://hyascka.com/logo/logo1.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://hyascka.com/blog/${post.slug}` },
  };

  const paragraphs = (post.content ?? '').split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow={post.category?.name ?? 'Blog'}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title, href: `/blog/${post.slug}` }]}
        title={post.title}
        description={post.excerpt ?? undefined}
      >
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="relative h-6 w-6 overflow-hidden rounded-full bg-secondary">
              {post.author?.image && (
                <Image src={post.author.image} alt={post.author?.name ?? ''} fill className="object-cover" />
              )}
            </span>
            {post.author?.name ?? 'HYASCKA Team'}
            {post.authorDesignation && <span className="text-muted-foreground/70">· {post.authorDesignation}</span>}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {post.readingTime} min read
          </span>
        </div>
      </PageHero>

      <article className="relative pb-24">
        <div className="mx-auto max-w-[820px] px-5 tab:px-8">
          {post.featuredImage && (
            <Reveal>
              <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 820px) 100vw, 820px"
                  priority
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}

          <Reveal>
            <div>
              {paragraphs.length > 0 ? (
                paragraphs.map((para, i) => (
                  <p key={i} className="mb-5 whitespace-pre-line leading-relaxed text-foreground/90">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground">This post doesn&apos;t have any content yet.</p>
              )}
            </div>
          </Reveal>

          {post.contentImages.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {post.contentImages.map((src, i) => (
                <Reveal key={src} delay={i * 0.05}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                    <Image
                      src={src}
                      alt={`${post.title} — image ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
              {post.tags.map((tag) => (
                <span key={tag.id} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <Link
            href="/blog"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all articles
          </Link>

          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t border-border pt-10">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Related Articles
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {relatedPosts.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.05}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
                    >
                      <h3 className="text-sm font-semibold leading-snug">{p.title}</h3>
                      {p.excerpt && <p className="line-clamp-2 text-xs text-muted-foreground">{p.excerpt}</p>}
                      <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Read more <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          <CommentSection slug={post.slug} />
        </div>
      </article>

      <CTASection />
    </>
  );
}
