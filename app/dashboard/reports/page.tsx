'use client';

import * as React from 'react';
import { FileBarChart, Download, Users, Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/stat-card';
import { AreaChartCard, BarChartCard, DonutChartCard } from '@/components/dashboard/charts';
import { PageHeader } from '@/components/dashboard/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const revenueData = [
  { label: 'Jan', value: 32000 }, { label: 'Feb', value: 38000 },
  { label: 'Mar', value: 45000 }, { label: 'Apr', value: 42000 },
  { label: 'May', value: 51000 }, { label: 'Jun', value: 58000 },
  { label: 'Jul', value: 62000 }, { label: 'Aug', value: 55000 },
  { label: 'Sep', value: 67000 }, { label: 'Oct', value: 72000 },
  { label: 'Nov', value: 68000 }, { label: 'Dec', value: 78000 },
];

const projectData = [
  { label: 'Q1', value: 4 }, { label: 'Q2', value: 7 },
  { label: 'Q3', value: 9 }, { label: 'Q4', value: 11 },
];

const sourceData = [
  { label: 'Direct Clients', value: 40 },
  { label: 'Referrals', value: 25 },
  { label: 'Website', value: 20 },
  { label: 'Partnerships', value: 15 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and view comprehensive platform reports."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button size="sm" className="gap-2">
              <FileBarChart className="h-3.5 w-3.5" />
              Generate Report
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Annual Revenue" value="$678K" icon={TrendingUp} change={18.5} changeLabel="vs last year" accent="success" />
        <StatCard title="New Clients" value="32" icon={Users} change={12.3} changeLabel="vs last year" accent="primary" />
        <StatCard title="Page Views" value="1.2M" icon={Eye} change={24.1} changeLabel="vs last year" accent="accent" />
        <StatCard title="Conversions" value="8.4%" icon={MousePointerClick} change={3.2} changeLabel="vs last year" accent="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AreaChartCard title="Revenue Trend" description="Monthly revenue" data={revenueData} color="hsl(var(--chart-3))" className="lg:col-span-2" />
        <DonutChartCard title="Client Sources" description="Where clients come from" data={sourceData} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartCard title="Projects Per Quarter" description="Completed projects" data={projectData} color="hsl(var(--chart-1))" />
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
                {[
                  { metric: 'Total Revenue', value: '$678,000', change: '+18.5%' },
                  { metric: 'Projects Completed', value: '31', change: '+14.8%' },
                  { metric: 'New Clients', value: '32', change: '+12.3%' },
                  { metric: 'Blog Posts', value: '86', change: '+15.3%' },
                  { metric: 'Newsletter Subs', value: '1,240', change: '+22.1%' },
                ].map((row) => (
                  <TableRow key={row.metric}>
                    <TableCell className="font-medium">{row.metric}</TableCell>
                    <TableCell className="text-right">{row.value}</TableCell>
                    <TableCell className="text-right text-success">{row.change}</TableCell>
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
