import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/validation';
import { slugify } from '@/lib/dashboard-auth';
import type { RoleName } from '@prisma/client';

const ALLOWED_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'];

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const slug = parsed.data.slug || slugify(parsed.data.title);
    const slugConflict = await prisma.project.findFirst({
      where: { slug, NOT: { id: params.id } },
    });
    if (slugConflict) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    const technologyIds = (body.technologyIds as string[]) ?? [];
    const gallery = (body.gallery as string[]) ?? existing.gallery;
    const metrics = body.metrics as string | undefined ?? existing.metrics;

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: parsed.data.title,
        slug,
        category: parsed.data.category,
        overview: parsed.data.overview,
        challenge: parsed.data.challenge,
        solution: parsed.data.solution,
        outcome: parsed.data.outcome,
        image: parsed.data.image,
        techStack: parsed.data.techStack,
        status: parsed.data.status,
        featured: parsed.data.featured,
        gallery,
        metrics,
        ...(technologyIds.length > 0
          ? { technologies: { set: technologyIds.map((id: string) => ({ id })) } }
          : { technologies: { set: [] } }),
      },
      include: { technologies: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ALLOWED_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const existing = await prisma.project.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({ where: { id: params.id } });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
