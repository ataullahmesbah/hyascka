// FILE: app/api/dashboard/activity/route.ts
// PURPOSE: Real, database-backed operational activity feed for
// /dashboard/activity — replaces the previous 100% hardcoded mock data.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

const PAGE_SIZE = 50;

export async function GET(req: Request) {
  try {
    const { user, authorized } = await requirePermission('dashboard.viewAgencyOverview');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    const since = new Date();
    since.setHours(0, 0, 0, 0);

    const [activities, todayCount] = await Promise.all([
      prisma.activityLog.findMany({
        where: { ...(action && { action }) },
        include: { actor: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: PAGE_SIZE,
      }),
      prisma.activityLog.count({ where: { createdAt: { gte: since } } }),
    ]);

    return NextResponse.json({ activities, todayCount });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch activity log' }, { status: 500 });
  }
}
