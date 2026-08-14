// FILE: app/api/notifications/[id]/read/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDashboardUser } from '@/lib/dashboard-auth';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getDashboardUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const notification = await prisma.notification.findUnique({ where: { id: params.id } });
        if (!notification || notification.userId !== user.id) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }

        const updated = await prisma.notification.update({
            where: { id: params.id },
            data: { readAt: new Date() },
        });

        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}