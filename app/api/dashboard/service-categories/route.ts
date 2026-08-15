// FILE: app/api/dashboard/service-categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify, requirePermission } from '@/lib/dashboard-auth';
import { z } from 'zod';

const groupSchema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().optional(),
    description: z.string().optional(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
});

export async function GET() {
    try {
        const { user, authorized } = await requirePermission('services.categories.manage');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const groups = await prisma.serviceCategory.findMany({
            include: { _count: { select: { services: true } } },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(groups);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch service groups' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { user, authorized } = await requirePermission('services.categories.manage');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const parsed = groupSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
        }

        const slug = parsed.data.slug || slugify(parsed.data.name);
        const existing = await prisma.serviceCategory.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: 'A service group with this slug already exists' }, { status: 409 });
        }

        const group = await prisma.serviceCategory.create({ data: { ...parsed.data, slug } });
        return NextResponse.json(group, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create service group' }, { status: 500 });
    }
}