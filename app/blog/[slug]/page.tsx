// ==========================================================
// NEW FILE
// LOCATION: app/blog/[slug]/page.tsx
// ==========================================================
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { Reveal } from '@/components/reveal';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import cloudinaryImageLoader from '@/lib/cloudinary-image-loader';

export const dynamic = 'force-dynamic';

async function getPost(slug: string) {
  return prisma.blog.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      author: { select: { name: true } },
      category: true,
      tags: true,
    },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post not found — HYASCKA' };

  const description = post.excerpt ?? post.content?.slice(0, 160) ?? undefined;

  return {
    title: `${post.title} — HYASCKA Blog`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
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
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" /> {post.author?.name ?? 'HYASCKA Team'}
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
                  loader={cloudinaryImageLoader}
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
        </div>
      </article>

      <CTASection />
    </>
  );
}
