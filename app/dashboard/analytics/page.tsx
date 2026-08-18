

'use client';
// ==========================================================

// LOCATION: app/dashboard/analytics/page.tsx
// ==========================================================

import * as React from 'react';
import { Users, DollarSign, TrendingUp, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { AreaChartCard, BarChartCard, DonutChartCard } from '@/components/dashboard/charts';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface AnalyticsResponse {
  totals: {
    totalLeads: number;
    totalOrders: number;
    totalRevenue: number;
    conversionRate: number;
    leadsChange: number;
    revenueChange: number;
  };
  leadsTrend: { label: string; value: number }[];
  revenueTrend: { label: string; value: number }[];
  topServices: { label: string; orders: number; revenue: number }[];
  leadSources: { label: string; value: number }[];
}

const SOURCE_LABELS: Record<string, string> = {
  CONTACT_FORM: 'Contact form',
  CHECKOUT: 'Direct checkout',
};

export default function AnalyticsPage() {
  const { data, loading, error, refetch } = useDashboardData<AnalyticsResponse>('/api/dashboard/analytics');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Leads, orders, and revenue — the real numbers behind the pipeline (last 12 months)."
      />

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !data || data.totals.totalLeads === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No activity yet"
          description="Once leads come in through the contact form or checkout, trends and conversion data will show up here."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Leads (12mo)" value={data.totals.totalLeads} icon={Users} change={data.totals.leadsChange} changeLabel="vs last month" accent="primary" />
            <StatCard title="Revenue (12mo)" value={`$${data.totals.totalRevenue.toLocaleString()}`} icon={DollarSign} change={data.totals.revenueChange} changeLabel="vs last month" accent="accent" />
            <StatCard title="Conversion Rate" value={`${data.totals.conversionRate}%`} icon={Percent} changeLabel="leads → paid orders" accent="success" />
            <StatCard title="Total Orders (12mo)" value={data.totals.totalOrders} icon={TrendingUp} accent="warning" delay={0.15} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AreaChartCard
              title="Leads Trend"
              description="New leads per month"
              data={data.leadsTrend}
              color="hsl(var(--chart-1))"
            />
            <AreaChartCard
              title="Revenue Trend"
              description="Paid order revenue per month"
              data={data.revenueTrend}
              color="hsl(var(--chart-3))"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold">Top Services</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                {data.topServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No paid orders yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Orders</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.topServices.map((s) => (
                        <TableRow key={s.label}>
                          <TableCell className="font-medium">{s.label}</TableCell>
                          <TableCell className="text-right">{s.orders}</TableCell>
                          <TableCell className="text-right">${s.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <DonutChartCard
              title="Lead Sources"
              description="Where leads come from"
              data={data.leadSources.map((s) => ({ label: SOURCE_LABELS[s.label] ?? s.label, value: s.value }))}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-1">
            <BarChartCard
              title="Leads by Month"
              description="Same data as the trend above, as monthly bars"
              data={data.leadsTrend}
              color="hsl(var(--chart-2))"
            />
          </div>
        </>
      )}
    </div>
  );
}
