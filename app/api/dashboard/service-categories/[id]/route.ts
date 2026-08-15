// FILE: app/api/dashboard/service-categories/[id]/route.ts
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

const statusSchema = z.object({
    isActive: z.boolean(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('services.categories.manage');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const parsed = groupSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
        }

        const existing = await prisma.serviceCategory.findUnique({ where: { id: params.id } });
        if (!existing) {
            return NextResponse.json({ error: 'Service group not found' }, { status: 404 });
        }

        const slug = parsed.data.slug || slugify(parsed.data.name);
        const slugConflict = await prisma.serviceCategory.findFirst({ where: { slug, NOT: { id: params.id } } });
        if (slugConflict) {
            return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
        }

        const updated = await prisma.serviceCategory.update({
            where: { id: params.id },
            data: { ...parsed.data, slug },
        });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Failed to update service group' }, { status: 500 });
    }
}

/** Quick activate/deactivate toggle — used by the group list's switch. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('services.categories.manage');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const parsed = statusSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const existing = await prisma.serviceCategory.findUnique({ where: { id: params.id } });
        if (!existing) {
            return NextResponse.json({ error: 'Service group not found' }, { status: 404 });
        }

        const updated = await prisma.serviceCategory.update({
            where: { id: params.id },
            data: { isActive: parsed.data.isActive },
        });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Failed to update service group status' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('services.categories.manage');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const existing = await prisma.serviceCategory.findUnique({
            where: { id: params.id },
            include: { _count: { select: { services: true } } },
        });
        if (!existing) {
            return NextResponse.json({ error: 'Service group not found' }, { status: 404 });
        }

        // A group with services still assigned to it can't be deleted outright —
        // deleting it would either cascade-delete real services or leave a
        // dangling foreign key, neither of which is safe. Deactivate instead.
        if (existing._count.services > 0) {
            return NextResponse.json(
                { error: 'This group still has services assigned to it. Move or archive them first, or deactivate the group instead.' },
                { status: 409 }
            );
        }

        await prisma.serviceCategory.delete({ where: { id: params.id } });
        return NextResponse.json({ message: 'Service group deleted successfully' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete service group' }, { status: 500 });
    }
}