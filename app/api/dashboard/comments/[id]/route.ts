// FILE: app/api/dashboard/comments/[id]/route.ts
// PURPOSE: Approve/reject (PATCH) or permanently remove (DELETE) a single
// blog comment. Same role gate as listing (SUPER_ADMIN/ADMIN/MODERATOR).
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { logActivity } from '@/lib/activity-log';

const statusSchema = z.object({ status: z.enum(['PENDING', 'APPROVED', 'REJECTED']) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, authorized } = await requirePermission('comments.moderate');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await prisma.comment.findUnique({ where: { id: params.id }, include: { blog: { select: { title: true } } } });
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const updated = await prisma.comment.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });

    await logActivity({
      actorId: user.id,
      actorRole: user.role.name,
      action: parsed.data.status === 'APPROVED' ? 'comment.approved' : 'comment.rejected',
      targetType: 'Comment',
      targetId: updated.id,
      description: `Comment on "${existing.blog.title}" ${parsed.data.status.toLowerCase()}`,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, authorized } = await requirePermission('comments.moderate');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const existing = await prisma.comment.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    await prisma.comment.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Comment deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
