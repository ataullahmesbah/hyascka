// FILE: app/api/testimonials/route.ts
// PURPOSE: Client-facing testimonial submission — did not exist anywhere
// in the codebase before (only an admin-created path existed at
// /api/dashboard/testimonials). Always creates a PENDING, inactive row;
// never auto-published (PRD: "Do not automatically publish client
// reviews"). Name/initials are derived from the submitter's own account,
// never trusted from the request body.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDashboardUser } from '@/lib/dashboard-auth';
import { testimonialSubmitSchema } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const user = await getDashboardUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = testimonialSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    if (parsed.data.projectId) {
      const project = await prisma.project.findUnique({ where: { id: parsed.data.projectId }, select: { id: true } });
      if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (parsed.data.serviceId) {
      const service = await prisma.service.findUnique({ where: { id: parsed.data.serviceId }, select: { id: true } });
      if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const name = user.name ?? user.email;
    const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    const testimonial = await prisma.testimonial.create({
      data: {
        quote: parsed.data.quote,
        name,
        position: parsed.data.position,
        company: parsed.data.company,
        initials,
        rating: parsed.data.rating,
        image: parsed.data.image,
        permissionToPublish: parsed.data.permissionToPublish,
        userId: user.id,
        projectId: parsed.data.projectId,
        serviceId: parsed.data.serviceId,
        status: 'PENDING',
        active: false,
      },
    });

    return NextResponse.json(
      { message: 'Thanks — your testimonial has been submitted for review.', id: testimonial.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 });
  }
}
