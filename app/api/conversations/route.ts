// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/api/conversations/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { can, type Role } from '@/lib/permissions';
import { notify } from '@/lib/notifications';

export async function GET() {
    try {
        const { user, authorized } = await requirePermission('messages.read');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Staff who can read leads see every conversation (they may need to
        // pick up a colleague's thread) — CLIENT/USER only ever see
        // conversations they personally participate in.
        const canSeeAll = can(user.role.name as Role, 'leads.read');

        const participations = await prisma.conversationParticipant.findMany({
            where: { userId: user.id },
            select: { conversationId: true, lastReadAt: true },
        });
        const readMap = new Map(participations.map((p) => [p.conversationId, p.lastReadAt]));

        const conversations = await prisma.conversation.findMany({
            where: canSeeAll ? {} : { id: { in: Array.from(readMap.keys()) } },
            include: {
                contact: { select: { id: true, name: true, email: true } },
                participants: { include: { user: { select: { id: true, name: true, email: true } } } },
                messages: { orderBy: { createdAt: 'desc' }, take: 1 },
                _count: { select: { messages: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });

        const withUnread = await Promise.all(
            conversations.map(async (c) => {
                const lastReadAt = readMap.get(c.id);
                const unreadCount = await prisma.message.count({
                    where: {
                        conversationId: c.id,
                        senderId: { not: user.id },
                        ...(lastReadAt && { createdAt: { gt: lastReadAt } }),
                    },
                });
                return { ...c, unreadCount };
            })
        );

        return NextResponse.json({ conversations: withUnread });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }
}

const createSchema = z.object({
    contactId: z.string().min(1),
    clientId: z.string().min(1),
    subject: z.string().max(200).optional(),
});

/**
 * Staff-initiated only ("Message Customer" from a Lead's detail page —
 * Phase 3.1 §6). Clients read/reply within a conversation staff already
 * started; they don't open new ones themselves. Reuses an existing
 * conversation for the same contact instead of creating a duplicate.
 */
export async function POST(req: Request) {
    try {
        const { user, authorized } = await requirePermission('leads.update');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const parsed = createSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const existing = await prisma.conversation.findFirst({
            where: {
                contactId: parsed.data.contactId,
                participants: { some: { userId: parsed.data.clientId } },
            },
        });
        if (existing) {
            return NextResponse.json({ conversation: existing, reused: true });
        }

        const conversation = await prisma.conversation.create({
            data: {
                contactId: parsed.data.contactId,
                subject: parsed.data.subject,
                participants: {
                    create: [{ userId: user.id }, { userId: parsed.data.clientId }],
                },
            },
            include: { participants: true },
        });

        await notify(prisma, {
            userId: parsed.data.clientId,
            type: 'NEW_MESSAGE',
            title: 'New conversation started',
            link: `/dashboard/messages?c=${conversation.id}`,
        });

        return NextResponse.json({ conversation, reused: false }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }
}