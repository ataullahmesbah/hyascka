// ==========================================================
// NEW FILE
// LOCATION: app/api/checkout/sslcommerz/ipn/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { confirmSslcommerzTransaction } from '@/lib/payments/sslcommerz-confirm';

/**
 * SSLCommerz's server-to-server Instant Payment Notification. Public by
 * necessity (SSLCommerz's servers call this directly, no user session) —
 * safety comes from re-validating with SSLCommerz's own API inside
 * confirmSslcommerzTransaction(), never from trusting this payload.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const valId = form.get('val_id')?.toString();
  const tranId = form.get('tran_id')?.toString();

  if (!valId || !tranId) {
    return NextResponse.json({ error: 'Missing val_id/tran_id' }, { status: 400 });
  }

  const confirmed = await confirmSslcommerzTransaction(valId, tranId);
  return NextResponse.json({ received: true, confirmed });
}
