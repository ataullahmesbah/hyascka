import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/dashboard-auth';
import type { RoleName } from '@prisma/client';
import { z } from 'zod';

const MANAGER_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN'];

const techSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  category: z.string().optional(),
});

export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(technologies);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch technologies' }, { status: 500 });
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
    const parsed = techSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const slug = parsed.data.slug || slugify(parsed.data.name);
    const existing = await prisma.technology.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Technology already exists' }, { status: 409 });
    }

    const tech = await prisma.technology.create({ data: { ...parsed.data, slug } });
    return NextResponse.json(tech, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create technology' }, { status: 500 });
  }
}
