// FILE: app/api/dashboard/offers/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { nextOfferNumber } from '@/lib/order-numbers';
import { logActivity } from '@/lib/activity-log';

const offerItemSchema = z.object({
    label: z.string().min(1).max(200),
    amount: z.number().positive(),
    serviceId: z.string().optional(),
});

const createOfferSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    contactId: z.string().min(1),
    clientId: z.string().optional(),
    currency: z.string().min(3).max(3).default('USD'),
    discount: z.number().min(0).default(0),
    validUntil: z.string().datetime().optional(),
    items: z.array(offerItemSchema).min(1, 'An offer needs at least one item'),
});

export async function GET() {
    try {
        const { user, authorized } = await requirePermission('offers.read');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const offers = await prisma.customOffer.findMany({
            include: {
                contact: { select: { id: true, name: true, email: true } },
                client: { select: { id: true, name: true, email: true } },
                createdBy: { select: { id: true, name: true } },
                _count: { select: { items: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(offers);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { user, authorized } = await requirePermission('offers.create');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const parsed = createOfferSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
        }

        const contact = await prisma.contact.findUnique({ where: { id: parsed.data.contactId } });
        if (!contact) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Server computes every financial figure — client only supplies item
        // labels/amounts/discount as a proposal, not a trusted total.
        const subtotal = parsed.data.items.reduce((sum, item) => sum + item.amount, 0);
        const discount = parsed.data.discount;
        const total = subtotal - discount;

        if (total < 0) {
            return NextResponse.json({ error: 'Discount cannot exceed the subtotal' }, { status: 400 });
        }

        const offer = await prisma.$transaction(async (tx) => {
            const offerNumber = await nextOfferNumber(tx);
            return tx.customOffer.create({
                data: {
                    offerNumber,
                    title: parsed.data.title,
                    description: parsed.data.description,
                    subtotal,
                    discount,
                    total,
                    currency: parsed.data.currency,
                    validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : undefined,
                    status: 'DRAFT',
                    createdById: user.id,
                    clientId: parsed.data.clientId ?? contact.userId ?? undefined,
                    contactId: contact.id,
                    items: {
                        create: parsed.data.items.map((item, i) => ({
                            label: item.label,
                            amount: item.amount,
                            serviceId: item.serviceId,
                            order: i,
                        })),
                    },
                },
                include: { items: true },
            });
        });

        await logActivity({
            actorId: user.id,
            actorRole: user.role.name,
            action: 'offer.created',
            targetType: 'CustomOffer',
            targetId: offer.id,
            description: `Offer created: ${offer.title}`,
        });

        return NextResponse.json(offer, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
    }
}