// FILE: lib/client-linking.ts
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type Tx = Prisma.TransactionClient | typeof prisma;

/**
 * Links a resolved CLIENT user to every Contact (Lead) sharing that email
 * that isn't already linked to some other account, and backfills any of
 * those leads' DRAFT/unsent CustomOffers that don't have a clientId yet.
 *
 * Deliberately keyed off email at link time only (once, server-side, right
 * after we've confirmed the account) — NOT something later requests rely
 * on. Every subsequent read (my-offers, my-orders, messages) must go
 * through the stored Contact.userId / CustomOffer.clientId relationship,
 * never re-match by email.
 */
export async function linkClientToLeads(tx: Tx, email: string, userId: string) {
    // Case-insensitive: the public /contact form (unlike register/login) does
    // not lowercase the submitted email before storing it, so an exact-match
    // lookup here would silently miss leads that differ only in casing.
    const leads = await tx.contact.findMany({
        where: { email: { equals: email, mode: 'insensitive' }, userId: null },
        select: { id: true },
    });

    if (leads.length === 0) return { linkedLeadCount: 0, linkedOfferCount: 0 };

    await tx.contact.updateMany({
        where: { id: { in: leads.map((l: { id: string }) => l.id) } },
        data: { userId },
    });

    const offerResult = await tx.customOffer.updateMany({
        where: { contactId: { in: leads.map((l: { id: string }) => l.id) }, clientId: null },
        data: { clientId: userId },
    });

    return { linkedLeadCount: leads.length, linkedOfferCount: offerResult.count };
}