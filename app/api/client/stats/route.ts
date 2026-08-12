// FILE: app/api/client/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

export async function GET() {
    try {
        const { user, authorized } = await requirePermission('orders.read_own');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const [activeServices, totalOrders, pendingOrders, unpaidInvoices, completedServices] = await Promise.all([
            prisma.clientService.count({ where: { userId: user.id, status: 'ACTIVE' } }),
            prisma.order.count({ where: { userId: user.id } }),
            prisma.order.count({ where: { userId: user.id, status: 'PENDING' } }),
            prisma.invoice.count({ where: { userId: user.id, status: 'UNPAID' } }),
            prisma.clientService.count({ where: { userId: user.id, status: 'COMPLETED' } }),
        ]);

        return NextResponse.json({ activeServices, totalOrders, pendingOrders, unpaidInvoices, completedServices });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}