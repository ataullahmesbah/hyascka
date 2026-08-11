// FILE: app/api/dashboard/stats/editor/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

/**
 * Only returns data that genuinely exists today (Blog records, scoped to
 * the requesting editor's own posts where relevant). "Pending Reviews" is
 * a real product requirement, but BlogStatus has no IN_REVIEW/APPROVED
 * state yet (see Phase 1 audit) — that metric is intentionally omitted
 * rather than faked, and will be added once the content workflow states
 * ship in a later CMS phase.
 */
export async function GET() {
    try {
        const { user, authorized } = await requirePermission('dashboard.viewEditorOverview');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const [myDrafts, myPublished, sitePublished, recentDrafts] = await Promise.all([
            prisma.blog.count({ where: { authorId: user.id, status: 'DRAFT' } }),
            prisma.blog.count({ where: { authorId: user.id, status: 'PUBLISHED' } }),
            prisma.blog.count({ where: { status: 'PUBLISHED' } }),
            prisma.blog.findMany({
                where: { authorId: user.id, status: 'DRAFT' },
                orderBy: { updatedAt: 'desc' },
                take: 5,
                select: { id: true, title: true, slug: true, updatedAt: true },
            }),
        ]);

        return NextResponse.json({ myDrafts, myPublished, sitePublished, recentDrafts });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch editor stats' }, { status: 500 });
    }
}