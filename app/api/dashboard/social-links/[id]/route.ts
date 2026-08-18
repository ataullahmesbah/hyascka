// FILE: app/api/dashboard/social-links/[id]/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

const socialLinkSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url('Enter a valid URL'),
  icon: z.string().max(50).optional(),
  label: z.string().max(100).optional(),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, authorized } = await requirePermission('settings.manage');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const parsed = socialLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.socialLink.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Social link not found' }, { status: 404 });
    }

    const updated = await prisma.socialLink.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update social link' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, authorized } = await requirePermission('settings.manage');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const existing = await prisma.socialLink.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Social link not found' }, { status: 404 });
    }

    await prisma.socialLink.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Social link deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete social link' }, { status: 500 });
  }
}
