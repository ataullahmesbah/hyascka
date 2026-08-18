// FILE: app/api/dashboard/media/route.ts
// PURPOSE: List Media Library entries — search by title/altText/filename,
// filter by folder. Every row here was created automatically by
// app/api/upload/route.ts; there's no separate "create" endpoint since
// creation only ever happens as a side effect of a real Cloudinary upload.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

export async function GET(req: Request) {
  try {
    const { user, authorized } = await requirePermission('media.manage');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder');
    const search = searchParams.get('search');

    const media = await prisma.media.findMany({
      where: {
        ...(folder && folder !== 'All' && { folder }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { altText: { contains: search, mode: 'insensitive' } },
            { publicId: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: { uploadedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(media);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
