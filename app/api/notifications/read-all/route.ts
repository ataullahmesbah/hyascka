// FILE: app/api/notifications/read-all/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDashboardUser } from '@/lib/dashboard-auth';

export async function POST() {
    try {
        const user = await getDashboardUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await prisma.notification.updateMany({
            where: { userId: user.id, readAt: null },
            data: { readAt: new Date() },
        });

        return NextResponse.json({ message: 'All notifications marked as read' });
    } catch {
        return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }
}