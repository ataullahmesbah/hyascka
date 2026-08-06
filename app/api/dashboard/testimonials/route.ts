import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const testimonial = await prisma.testimonial.create({ data: parsed.data });
    return NextResponse.json(testimonial, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
