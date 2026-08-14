// FILE: app/api/conversations/[id]/read/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDashboardUser } from '@/lib/dashboard-auth';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getDashboardUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const participant = await prisma.conversationParticipant.findUnique({
            where: { conversationId_userId: { conversationId: params.id, userId: user.id } },
        });

        // Only a real participant has read state to update — staff Browse
        // access (via leads.read) doesn't create a participant row, so there's
        // nothing to mark read for them, which is correct: unread counts are
        // a participant concept, not a general staff-visibility concept.
        if (!participant) {
            return NextResponse.json({ message: 'Nothing to mark read' });
        }

        await prisma.conversationParticipant.update({
            where: { conversationId_userId: { conversationId: params.id, userId: user.id } },
            data: { lastReadAt: new Date() },
        });

        return NextResponse.json({ message: 'Marked as read' });
    } catch {
        return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
    }
}