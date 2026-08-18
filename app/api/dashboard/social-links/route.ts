// FILE: app/api/dashboard/social-links/route.ts
// PURPOSE: Manage the site's social media links (PRD section 19).
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

export async function GET() {
  try {
    const { user, authorized } = await requirePermission('settings.manage');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const links = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(links);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, authorized } = await requirePermission('settings.manage');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const parsed = socialLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const link = await prisma.socialLink.create({ data: parsed.data });
    return NextResponse.json(link, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create social link' }, { status: 500 });
  }
}
