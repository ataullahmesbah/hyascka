// ==========================================================
// NEW FILE
// LOCATION: app/api/dashboard/analytics/route.ts
// ==========================================================
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';

const MONTHS = 12;

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function lastNMonthLabels(n: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: monthKey(d), label: d.toLocaleString('en-US', { month: 'short' }) });
  }
  return out;
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/**
 * Real business analytics — not web traffic. This app doesn't run a
 * visitor-tracking pipeline (no pageview capture, no GeoIP), so rather
 * than fabricate visitors/bounce-rate/country numbers, this reports what
 * the database actually knows: leads, orders, revenue, and conversion,
 * derived from Contact/Order/Payment. See dashboard/analytics/page.tsx.
 */
export async function GET() {
  try {
    const { user, authorized } = await requirePermission('dashboard.viewAgencyOverview');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const since = new Date();
    since.setMonth(since.getMonth() - (MONTHS - 1));
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const [leads, orders, topServiceGroups, sourceGroups] = await Promise.all([
      prisma.contact.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, amount: true, status: true, paymentStatus: true, serviceId: true },
      }),
      prisma.order.groupBy({
        by: ['serviceId'],
        where: { serviceId: { not: null }, paymentStatus: 'PAID' },
        _count: { _all: true },
        _sum: { amount: true },
        orderBy: { _count: { serviceId: 'desc' } },
        take: 5,
      }),
      prisma.contact.groupBy({
        by: ['source'],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
      }),
    ]);

    const months = lastNMonthLabels(MONTHS);
    const leadsByMonth = new Map<string, number>(months.map((m) => [m.key, 0]));
    for (const lead of leads) {
      const key = monthKey(lead.createdAt);
      if (leadsByMonth.has(key)) leadsByMonth.set(key, (leadsByMonth.get(key) ?? 0) + 1);
    }

    const ordersByMonth = new Map<string, number>(months.map((m) => [m.key, 0]));
    const revenueByMonth = new Map<string, number>(months.map((m) => [m.key, 0]));
    for (const order of orders) {
      const key = monthKey(order.createdAt);
      if (!ordersByMonth.has(key)) continue;
      ordersByMonth.set(key, (ordersByMonth.get(key) ?? 0) + 1);
      if (order.paymentStatus === 'PAID') {
        revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + Number(order.amount));
      }
    }

    const leadsTrend = months.map((m) => ({ label: m.label, value: leadsByMonth.get(m.key) ?? 0 }));
    const revenueTrend = months.map((m) => ({ label: m.label, value: Math.round(revenueByMonth.get(m.key) ?? 0) }));

    const totalLeads = leads.length;
    const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.amount), 0);
    const conversionRate = totalLeads === 0 ? 0 : Math.round((paidOrders.length / totalLeads) * 1000) / 10;

    const thisMonthKey = months[months.length - 1].key;
    const lastMonthKey = months[months.length - 2]?.key;
    const leadsChange = lastMonthKey
      ? pctChange(leadsByMonth.get(thisMonthKey) ?? 0, leadsByMonth.get(lastMonthKey) ?? 0)
      : 0;
    const revenueChange = lastMonthKey
      ? pctChange(revenueByMonth.get(thisMonthKey) ?? 0, revenueByMonth.get(lastMonthKey) ?? 0)
      : 0;

    const serviceIds = topServiceGroups.map((g) => g.serviceId).filter((id): id is string => !!id);
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, title: true },
    });
    const serviceTitle = new Map(services.map((s) => [s.id, s.title]));

    const topServices = topServiceGroups.map((g) => ({
      label: g.serviceId ? (serviceTitle.get(g.serviceId) ?? 'Unknown service') : 'Unknown service',
      orders: g._count._all,
      revenue: Math.round(Number(g._sum.amount ?? 0)),
    }));

    const leadSources = sourceGroups
      .map((g) => ({ label: g.source, value: g._count._all }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      totals: {
        totalLeads,
        totalOrders: orders.length,
        totalRevenue: Math.round(totalRevenue),
        conversionRate,
        leadsChange,
        revenueChange,
      },
      leadsTrend,
      revenueTrend,
      topServices,
      leadSources,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
