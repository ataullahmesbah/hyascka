import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { blogSchema } from '@/lib/validation';
import { slugify } from '@/lib/dashboard-auth';
import type { RoleName } from '@prisma/client';

const ALLOWED_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const session = await getServerSession(authOptions);

    const where = {
      ...(status && { status: status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED' }),
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
