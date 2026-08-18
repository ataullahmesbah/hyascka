// ==========================================================
// NEW FILE
// LOCATION: lib/payments/sslcommerz-confirm.ts
// ==========================================================
import { prisma } from '@/lib/prisma';
import { confirmOrderPayment } from '@/lib/order-fulfillment';
import { validateSslcommerzTransaction } from '@/lib/payments/sslcommerz';

/**
 * Shared by both the IPN webhook (server-to-server, the reliable path)
 * and the success redirect (browser comes back here — useful as a
 * fallback in sandbox/dev setups where SSLCommerz can't reach a
 * localhost ipn_url). Both call this; confirmOrderPayment() is
 * idempotent, so handling the same transaction twice is harmless.
 *
 * Never trusts val_id/tran_id from the caller alone — always re-validates
 * server-to-server via SSLCommerz's own validator API, and cross-checks
 * the validated amount against the order before marking it paid.
 */
export async function confirmSslcommerzTransaction(valId: string, tranId: string): Promise<boolean> {
  const validation = await validateSslcommerzTransaction(valId);
  if (!validation.ok || validation.tranId !== tranId) {
    return false;
  }

  const order = await prisma.order.findUnique({ where: { orderNumber: tranId } });
  if (!order) return false;

  if (validation.amount === undefined || Math.abs(validation.amount - Number(order.amount)) > 0.01) {
    console.error('sslcommerz: validated amount does not match order amount', tranId);
    return false;
  }

  const result = await confirmOrderPayment(order.id, {
    provider: 'SSLCOMMERZ',
    providerReference: valId,
  });

  return result.ok;
}
