import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity-log';
import type { RoleName } from '@prisma/client';
import { z } from 'zod';

const MANAGER_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN'];

const testimonialSchema = z.object({
  quote: z.string().min(1).max(1000),
  name: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
  company: z.string().optional(),
  initials: z.string().min(1).max(5),
  rating: z.number().int().min(1).max(5).default(5),
  active: z.boolean().default(true),
});

const moderateSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!MANAGER_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.testimonial.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const updated = await prisma.testimonial.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

/** Approve or reject a client-submitted testimonial. Approving also sets
 * `active: true` (publishes it); rejecting sets `active: false`. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!MANAGER_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = moderateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await prisma.testimonial.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const updated = await prisma.testimonial.update({
      where: { id: params.id },
      data: { status: parsed.data.status, active: parsed.data.status === 'APPROVED' },
    });

    await logActivity({
      actorId: session.user.id,
      actorRole: session.user.role,
      action: parsed.data.status === 'APPROVED' ? 'testimonial.approved' : 'testimonial.rejected',
      targetType: 'Testimonial',
      targetId: updated.id,
      description: `Testimonial from "${updated.name}" ${parsed.data.status.toLowerCase()}`,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update testimonial status' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!MANAGER_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.testimonial.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
