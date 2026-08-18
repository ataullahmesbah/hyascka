// FILE: app/api/dashboard/services/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify, requirePermission } from '@/lib/dashboard-auth';
import { z } from 'zod';

const serviceSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  shortDescription: z.string().max(300).optional(),
  description: z.string().optional(),
  approach: z.string().optional(),
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
}).refine((data) => data.acquisitionType !== 'FIXED_PRICE' || data.price !== undefined, {
  message: 'Fixed-price services require a price',
  path: ['price'],
});

export async function GET() {
  try {
    const { user, authorized } = await requirePermission('services.read');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const services = await prisma.service.findMany({
      include: { category: { select: { id: true, name: true } } },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, authorized } = await requirePermission('services.create');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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

    const { image, ...rest } = parsed.data;
    const service = await prisma.service.create({
      data: { ...rest, slug, image: image || null },
    });
    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}