// FILE: app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDashboardUser, requireOwnership } from '@/lib/dashboard-auth';
import { can } from '@/lib/permissions';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getDashboardUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                service: true,
                user: { select: { id: true, name: true, email: true } },
                payment: true,
                invoice: true,
                clientService: true,
            },
        });

        // Deliberately 404 (not 403) when the resource isn't owned by the
        // requester and they don't have blanket read access — this avoids
        // confirming to a Client that a given order ID even exists, which
        // is itself information a competitor/other client shouldn't get.
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const canReadAll = can(user.role.name, 'orders.read');
        if (!canReadAll) {
            const { authorized } = await requireOwnership(order.userId);
            if (!authorized) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }
        }

        return NextResponse.json(order);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}