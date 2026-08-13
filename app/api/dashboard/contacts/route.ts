// FILE: app/api/dashboard/contacts/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { can, type Role } from '@/lib/permissions';
import { notify } from '@/lib/notifications';
import type { ContactStatus, ContactPriority } from '@prisma/client';

export async function GET() {
  try {
    const { user, authorized } = await requirePermission('leads.read');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const contacts = await prisma.contact.findMany({
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user, authorized } = await requirePermission('leads.update');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { id, status, priority, assignedToId } = body as {
      id: string;
      status?: ContactStatus;
      priority?: ContactPriority;
      assignedToId?: string | null;
    };

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Assignment is a stricter capability than a plain status/priority
    // edit — a MODERATOR can update a lead they're working, but only
    // SUPER_ADMIN/ADMIN can reassign leads between staff.
    if (assignedToId !== undefined && !can(user.role.name as Role, 'leads.assign')) {
      return NextResponse.json({ error: 'Only Super Admin or Admin can assign leads' }, { status: 403 });
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignedToId !== undefined && { assignedToId }),
      },
    });

    if (assignedToId) {
      await notify(prisma, {
        userId: assignedToId,
        type: 'LEAD_ASSIGNED',
        title: `Lead assigned: ${updated.name}`,
        link: `/dashboard/leads/${updated.id}`,
      });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user, authorized } = await requirePermission('leads.assign');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // Deletion uses the stricter 'leads.assign' capability (SUPER_ADMIN/ADMIN
    // only) rather than 'leads.update' — a MODERATOR can manage a lead but
    // shouldn't be able to destroy the record.
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}