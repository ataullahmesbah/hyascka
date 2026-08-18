// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/api/orders/[id]/confirm-payment/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/dashboard-auth';
import { confirmOrderPayment } from '@/lib/order-fulfillment';

/**
 * Manual payment confirmation (provider === 'MANUAL'): an admin confirms
 * a bank transfer / offline payment actually landed. The shared
 * transaction (invoice, ClientService activation, notification, audit
 * log) lives in lib/order-fulfillment.ts — the SSLCommerz IPN webhook
 * calls the same function once real gateway credentials are configured.
 */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('payments.confirm');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const result = await confirmOrderPayment(params.id, { verifiedById: user.id, provider: 'MANUAL' });

        if (!result.ok) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
    }
}
