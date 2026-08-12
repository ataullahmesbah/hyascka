// FILE: app/api/client/services/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

export async function GET() {
    try {
        const { user, authorized } = await requirePermission('clientServices.read_own');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const services = await prisma.clientService.findMany({
            where: { userId: user.id },
            include: {
                service: { select: { title: true, slug: true, image: true, deliveryTime: true } },
                order: { select: { orderNumber: true, createdAt: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ services });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}