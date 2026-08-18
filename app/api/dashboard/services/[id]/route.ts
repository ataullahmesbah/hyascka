// FILE: app/api/dashboard/services/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify, requirePermission } from '@/lib/dashboard-auth';
import { logActivity } from '@/lib/activity-log';
import { z } from 'zod';

const serviceSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  shortDescription: z.string().max(300).optional(),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  icon: z.string().optional(),
  features: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
  categoryId: z.string().optional(),
  price: z.number().positive().optional(),
  currency: z.string().min(3).max(3).default('USD'),
  acquisitionType: z.enum(['FIXED_PRICE', 'CUSTOM_QUOTE']).default('FIXED_PRICE'),
  deliveryTime: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

const statusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, authorized } = await requirePermission('services.update');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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

    const { image, ...rest } = parsed.data;
    const updated = await prisma.service.update({
      where: { id: params.id },
      data: { ...rest, slug, image: image || null },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

/** Quick publish/archive/draft status change — used by the admin list's action menu. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, authorized } = await requirePermission('services.update');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await prisma.service.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });

    await logActivity({
      actorId: user.id,
      actorRole: user.role.name,
      action: 'service.statusChanged',
      targetType: 'Service',
      targetId: updated.id,
      description: `Service "${updated.title}" set to ${updated.status}`,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update service status' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, authorized } = await requirePermission('services.update');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const existing = await prisma.service.findUnique({
      where: { id: params.id },
      include: { _count: { select: { orders: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Services with order history are financial records by association —
    // archive instead of deleting so past orders/invoices keep a valid
    // reference. Delete is only for services nobody has ever purchased.
    if (existing._count.orders > 0) {
      return NextResponse.json(
        { error: 'This service has order history and cannot be deleted. Archive it instead.' },
        { status: 409 }
      );
    }

    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}