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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const existing = await prisma.service.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const slug = parsed.data.slug || slugify(parsed.data.title);
    const slugConflict = await prisma.service.findFirst({ where: { slug, NOT: { id: params.id } } });
    if (slugConflict) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: { ...parsed.data, slug },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
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
    if (!MANAGER_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const existing = await prisma.service.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
