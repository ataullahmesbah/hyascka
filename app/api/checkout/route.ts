// FILE: app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { nextOrderNumber } from '@/lib/order-numbers';

const checkoutSchema = z.object({
    serviceId: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const { user, authorized } = await requirePermission('orders.create_own');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json().catch(() => null);
        const parsed = checkoutSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid checkout request' }, { status: 400 });
        }

        // The ONLY thing trusted from the client is which service was picked.
        // Price, currency, and availability are all read from the database.
        const service = await prisma.service.findUnique({ where: { id: parsed.data.serviceId } });

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
        if (service.status !== 'PUBLISHED') {
            return NextResponse.json({ error: 'This service is not currently available' }, { status: 400 });
        }
        if (service.price === null) {
            return NextResponse.json({ error: 'This service is not yet available for online purchase' }, { status: 400 });
        }

        const order = await prisma.$transaction(async (tx) => {
            const orderNumber = await nextOrderNumber(tx);

            return tx.order.create({
                data: {
                    orderNumber,
                    userId: user.id,
                    serviceId: service.id,
                    amount: service.price!,
                    currency: service.currency,
                    status: 'PENDING',
                    paymentStatus: 'PENDING',
                    payment: {
                        create: {
                            provider: 'MANUAL',
                            amount: service.price!,
                            currency: service.currency,
                            status: 'PENDING',
                        },
                    },
                },
                include: { payment: true, service: true },
            });
        });

        return NextResponse.json(order, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}