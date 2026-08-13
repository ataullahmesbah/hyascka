// FILE: app/api/offers/[id]/accept/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { nextOrderNumber } from '@/lib/order-numbers';
import { notify } from '@/lib/notifications';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('offers.respond_own');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const offer = await prisma.customOffer.findUnique({
            where: { id: params.id },
            include: { order: true },
        });

        // 404 (not 403) for both "doesn't exist" and "not yours" — same
        // reasoning as order ownership checks (Phase 2): don't confirm a
        // specific offer ID even exists to someone it doesn't belong to.
        if (!offer || offer.clientId !== user.id) {
            return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
        }

        // Idempotent: a double-click or refresh after success returns the
        // existing order rather than erroring or creating a duplicate.
        if (offer.status === 'ACCEPTED' && offer.order) {
            return NextResponse.json({ order: offer.order, alreadyAccepted: true });
        }

        if (offer.status !== 'SENT' && offer.status !== 'VIEWED') {
            return NextResponse.json({ error: 'This offer can no longer be accepted' }, { status: 400 });
        }

        // Expiration is checked here, server-side, as the authoritative gate
        // — never trust a client-computed "still valid" check.
        if (offer.validUntil && offer.validUntil < new Date()) {
            await prisma.customOffer.update({ where: { id: offer.id }, data: { status: 'EXPIRED' } });
            return NextResponse.json({ error: 'This offer has expired' }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatedOffer = await tx.customOffer.update({
                where: { id: offer.id },
                data: { status: 'ACCEPTED' },
            });

            const orderNumber = await nextOrderNumber(tx);
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId: user.id,
                    offerId: offer.id,
                    amount: offer.total,
                    currency: offer.currency,
                    status: 'PENDING',
                    paymentStatus: 'PENDING',
                    payment: {
                        create: {
                            provider: 'MANUAL',
                            amount: offer.total,
                            currency: offer.currency,
                            status: 'PENDING',
                        },
                    },
                },
                include: { payment: true },
            });

            return { offer: updatedOffer, order };
        });

        await notify(prisma, {
            userId: offer.createdById,
            type: 'OFFER_ACCEPTED',
            title: `Offer accepted: ${offer.title}`,
            link: `/dashboard/offers/${offer.id}`,
        });

        return NextResponse.json({ ...result, alreadyAccepted: false });
    } catch {
        return NextResponse.json({ error: 'Failed to accept offer' }, { status: 500 });
    }
}