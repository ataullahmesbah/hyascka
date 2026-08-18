// FILE: lib/activity-log.ts
// PURPOSE: Operational activity feed (new lead, offer accepted, message
// sent, ...) — distinct from lib/audit-log.ts, which is the SUPER_ADMIN-only
// security audit trail. See ActivityLog in prisma/schema.prisma.
import { prisma } from '@/lib/prisma';

/**
 * Records a normal operational event for the /dashboard/activity timeline.
 * Never throws: a logging failure must not roll back or block the action
 * it's describing, so errors are swallowed and only surfaced to the server
 * console. Do not pass secrets/passwords/tokens in `description`.
 */
export async function logActivity(params: {
  actorId: string | null;
  actorRole?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  description: string;
}): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        actorId: params.actorId,
        actorRole: params.actorRole ?? undefined,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        description: params.description,
      },
    });
  } catch (error) {
    console.error('logActivity failed', params.action, error);
  }
}
