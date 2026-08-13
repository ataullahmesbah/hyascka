// FILE: lib/order-numbers.ts
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type Tx = Prisma.TransactionClient | typeof prisma;

/**
 * Generates the next sequential order number as "HY-1000", "HY-1001", ...
 * Always call with the transaction client (`tx`) the caller is already
 * inside — reading/writing the order in the same transaction is what
 * keeps this correct under concurrent checkouts.
 */
export async function nextOrderNumber(tx: Tx): Promise<string> {
    const last = await tx.order.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { orderNumber: true },
    });

    const lastSeq = last ? parseInt(last.orderNumber.replace('HY-', ''), 10) : 999;
    const nextSeq = Number.isFinite(lastSeq) ? lastSeq + 1 : 1000;
    return `HY-${nextSeq}`;
}

/**
 * Generates the next invoice number as "INV-2026-0001", scoped per
 * calendar year. Call with the transaction client the caller is inside.
 */
export async function nextInvoiceNumber(tx: Tx): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;

    const last = await tx.invoice.findFirst({
        where: { invoiceNumber: { startsWith: prefix } },
        orderBy: { createdAt: 'desc' },
        select: { invoiceNumber: true },
    });

    const lastSeq = last ? parseInt(last.invoiceNumber.replace(prefix, ''), 10) : 0;
    const nextSeq = Number.isFinite(lastSeq) ? lastSeq + 1 : 1;
    return `${prefix}${String(nextSeq).padStart(4, '0')}`;
}

/**
 * Generates the next offer number as "HY-OFR-000001". Call with the
 * transaction client the caller is inside.
 */
export async function nextOfferNumber(tx: Tx): Promise<string> {
    const prefix = 'HY-OFR-';

    const last = await tx.customOffer.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { offerNumber: true },
    });

    const lastSeq = last ? parseInt(last.offerNumber.replace(prefix, ''), 10) : 0;
    const nextSeq = Number.isFinite(lastSeq) ? lastSeq + 1 : 1;
    return `${prefix}${String(nextSeq).padStart(6, '0')}`;
}