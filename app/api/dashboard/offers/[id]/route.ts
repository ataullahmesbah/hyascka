// FILE: app/api/dashboard/offers/[id]/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { can, type Role } from '@/lib/permissions';
import { notify } from '@/lib/notifications';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('offers.read');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const offer = await prisma.customOffer.findUnique({
            where: { id: params.id },
            include: {
                items: { orderBy: { order: 'asc' } },
                contact: true,
                client: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true } },
                order: { select: { id: true, orderNumber: true, status: true, paymentStatus: true } },
            },
        });

        if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
        return NextResponse.json(offer);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 });
    }
}

const statusSchema = z.object({
    action: z.enum(['send', 'cancel']),
});

/**
 * Status transitions only — SENT and CANCELLED here. Financial fields
 * (items/discount/total) are only editable while DRAFT via a future
 * dedicated edit endpoint; once SENT, this route deliberately has no
 * path back to editing amounts, per "do not silently modify historical
 * financial records" (Phase 3 §18).
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('offers.send');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const parsed = statusSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // 'cancel' requires the narrower offers.cancel capability
        // (SUPER_ADMIN/ADMIN) — a MODERATOR can send an offer but shouldn't
        // be able to unilaterally cancel one.
        if (parsed.data.action === 'cancel' && !can(user.role.name as Role, 'offers.cancel')) {
            return NextResponse.json({ error: 'Only Super Admin or Admin can cancel offers' }, { status: 403 });
        }

        const offer = await prisma.customOffer.findUnique({ where: { id: params.id } });
        if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });

        if (parsed.data.action === 'send') {
            if (offer.status !== 'DRAFT') {
                return NextResponse.json({ error: 'Only draft offers can be sent' }, { status: 400 });
            }
            if (!offer.clientId) {
                return NextResponse.json(
                    { error: "This lead doesn't have a registered account yet — link a client before sending." },
                    { status: 400 }
                );
            }

            const updated = await prisma.customOffer.update({
                where: { id: offer.id },
                data: { status: 'SENT' },
            });

            await notify(prisma, {
                userId: offer.clientId,
                type: 'NEW_OFFER',
                title: `New offer: ${offer.title}`,
                message: `${offer.currency} ${Number(offer.total).toLocaleString()}`,
                link: `/dashboard/offers/${offer.id}`,
            });

            return NextResponse.json(updated);
        }

        // cancel
        if (offer.status === 'ACCEPTED') {
            return NextResponse.json({ error: 'Cannot cancel an accepted offer' }, { status: 400 });
        }
        const cancelled = await prisma.customOffer.update({
            where: { id: offer.id },
            data: { status: 'CANCELLED' },
        });
        return NextResponse.json(cancelled);
    } catch {
        return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
    }
}