// FILE: app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDashboardUser } from '@/lib/dashboard-auth';

export async function GET() {
    try {
        const user = await getDashboardUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Always the authenticated session's own id — a userId query param is
        // never accepted here, so there's no way to request someone else's.
        const [notifications, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                take: 30,
            }),
            prisma.notification.count({ where: { userId: user.id, readAt: null } }),
        ]);

        return NextResponse.json({ notifications, unreadCount });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}