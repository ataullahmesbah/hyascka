// FILE: app/api/conversations/[id]/messages/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getDashboardUser } from '@/lib/dashboard-auth';
import { can, type Role } from '@/lib/permissions';
import { notify } from '@/lib/notifications';

const sendSchema = z.object({
    content: z.string().min(1).max(4000),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getDashboardUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const conversation = await prisma.conversation.findUnique({
            where: { id: params.id },
            include: { participants: true },
        });
        if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });

        const isParticipant = conversation.participants.some((p) => p.userId === user.id);
        const isStaff = can(user.role.name as Role, 'leads.read');
        if (!isParticipant && !isStaff) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        const body = await req.json();
        const parsed = sendSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
        }

        const [message] = await prisma.$transaction([
            prisma.message.create({
                data: { conversationId: conversation.id, senderId: user.id, content: parsed.data.content },
                include: { sender: { select: { id: true, name: true, image: true } } },
            }),
            prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } }),
            // Sending also counts as having read up to now.
            prisma.conversationParticipant.upsert({
                where: { conversationId_userId: { conversationId: conversation.id, userId: user.id } },
                update: { lastReadAt: new Date() },
                create: { conversationId: conversation.id, userId: user.id, lastReadAt: new Date() },
            }),
        ]);

        // Notify every other participant — not a broadcast to all staff, just
        // the people actually in this conversation.
        const recipients = conversation.participants.filter((p) => p.userId !== user.id);
        await Promise.all(
            recipients.map((p) =>
                notify(prisma, {
                    userId: p.userId,
                    type: 'NEW_MESSAGE',
                    title: 'New message',
                    message: parsed.data.content.slice(0, 100),
                    link: `/dashboard/messages?c=${conversation.id}`,
                })
            )
        );

        return NextResponse.json(message, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}