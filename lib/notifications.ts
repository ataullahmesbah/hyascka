// FILE: lib/notifications.ts
import type { Prisma, NotificationType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type Tx = Prisma.TransactionClient | typeof prisma;

/**
 * Creates a single database notification for one user. Intentionally
 * does NOT send an email — Nodemailer is configured for auth flows only;
 * wiring transactional emails to these same events is a clean follow-up
 * (see Phase 3 report) but out of scope for this pass to keep review size
 * sane. Call this inside the same transaction as the event it represents
 * where practical (e.g. offer send, lead assignment).
 */
export async function notify(
    tx: Tx,
    params: { userId: string; type: NotificationType; title: string; message?: string; link?: string }
) {
    return tx.notification.create({
        data: {
            userId: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            link: params.link,
        },
    });
}