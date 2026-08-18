// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/api/dashboard/settings/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit-log';
import type { RoleName } from '@prisma/client';

const MANAGER_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN'];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!MANAGER_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!MANAGER_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const existing = await prisma.siteSettings.findFirst();

    if (existing) {
      const updated = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: body,
      });
      await logAudit({
        actorId: session.user.id,
        action: 'settings.updated',
        targetType: 'SiteSettings',
        targetId: updated.id,
        metadata: { fields: Object.keys(body) },
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.siteSettings.create({ data: body });
    await logAudit({
      actorId: session.user.id,
      action: 'settings.created',
      targetType: 'SiteSettings',
      targetId: created.id,
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
