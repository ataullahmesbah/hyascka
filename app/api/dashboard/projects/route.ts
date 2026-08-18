import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/validation';
import { slugify } from '@/lib/dashboard-auth';
import type { RoleName } from '@prisma/client';

const ALLOWED_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'];
const VIEW_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'CLIENT'];

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!VIEW_ROLES.includes(session.user.role as RoleName)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const projects = await prisma.project.findMany({
      where: {
        ...(status && { status: status as 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED' }),
        ...(featured === 'true' && { featured: true }),
      },
      include: { technologies: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const slug = parsed.data.slug || slugify(parsed.data.title);

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Project with this slug already exists' }, { status: 409 });
    }

    const technologyIds = (body.technologyIds as string[]) ?? [];
    const gallery = (body.gallery as string[]) ?? [];
    const metrics = body.metrics as string | undefined;

    const project = await prisma.project.create({
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
        published: parsed.data.published,
        order: parsed.data.order,
        projectUrl: parsed.data.projectUrl || null,
        clientName: parsed.data.clientName,
        seoTitle: parsed.data.seoTitle,
        seoDescription: parsed.data.seoDescription,
        gallery,
        metrics,
        ...(technologyIds.length > 0 && {
          technologies: { connect: technologyIds.map((id: string) => ({ id })) },
        }),
      },
      include: { technologies: true },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
