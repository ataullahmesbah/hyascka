import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { blogSchema } from '@/lib/validation';
import { slugify } from '@/lib/dashboard-auth';
import { can, type Role } from '@/lib/permissions';
import type { RoleName } from '@prisma/client';

const ALLOWED_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'];
// Statuses that require publish rights (lib/permissions.ts: content.publish
// = SUPER_ADMIN/ADMIN only). MODERATOR/EDITOR can only ever save a post as
// DRAFT or PENDING_REVIEW — the PRD's "submit for review" workflow — never
// PUBLISHED/SCHEDULED directly, and REJECTED/ARCHIVED are review/unpublish
// decisions that belong to whoever can publish.
const PUBLISH_GATED_STATUSES = ['PUBLISHED', 'SCHEDULED', 'REJECTED', 'ARCHIVED'];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const session = await getServerSession(authOptions);

    const where = {
      ...(status && { status: status as 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'SCHEDULED' | 'REJECTED' | 'ARCHIVED' }),
      ...(session?.user?.role === 'EDITOR' && { authorId: session.user.id }),
    };

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(blogs);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = blogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (PUBLISH_GATED_STATUSES.includes(parsed.data.status) && !can(session.user.role as Role, 'content.publish')) {
      return NextResponse.json(
        { error: 'You can only save this post as Draft or Pending Review — publishing requires an editor/admin.' },
        { status: 403 }
      );
    }

    const slug = parsed.data.slug || slugify(parsed.data.title);

    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 409 }
      );
    }

    const tagIds = (body.tagIds as string[]) ?? [];
    const blog = await prisma.blog.create({
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        featuredImage: parsed.data.featuredImage,
        contentImages: parsed.data.contentImages,
        authorDesignation: parsed.data.authorDesignation,
        seoTitle: parsed.data.seoTitle,
        seoDescription: parsed.data.seoDescription,
        canonicalUrl: parsed.data.canonicalUrl || null,
        status: parsed.data.status,
        readingTime: parsed.data.readingTime,
        authorId: session.user.id,
        categoryId: parsed.data.categoryId,
        publishedAt: parsed.data.status === 'PUBLISHED' ? new Date() : null,
        ...(tagIds.length > 0 && {
          tags: { connect: tagIds.map((id: string) => ({ id })) },
        }),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
