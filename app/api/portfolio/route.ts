import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const portfolio = await prisma.project.findMany({
      where: { featured: true, status: 'COMPLETED' },
      include: { technologies: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(portfolio);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}
