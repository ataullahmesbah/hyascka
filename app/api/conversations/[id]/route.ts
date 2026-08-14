// FILE: app/api/conversations/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDashboardUser } from '@/lib/dashboard-auth';
import { can, type Role } from '@/lib/permissions';

async function canAccessConversation(userId: string, role: Role, conversationId: string) {
    if (can(role, 'leads.read')) return true; // staff with lead access can open any conversation
    const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId, userId } },
    });
    return !!participant;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getDashboardUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const allowed = await canAccessConversation(user.id, user.role.name as Role, params.id);
        // 404, not 403 — don't confirm a conversation ID exists to someone
        // who isn't part of it.
        if (!allowed) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });

        const conversation = await prisma.conversation.findUnique({
            where: { id: params.id },
            include: {
                contact: { select: { id: true, name: true, email: true } },
                participants: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: { select: { id: true, name: true, image: true } } },
                },
            },
        });

        if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        return NextResponse.json(conversation);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
    }
}