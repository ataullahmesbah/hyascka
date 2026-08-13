// FILE: app/api/orders/[id]/confirm-payment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { nextInvoiceNumber } from '@/lib/order-numbers';
import { notify } from '@/lib/notifications';

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
 *
 * Handles two order shapes (Phase 2 vs Phase 3):
 *  - order.serviceId set  → single-service purchase → one ClientService
 *  - order.offerId set    → custom-offer purchase → one ClientService per
 *    offer item that references a real Service (custom-only line items
 *    don't have anything in the catalog to activate)
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('payments.confirm');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                payment: true,
                invoice: true,
                clientServices: true,
                offer: { include: { items: true } },
            },
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

            let clientServices = order.clientServices;
            if (clientServices.length === 0) {
                if (order.serviceId) {
                    clientServices = [
                        await tx.clientService.create({
                            data: {
                                userId: order.userId,
                                serviceId: order.serviceId,
                                orderId: order.id,
                                status: 'ACTIVE',
                                activatedAt: new Date(),
                            },
                        }),
                    ];
                } else if (order.offer) {
                    const serviceItems = order.offer.items.filter((item) => item.serviceId);
                    clientServices = await Promise.all(
                        serviceItems.map((item) =>
                            tx.clientService.create({
                                data: {
                                    userId: order.userId,
                                    serviceId: item.serviceId!,
                                    orderId: order.id,
                                    status: 'ACTIVE',
                                    activatedAt: new Date(),
                                },
                            })
                        )
                    );
                }
            }

            return { payment, order: updatedOrder, invoice, clientServices };
        });

        // ORDER_CREATED / PAYMENT_SUCCESSFUL / INVOICE_CREATED / SERVICE_ACTIVATED
        // event boundary — this is the one that actually fires now that
        // notifications exist (Phase 3).
        await notify(prisma, {
            userId: order.userId,
            type: 'PAYMENT_CONFIRMED',
            title: 'Payment confirmed',
            message: `Invoice ${result.invoice.invoiceNumber} — your service is now active.`,
            link: '/dashboard/my-services',
        });

        return NextResponse.json({ ...result, alreadyConfirmed: false });
    } catch {
        return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
    }
}