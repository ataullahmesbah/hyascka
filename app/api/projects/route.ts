// FILE: app/api/projects/route.ts
// PURPOSE: Public read-only project listing. Creation happens only through
// the authenticated /api/dashboard/projects route — this endpoint used to
// also expose an unauthenticated POST that let anyone create Project rows
// directly; that handler has been removed as a security fix.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');

    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ...(featured === 'true' && { featured: true }),
        ...(category && { category }),
      },
      include: { technologies: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: parsed.data,
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
