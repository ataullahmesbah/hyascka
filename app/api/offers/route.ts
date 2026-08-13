// FILE: app/api/offers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

export async function GET() {
    try {
        const { user, authorized } = await requirePermission('offers.read_own');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const offers = await prisma.customOffer.findMany({
            where: { clientId: user.id, status: { in: ['SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED'] } },
            include: { items: { orderBy: { order: 'asc' } } },
            orderBy: { createdAt: 'desc' },
        });

        // Auto-expire anything past validUntil that's still shown as
        // actionable — enforced here (read path) and again, authoritatively,
        // inside accept/reject before any state change.
        const now = new Date();
        const withComputedStatus = offers.map((o) => ({
            ...o,
            status: o.validUntil && o.validUntil < now && (o.status === 'SENT' || o.status === 'VIEWED') ? 'EXPIRED' : o.status,
        }));

        return NextResponse.json({ offers: withComputedStatus });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
    }
}