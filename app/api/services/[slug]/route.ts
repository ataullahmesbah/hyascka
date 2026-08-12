// FILE: app/api/services/[slug]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
    try {
        const service = await prisma.service.findUnique({
            where: { slug: params.slug },
            include: { category: { select: { name: true, slug: true } } },
        });

        if (!service || service.status !== 'PUBLISHED') {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json(service);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
    }
}