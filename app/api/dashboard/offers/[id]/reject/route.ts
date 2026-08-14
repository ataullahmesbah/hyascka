// FILE: app/api/offers/[id]/reject/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { notify } from '@/lib/notifications';
import { sendEmail, offerResponseStaffEmail } from '@/lib/email';

const rejectSchema = z.object({
    reason: z.string().max(1000).optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('offers.respond_own');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json().catch(() => ({}));
        const parsed = rejectSchema.safeParse(body);

        const offer = await prisma.customOffer.findUnique({ where: { id: params.id } });
        if (!offer || offer.clientId !== user.id) {
            return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
        }

        if (offer.status !== 'SENT' && offer.status !== 'VIEWED') {
            return NextResponse.json({ error: 'This offer can no longer be rejected' }, { status: 400 });
        }

        const updated = await prisma.customOffer.update({
            where: { id: offer.id },
            data: {
                status: 'REJECTED',
                rejectReason: parsed.success ? parsed.data.reason : undefined,
            },
        });

        await notify(prisma, {
            userId: offer.createdById,
            type: 'OFFER_REJECTED',
            title: `Offer rejected: ${offer.title}`,
            link: `/dashboard/offers/${offer.id}`,
        });

        try {
            const staff = await prisma.user.findUnique({ where: { id: offer.createdById } });
            if (staff) {
                await sendEmail(
                    offerResponseStaffEmail({
                        to: staff.email,
                        staffName: staff.name ?? 'there',
                        offerTitle: offer.title,
                        offerNumber: offer.offerNumber,
                        accepted: false,
                        rejectReason: updated.rejectReason ?? undefined,
                    })
                );
            }
        } catch (emailError) {
            console.error('[offers] reject-notification email failed:', emailError);
        }

        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Failed to reject offer' }, { status: 500 });
    }
}