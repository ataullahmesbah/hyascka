import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const existing = await prisma.siteSettings.findFirst();

    if (existing) {
      const updated = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: body,
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.siteSettings.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
