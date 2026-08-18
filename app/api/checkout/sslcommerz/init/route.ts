// ==========================================================
// NEW FILE
// LOCATION: app/api/checkout/sslcommerz/init/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/dashboard-auth';
import { initiateSslcommerzSession, isSslcommerzConfigured } from '@/lib/payments/sslcommerz';

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(req: Request) {
  try {
    if (!isSslcommerzConfigured()) {
      return NextResponse.json(
        { error: 'Online payment is not enabled yet. Please use the standard checkout flow.' },
        { status: 501 }
      );
    }

    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
      include: { payment: true, service: true },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (!order.payment || order.payment.status === 'PAID') {
      return NextResponse.json({ error: 'This order is not awaiting payment.' }, { status: 400 });
    }

    const appUrl = process.env.APP_URL ?? new URL(req.url).origin;

    const session = await initiateSslcommerzSession({
      tranId: order.orderNumber,
      amount: Number(order.amount),
      currency: order.currency,
      productName: order.service?.title ?? 'HYASCKA service',
      customerName: user.name ?? user.email,
      customerEmail: user.email,
      successUrl: `${appUrl}/api/checkout/sslcommerz/success`,
      failUrl: `${appUrl}/api/checkout/sslcommerz/fail`,
      cancelUrl: `${appUrl}/api/checkout/sslcommerz/cancel`,
      ipnUrl: `${appUrl}/api/checkout/sslcommerz/ipn`,
    });

    if (!session.ok) {
      return NextResponse.json({ error: session.error }, { status: 502 });
    }

    return NextResponse.json({ gatewayUrl: session.gatewayUrl });
  } catch {
    return NextResponse.json({ error: 'Failed to start online payment' }, { status: 500 });
  }
}
