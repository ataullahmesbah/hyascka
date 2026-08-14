// FILE: app/api/dashboard/stats/moderator/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

/**
 * Messages, Offers, and Leads are all real now (Phase 3/3.1) — Tasks and
 * Meetings still aren't (no model exists), so those remain out of this
 * response rather than being faked.
 */
export async function GET() {
    try {
        const { user, authorized } = await requirePermission('dashboard.viewModeratorOverview');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const [assignedLeads, openLeads, offersNeedingAttention, recentLeads, unreadMessages] = await Promise.all([
            prisma.contact.count({ where: { assignedToId: user.id } }),
            prisma.contact.count({ where: { status: { in: ['NEW', 'CONTACTED', 'QUALIFIED'] } } }),
            prisma.customOffer.count({ where: { status: { in: ['DRAFT', 'SENT', 'VIEWED'] } } }),
            prisma.contact.findMany({
                where: { status: { in: ['NEW', 'CONTACTED', 'QUALIFIED'] } },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, name: true, email: true, service: true, status: true, createdAt: true },
            }),
            (async () => {
                const myConversations = await prisma.conversationParticipant.findMany({
                    where: { userId: user.id },
                    select: { conversationId: true, lastReadAt: true },
                });
                const counts = await Promise.all(
                    myConversations.map((p) =>
                        prisma.message.count({
                            where: {
                                conversationId: p.conversationId,
                                senderId: { not: user.id },
                                ...(p.lastReadAt && { createdAt: { gt: p.lastReadAt } }),
                            },
                        })
                    )
                );
                return counts.reduce((sum, c) => sum + c, 0);
            })(),
        ]);

        return NextResponse.json({ assignedLeads, openLeads, offersNeedingAttention, recentLeads, unreadMessages });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch moderator stats' }, { status: 500 });
    }
}