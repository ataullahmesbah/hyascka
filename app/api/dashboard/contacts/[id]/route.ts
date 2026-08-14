// FILE: app/api/dashboard/contacts/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('leads.read');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const contact = await prisma.contact.findUnique({
            where: { id: params.id },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                user: { select: { id: true, name: true, email: true, role: { select: { name: true } } } },
                offers: { select: { id: true, offerNumber: true, title: true, status: true, total: true, currency: true } },
                invitations: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { id: true, email: true, expiresAt: true, usedAt: true, createdAt: true },
                },
            },
        });

        if (!contact) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json(contact);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
    }
}