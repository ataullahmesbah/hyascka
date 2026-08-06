import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { blogSchema } from '@/lib/validation';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') ?? 'PUBLISHED';
    const category = searchParams.get('category');

    const blogs = await prisma.blog.findMany({
      where: {
        status: status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED',
        ...(category && {
          category: { slug: category },
        }),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
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
    const body = await req.json();
    const parsed = blogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        ...parsed.data,
        publishedAt: parsed.data.status === 'PUBLISHED' ? new Date() : null,
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
