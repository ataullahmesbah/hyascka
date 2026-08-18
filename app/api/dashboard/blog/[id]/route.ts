import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { blogSchema } from '@/lib/validation';
import { slugify } from '@/lib/dashboard-auth';
import { logActivity } from '@/lib/activity-log';
import type { RoleName } from '@prisma/client';

const ALLOWED_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'];

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const existing = await prisma.blog.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    if (session.user.role === 'EDITOR' && existing.authorId !== session.user.id) {
      return NextResponse.json({ error: 'You can only edit your own posts' }, { status: 403 });
    }

    const slug = parsed.data.slug || slugify(parsed.data.title);

    const slugConflict = await prisma.blog.findFirst({
      where: { slug, NOT: { id: params.id } },
    });
    if (slugConflict) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    const wasPublished = existing.status === 'PUBLISHED';
    const isPublishing = parsed.data.status === 'PUBLISHED';

    const tagIds = (body.tagIds as string[]) ?? [];
    const updated = await prisma.blog.update({
      where: { id: params.id },
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        featuredImage: parsed.data.featuredImage,
        status: parsed.data.status,
        readingTime: parsed.data.readingTime,
        categoryId: parsed.data.categoryId,
        publishedAt: !wasPublished && isPublishing ? new Date() : existing.publishedAt,
        ...(tagIds.length > 0
          ? { tags: { set: tagIds.map((id: string) => ({ id })) } }
          : { tags: { set: [] } }),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });

    if (!wasPublished && isPublishing) {
      await logActivity({
        actorId: session.user.id,
        actorRole: session.user.role,
        action: 'blog.published',
        targetType: 'Blog',
        targetId: updated.id,
        description: `Blog published: ${updated.title}`,
      });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const existing = await prisma.blog.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    if (session.user.role === 'EDITOR' && existing.authorId !== session.user.id) {
      return NextResponse.json({ error: 'You can only delete your own posts' }, { status: 403 });
    }

    await prisma.blog.delete({ where: { id: params.id } });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
