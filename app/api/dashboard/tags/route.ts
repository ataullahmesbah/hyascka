import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/dashboard-auth';
import type { RoleName } from '@prisma/client';
import { z } from 'zod';

const MANAGER_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'];

const tagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().optional(),
});

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { blogs: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!MANAGER_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = tagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const slug = parsed.data.slug || slugify(parsed.data.name);
    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
    }

    const tag = await prisma.tag.create({ data: { ...parsed.data, slug } });
    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!MANAGER_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.tag.delete({ where: { id } });
    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
