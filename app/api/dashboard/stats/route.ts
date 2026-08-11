// FILE: app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { can, type Role } from '@/lib/permissions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // This endpoint returns agency-wide counts (all users, all contacts,
    // all blogs) — previously any authenticated user could read it,
    // including CLIENT/USER. Restrict to internal roles.
    if (!can(session.user.role as Role, 'dashboard.viewAgencyOverview')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [userCount, projectCount, blogCount, messageCount, activeSubscribers, publishedBlogs, recentUsers, recentBlogs, recentContacts] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.blog.count(),
      prisma.contact.count(),
      prisma.newsletter.count({ where: { active: true } }),
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, image: true, createdAt: true, role: { select: { name: true } } },
      }),
      prisma.blog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } }, category: true },
      }),
      prisma.contact.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalDrafts = blogCount - publishedBlogs;

    return NextResponse.json({
      stats: {
        users: userCount,
        projects: projectCount,
        blogs: blogCount,
        messages: messageCount,
        subscribers: activeSubscribers,
        publishedBlogs,
        draftBlogs: totalDrafts,
      },
      recentUsers,
      recentBlogs,
      recentContacts,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}