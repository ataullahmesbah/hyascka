// FILE: app/api/dashboard/media/[id]/route.ts
// PURPOSE: Update alt text/title/caption (PATCH) or permanently remove an
// asset from both Cloudinary and the library (DELETE).
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { deleteImage } from '@/lib/cloudinary';

const updateSchema = z.object({
  title: z.string().max(200).optional(),
  altText: z.string().max(300).optional(),
  caption: z.string().max(500).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, authorized } = await requirePermission('media.manage');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.media.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const updated = await prisma.media.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, authorized } = await requirePermission('media.manage');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const existing = await prisma.media.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Best-effort Cloudinary cleanup — if it's already gone there (deleted
    // out-of-band) or the API call fails, still remove the library row so
    // the UI doesn't get stuck on an asset the user asked to delete.
    try {
      await deleteImage(existing.publicId);
    } catch (cloudinaryError) {
      console.error('[media] Cloudinary destroy failed:', cloudinaryError);
    }

    await prisma.media.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Media deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
