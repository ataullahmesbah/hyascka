// ==========================================================
// NEW FILE
// LOCATION: lib/payments/sslcommerz.ts
// ==========================================================
/**
 * SSLCommerz payment gateway client.
 *
 * Scaffolded ahead of real credentials being available — every call here
 * is inert until SSLCOMMERZ_STORE_ID / SSLCOMMERZ_STORE_PASSWORD are set
 * (see isSslcommerzConfigured()). The checkout flow falls back to the
 * existing MANUAL/offline-confirm path when it isn't configured, so
 * nothing breaks in the meantime.
 *
 * Docs: https://developer.sslcommerz.com/doc/v4/
 */

const SANDBOX_BASE = 'https://sandbox.sslcommerz.com';
const LIVE_BASE = 'https://securepay.sslcommerz.com';

function isLive(): boolean {
  return process.env.SSLCOMMERZ_IS_LIVE === 'true';
}

function baseUrl(): string {
  return isLive() ? LIVE_BASE : SANDBOX_BASE;
}

export function isSslcommerzConfigured(): boolean {
  return Boolean(process.env.SSLCOMMERZ_STORE_ID && process.env.SSLCOMMERZ_STORE_PASSWORD);
}

interface InitiateSessionParams {
  tranId: string;
  amount: number;
  currency: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  ipnUrl: string;
}

interface InitiateSessionResult {
  ok: true;
  gatewayUrl: string;
  sessionKey: string;
}

interface InitiateSessionError {
  ok: false;
  error: string;
}

export async function initiateSslcommerzSession(
  params: InitiateSessionParams
): Promise<InitiateSessionResult | InitiateSessionError> {
  if (!isSslcommerzConfigured()) {
    return { ok: false, error: 'SSLCommerz is not configured (missing store credentials).' };
  }

  const body = new URLSearchParams({
    store_id: process.env.SSLCOMMERZ_STORE_ID!,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
    total_amount: params.amount.toFixed(2),
    currency: params.currency,
    tran_id: params.tranId,
    success_url: params.successUrl,
    fail_url: params.failUrl,
    cancel_url: params.cancelUrl,
    ipn_url: params.ipnUrl,
    // SSLCommerz requires these even for digital/service products.
    cus_name: params.customerName,
    cus_email: params.customerEmail,
    cus_add1: 'N/A',
    cus_city: 'N/A',
    cus_country: 'Bangladesh',
    cus_phone: 'N/A',
    shipping_method: 'NO',
    product_name: params.productName,
    product_category: 'Service',
    product_profile: 'general',
  });

  const res = await fetch(`${baseUrl()}/gwprocess/v4/api.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await res.json();

  if (data.status !== 'SUCCESS' || !data.GatewayPageURL) {
    return { ok: false, error: data.failedreason || 'SSLCommerz session initiation failed.' };
  }

  return { ok: true, gatewayUrl: data.GatewayPageURL, sessionKey: data.sessionkey };
}

interface ValidationResult {
  ok: boolean;
  tranId?: string;
  amount?: number;
  currency?: string;
  status?: string;
}

/**
 * Server-to-server validation of a completed transaction — the only
 * source of truth for "did this payment actually happen." Never mark an
 * order paid based solely on the browser-redirect success callback or the
 * IPN payload's own fields; both must be confirmed against this endpoint.
 */
export async function validateSslcommerzTransaction(valId: string): Promise<ValidationResult> {
  if (!isSslcommerzConfigured()) {
    return { ok: false };
  }

  const params = new URLSearchParams({
    val_id: valId,
    store_id: process.env.SSLCOMMERZ_STORE_ID!,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
    format: 'json',
  });

  const res = await fetch(`${baseUrl()}/validator/api/validationserverAPI.php?${params.toString()}`);
  const data = await res.json();

  const valid = data.status === 'VALID' || data.status === 'VALIDATED';
  if (!valid) return { ok: false };

  return {
    ok: true,
    tranId: data.tran_id,
    amount: parseFloat(data.amount),
    currency: data.currency,
    status: data.status,
  };
}
