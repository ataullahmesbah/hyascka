// FILE: app/api/dashboard/reports/route.ts
// PURPOSE: Real, database-backed System Reports data — replaces the
// previous 100% hardcoded StatCard/chart values on /dashboard/reports.
// All figures are derived from Order/Payment/Project/Blog/Newsletter/
// Contact records for the current calendar year (or all-time where a year
// boundary doesn't make sense, e.g. total newsletter subscribers).
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export async function GET() {
  try {
    const { user, authorized } = await requirePermission('dashboard.viewAgencyOverview');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);

    const [
      ordersThisYear,
      ordersLastYear,
      projectsThisYear,
      publishedBlogCount,
      newsletterCount,
      leadSourceGroups,
      newClientsThisYear,
      newClientsLastYear,
    ] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: yearStart }, paymentStatus: 'PAID' },
        select: { createdAt: true, amount: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: lastYearStart, lt: yearStart }, paymentStatus: 'PAID' },
        select: { amount: true },
      }),
      prisma.project.findMany({
        where: { createdAt: { gte: yearStart } },
        select: { createdAt: true, status: true },
      }),
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      prisma.newsletter.count({ where: { active: true } }),
      prisma.contact.groupBy({
        by: ['source'],
        where: { createdAt: { gte: yearStart } },
        _count: { _all: true },
      }),
      prisma.user.count({
        where: { createdAt: { gte: yearStart }, role: { name: 'CLIENT' } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: lastYearStart, lt: yearStart }, role: { name: 'CLIENT' } },
      }),
    ]);

    const monthLabels = Array.from({ length: 12 }, (_, i) =>
      new Date(now.getFullYear(), i, 1).toLocaleString('en-US', { month: 'short' })
    );
    const revenueByMonth = new Array(12).fill(0);
    for (const order of ordersThisYear) {
      revenueByMonth[order.createdAt.getMonth()] += Number(order.amount);
    }
    const revenueData = monthLabels.map((label, i) => ({ label, value: Math.round(revenueByMonth[i]) }));

    const projectsByQuarter = [0, 0, 0, 0];
    for (const project of projectsThisYear) {
      projectsByQuarter[Math.floor(project.createdAt.getMonth() / 3)] += 1;
    }
    const projectData = projectsByQuarter.map((value, i) => ({ label: `Q${i + 1}`, value }));

    const sourceData = leadSourceGroups
      .map((g) => ({ label: g.source, value: g._count._all }))
      .sort((a, b) => b.value - a.value);

    const totalRevenue = ordersThisYear.reduce((sum, o) => sum + Number(o.amount), 0);
    const totalRevenueLastYear = ordersLastYear.reduce((sum, o) => sum + Number(o.amount), 0);
    const projectsCompleted = projectsThisYear.filter((p) => p.status === 'COMPLETED').length;

    return NextResponse.json({
      stats: {
        annualRevenue: Math.round(totalRevenue),
        annualRevenueChange: pctChange(totalRevenue, totalRevenueLastYear),
        newClients: newClientsThisYear,
        newClientsChange: pctChange(newClientsThisYear, newClientsLastYear),
        publishedBlogCount,
        newsletterCount,
      },
      revenueData,
      projectData,
      sourceData,
      summary: [
        { metric: 'Total Revenue', value: `$${Math.round(totalRevenue).toLocaleString()}`, change: pctChange(totalRevenue, totalRevenueLastYear) },
        { metric: 'Projects Completed', value: String(projectsCompleted), change: null },
        { metric: 'New Clients', value: String(newClientsThisYear), change: pctChange(newClientsThisYear, newClientsLastYear) },
        { metric: 'Published Blog Posts', value: String(publishedBlogCount), change: null },
        { metric: 'Newsletter Subscribers', value: String(newsletterCount), change: null },
      ],
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
