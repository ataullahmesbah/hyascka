// FILE: app/api/blog/[slug]/comments/route.ts
// PURPOSE: Public blog comments — GET returns only APPROVED comments for
// this post; POST submits a new comment, always created as PENDING (never
// auto-published — moderation happens in the dashboard). No auth required
// for either: anyone can read approved comments or leave one, matching
// how blog comments work everywhere else.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { commentSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const blog = await prisma.blog.findUnique({ where: { slug: params.slug }, select: { id: true } });
    if (!blog) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const comments = await prisma.comment.findMany({
      where: { blogId: blog.id, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, content: true, createdAt: true },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const blog = await prisma.blog.findUnique({ where: { slug: params.slug }, select: { id: true, status: true } });
    if (!blog || blog.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    // Honeypot tripped — pretend success so the bot gets no feedback, but
    // never actually write the row.
    if (parsed.data.website) {
      return NextResponse.json({ message: 'Comment submitted for review' }, { status: 201 });
    }

    await prisma.comment.create({
      data: {
        blogId: blog.id,
        name: parsed.data.name,
        email: parsed.data.email,
        content: parsed.data.content,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ message: 'Comment submitted for review' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}
