// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/api/dashboard/users/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requirePermission } from '@/lib/dashboard-auth';
import { canActOnTarget, type Role } from '@/lib/permissions';
import { logAudit } from '@/lib/audit-log';

// NOTE: Active/Inactive suspension is a real requirement from the RBAC
// correction phase, but User has no `status` column in the schema yet
// (flagged in the Phase 1 audit). Accepting a `status` field here would
// silently do nothing, which is worse than not accepting it — omitted
// until that schema change ships.
const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  roleId: z.string().optional(),
});

export async function GET() {
  try {
    const { user, authorized } = await requirePermission('users.read');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        role: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const roles = await prisma.role.findMany({
      select: { id: true, name: true },
    });

    return NextResponse.json({ users, roles });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user, authorized } = await requirePermission('users.update');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { id, ...updateData } = body;
    const parsed = userUpdateSchema.safeParse(updateData);

    if (!parsed.success || !id) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const actorRole = user.role.name as Role;
    const targetRole = targetUser.role.name as Role;

    if (!canActOnTarget(actorRole, targetRole)) {
      return NextResponse.json({ error: 'Cannot modify this account' }, { status: 403 });
    }

    // Role reassignment is a stricter, separate capability — ADMIN can
    // edit name/status but must never be able to change a user's role.
    if (parsed.data.roleId) {
      const { authorized: canChangeRole } = await requirePermission('users.updateRole');
      if (!canChangeRole) {
        return NextResponse.json({ error: 'Only super admins can change roles' }, { status: 403 });
      }

      const newRole = await prisma.role.findUnique({ where: { id: parsed.data.roleId } });
      if (!newRole) {
        return NextResponse.json({ error: 'Role not found' }, { status: 404 });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.roleId && { roleId: parsed.data.roleId }),
      },
      select: { id: true, name: true, email: true, role: { select: { name: true } } },
    });

    await logAudit({
      actorId: user.id,
      action: parsed.data.roleId ? 'user.role_changed' : 'user.updated',
      targetType: 'User',
      targetId: id,
      metadata: { name: parsed.data.name, roleId: parsed.data.roleId },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Deletion is SUPER_ADMIN-only. The previous version of this route
    // allowed ADMIN to delete users, which contradicted the intended
    // permission model (ADMIN can suspend/edit, never delete).
    const { user, authorized } = await requirePermission('users.delete');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (id === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    await logAudit({
      actorId: user.id,
      action: 'user.deleted',
      targetType: 'User',
      targetId: id,
      metadata: { email: targetUser.email },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}