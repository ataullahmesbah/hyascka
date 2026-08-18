import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { RoleName } from '@prisma/client';
import { z } from 'zod';

const MANAGER_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'];

const faqSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(2000),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
  // null/omitted = global FAQ; set = scoped to one service's detail page.
  serviceId: z.string().nullable().optional(),
});

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      include: { service: { select: { id: true, title: true } } },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
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
    const parsed = faqSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const faq = await prisma.fAQ.create({ data: parsed.data });
    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
