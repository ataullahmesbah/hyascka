import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/dashboard-auth';
import type { RoleName } from '@prisma/client';
import { z } from 'zod';

const MANAGER_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN'];

const serviceSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  features: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
});

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
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
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const slug = parsed.data.slug || slugify(parsed.data.title);
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Service with this slug already exists' }, { status: 409 });
    }

    const service = await prisma.service.create({
      data: { ...parsed.data, slug },
    });
    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
