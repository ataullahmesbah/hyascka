// ==========================================================
// NEW FILE
// LOCATION: app/api/checkout/sslcommerz/success/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { confirmSslcommerzTransaction } from '@/lib/payments/sslcommerz-confirm';

/**
 * Browser redirect after a successful payment. This ALSO attempts
 * confirmation (not just the IPN webhook) because in sandbox/dev setups
 * SSLCommerz frequently can't reach a localhost ipn_url — confirmation is
 * idempotent, so doing it here as well as in the IPN handler is safe.
 * The redirect happens either way; SSLCommerz's own validation is what
 * actually gates whether the order gets marked paid, not this route.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const valId = form.get('val_id')?.toString();
  const tranId = form.get('tran_id')?.toString();
  const appUrl = process.env.APP_URL ?? new URL(req.url).origin;

  if (valId && tranId) {
    await confirmSslcommerzTransaction(valId, tranId);
  }

  return NextResponse.redirect(`${appUrl}/dashboard/orders?payment=success`, { status: 303 });
}

export async function GET(req: Request) {
  const appUrl = process.env.APP_URL ?? new URL(req.url).origin;
  return NextResponse.redirect(`${appUrl}/dashboard/orders?payment=success`);
}
