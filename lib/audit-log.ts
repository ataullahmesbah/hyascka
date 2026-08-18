// ==========================================================
// NEW FILE
// LOCATION: lib/audit-log.ts
// ==========================================================
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * Records a sensitive dashboard action (role change, deletion, settings
 * update, payment confirmation, ...). Append-only — see AuditLog in
 * prisma/schema.prisma. Never throws: a logging failure must not roll back
 * or block the action it's describing, so errors are swallowed and only
 * surfaced to the server console.
 */
export async function logAudit(params: {
  actorId: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        metadata: params.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error('logAudit failed', params.action, error);
  }
}
