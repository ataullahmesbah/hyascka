// FILE: app/api/dashboard/stats/moderator/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

/**
 * Only returns data that genuinely exists today (Contact/lead records).
 * Messages, Support Tickets, Meetings, and Tasks are all real product
 * requirements for the Moderator dashboard, but none of those models
 * exist in the schema yet (see Phase 1 audit) — showing counts for them
 * here would be fake data. They'll be added once those models ship.
 */
export async function GET() {
    try {
        const { user, authorized } = await requirePermission('dashboard.viewModeratorOverview');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const [openLeads, newLeads, recentLeads] = await Promise.all([
            prisma.contact.count({ where: { status: { in: ['NEW', 'IN_PROGRESS'] } } }),
            prisma.contact.count({ where: { status: 'NEW' } }),
            prisma.contact.findMany({
                where: { status: { in: ['NEW', 'IN_PROGRESS'] } },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, name: true, email: true, service: true, status: true, createdAt: true },
            }),
        ]);

        return NextResponse.json({ openLeads, newLeads, recentLeads });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch moderator stats' }, { status: 500 });
    }
}