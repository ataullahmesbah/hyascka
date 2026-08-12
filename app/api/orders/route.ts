// FILE: app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDashboardUser } from '@/lib/dashboard-auth';
import { can } from '@/lib/permissions';

export async function GET(req: Request) {
  try {
    const user = await getDashboardUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = user.role.name;
    const canReadAll = can(role, 'orders.read');
    const canReadOwn = can(role, 'orders.read_own');

    if (!canReadAll && !canReadOwn) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
    const pageSize = 20;

    const where = canReadAll ? {} : { userId: user.id };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          service: { select: { title: true, slug: true } },
          user: canReadAll ? { select: { name: true, email: true } } : false,
          payment: { select: { status: true, provider: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, pageSize });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}