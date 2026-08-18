// ==========================================================
// NEW FILE
// LOCATION: lib/order-fulfillment.ts
// ==========================================================
import { prisma } from '@/lib/prisma';
import { nextInvoiceNumber } from '@/lib/order-numbers';
import { notify } from '@/lib/notifications';
import { logAudit } from '@/lib/audit-log';

/**
 * Marks an order's payment as PAID and runs every side effect that must
 * happen exactly once when that occurs: invoice creation, ClientService
 * activation, a PAYMENT_CONFIRMED notification, and an audit log entry.
 *
 * Shared by both fulfillment paths:
 *  - app/api/orders/[id]/confirm-payment (a staff member manually confirms
 *    a MANUAL/offline payment)
 *  - app/api/checkout/sslcommerz/ipn (SSLCommerz's server-to-server
 *    payment notification, once real credentials are configured)
 *
 * Idempotent — if the payment is already PAID, returns the current state
 * without re-running side effects, so a double-click or a retried webhook
 * can never create a duplicate invoice or double-activate a service.
 */
export async function confirmOrderPayment(
  orderId: string,
  options: { verifiedById?: string | null; provider?: string; providerReference?: string } = {}
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payment: true,
      invoice: true,
      clientServices: true,
      offer: { include: { items: true } },
    },
  });

  if (!order || !order.payment) {
    return { ok: false as const, reason: 'not_found' as const };
  }

  if (order.payment.status === 'PAID') {
    return { ok: true as const, order, alreadyConfirmed: true };
  }

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: { id: order.payment!.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        verifiedById: options.verifiedById ?? null,
        ...(options.provider && { provider: options.provider }),
        ...(options.providerReference && { reference: options.providerReference }),
      },
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

  await notify(prisma, {
    userId: order.userId,
    type: 'PAYMENT_CONFIRMED',
    title: 'Payment confirmed',
    message: `Invoice ${result.invoice.invoiceNumber} — your service is now active.`,
    link: '/dashboard/my-services',
  });

  await logAudit({
    actorId: options.verifiedById ?? null,
    action: 'payment.confirmed',
    targetType: 'Order',
    targetId: order.id,
    metadata: { provider: options.provider ?? 'MANUAL', amount: order.amount.toString() },
  });

  return { ok: true as const, ...result, alreadyConfirmed: false };
}
