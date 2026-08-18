// ==========================================================
// NEW FILE
// LOCATION: app/api/dashboard/audit-logs/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole, MANAGER_ROLES } from '@/lib/dashboard-auth';

const PAGE_SIZE = 50;

export async function GET(req: Request) {
  try {
    const { user, authorized } = await requireRole(MANAGER_ROLES);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        include: { actor: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.auditLog.count(),
    ]);

    return NextResponse.json({ logs, total, page, pageSize: PAGE_SIZE });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
