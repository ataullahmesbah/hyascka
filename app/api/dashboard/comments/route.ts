// FILE: app/api/dashboard/comments/route.ts
// PURPOSE: List all blog comments for moderation (SUPER_ADMIN/ADMIN/MODERATOR).
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

export async function GET(req: Request) {
  try {
    const { user, authorized } = await requirePermission('comments.moderate');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const comments = await prisma.comment.findMany({
      where: { ...(status && { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' }) },
      include: { blog: { select: { id: true, title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
