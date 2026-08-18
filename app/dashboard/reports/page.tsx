// FILE: app/dashboard/reports/page.tsx
// PURPOSE: Real, database-backed System Reports — replaces the previous
// hardcoded StatCard values and static chart datasets with data fetched
// from /api/dashboard/reports (real Order/Project/Blog/Newsletter/Contact
// queries for the current calendar year).
'use client';

import * as React from 'react';
import { FileBarChart, TrendingUp, Users, Newspaper, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { AreaChartCard, BarChartCard, DonutChartCard } from '@/components/dashboard/charts';
import { PageHeader } from '@/components/dashboard/page-header';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ReportsResponse {
  stats: {
    annualRevenue: number;
    annualRevenueChange: number;
    newClients: number;
    newClientsChange: number;
    publishedBlogCount: number;
    newsletterCount: number;
  };
  revenueData: { label: string; value: number }[];
  projectData: { label: string; value: number }[];
  sourceData: { label: string; value: number }[];
  summary: { metric: string; value: string; change: number | null }[];
}

export default function ReportsPage() {
  const { data, loading, error, refetch } = useDashboardData<ReportsResponse>('/api/dashboard/reports');

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <ErrorState message="Failed to load reports" onRetry={refetch} />;

  const { stats } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Platform performance for the current year, from real order, project, and content data."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Annual Revenue" value={`$${stats.annualRevenue.toLocaleString()}`} icon={TrendingUp} change={stats.annualRevenueChange} changeLabel="vs last year" accent="success" />
        <StatCard title="New Clients" value={stats.newClients} icon={Users} change={stats.newClientsChange} changeLabel="vs last year" accent="primary" />
        <StatCard title="Published Posts" value={stats.publishedBlogCount} icon={BookOpen} accent="accent" />
        <StatCard title="Newsletter Subscribers" value={stats.newsletterCount} icon={Newspaper} accent="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AreaChartCard title="Revenue Trend" description="Monthly revenue, this year" data={data.revenueData} color="hsl(var(--chart-3))" className="lg:col-span-2" />
        <DonutChartCard title="Lead Sources" description="Where leads came from, this year" data={data.sourceData} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartCard title="Projects Per Quarter" description="Projects created this year" data={data.projectData} color="hsl(var(--chart-1))" />
        <Card>
          <CardHeader className="p-5"><CardTitle className="text-base font-semibold">Summary</CardTitle></CardHeader>
          <CardContent className="p-5 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.summary.map((row) => (
                  <TableRow key={row.metric}>
                    <TableCell className="font-medium">{row.metric}</TableCell>
                    <TableCell className="text-right">{row.value}</TableCell>
                    <TableCell className={`text-right ${row.change !== null && row.change < 0 ? 'text-destructive' : 'text-success'}`}>
                      {row.change === null ? '—' : `${row.change >= 0 ? '+' : ''}${row.change}%`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
