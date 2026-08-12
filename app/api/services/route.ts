import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}