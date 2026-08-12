// FILE: app/api/orders/[id]/confirm-payment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { nextInvoiceNumber } from '@/lib/order-numbers';

/**
 * Manual payment confirmation (provider === 'MANUAL'): an admin confirms
 * a bank transfer / offline payment actually landed, since no live
 * payment gateway is configured yet (see Phase 2 report). When a real
 * gateway is added later, its webhook handler should perform the exact
 * same transaction below instead of a human click — the business logic
 * doesn't change, only what triggers it.
 *
 * Idempotent: if the payment is already PAID, this returns the current
 * state instead of re-running the transaction, so a double-click or a
 * retried webhook can never create a duplicate invoice or double-activate
 * the client service.
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('payments.confirm');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: { payment: true, invoice: true, clientService: true },
        });

        if (!order || !order.payment) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.payment.status === 'PAID') {
            // Already processed — return current state rather than an error,
            // and rather than re-running side effects a second time.
            return NextResponse.json({ order, alreadyConfirmed: true });
        }

        const result = await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.update({
                where: { id: order.payment!.id },
                data: { status: 'PAID', paidAt: new Date(), verifiedById: user.id },
            });

            const updatedOrder = await tx.order.update({
                where: { id: order.id },
                data: { status: 'COMPLETED', paymentStatus: 'PAID' },
            });

            const invoice =
                order.invoice ??
                (await tx.invoice.create({
                    data: {
                        invoiceNumber: await nextInvoiceNumber(tx),
                        orderId: order.id,
                        userId: order.userId,
                        serviceId: order.serviceId,
                        subtotal: order.amount,
                        discount: 0,
                        total: order.amount,
                        currency: order.currency,
                        status: 'PAID',
                        issueDate: new Date(),
                    },
                }));

            const clientService =
                order.clientService ??
                (await tx.clientService.create({
                    data: {
                        userId: order.userId,
                        serviceId: order.serviceId,
                        orderId: order.id,
                        status: 'ACTIVE',
                        activatedAt: new Date(),
                    },
                }));

            return { payment, order: updatedOrder, invoice, clientService };
        });

        // ORDER_CREATED / PAYMENT_SUCCESSFUL / INVOICE_CREATED / SERVICE_ACTIVATED
        // event boundary: no notification system exists yet (out of Phase 2
        // scope), but this is exactly where those would fire once it does.

        return NextResponse.json({ ...result, alreadyConfirmed: false });
    } catch {
        return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
    }
}