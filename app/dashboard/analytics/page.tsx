'use client';

import * as React from 'react';
import { Users, Eye, MousePointerClick, Clock, Globe, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/stat-card';
import { AreaChartCard, BarChartCard, LineChartCard, DonutChartCard } from '@/components/dashboard/charts';
import { PageHeader } from '@/components/dashboard/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const visitorData = [
  { label: 'Jan', value: 12000 }, { label: 'Feb', value: 15000 },
  { label: 'Mar', value: 18000 }, { label: 'Apr', value: 16500 },
  { label: 'May', value: 21000 }, { label: 'Jun', value: 24500 },
  { label: 'Jul', value: 28000 }, { label: 'Aug', value: 31000 },
  { label: 'Sep', value: 29000 }, { label: 'Oct', value: 34000 },
  { label: 'Nov', value: 38000 }, { label: 'Dec', value: 42000 },
];

const conversionData = [
  { label: 'Jan', value: 2.1 }, { label: 'Feb', value: 2.5 },
  { label: 'Mar', value: 3.1 }, { label: 'Apr', value: 2.8 },
  { label: 'May', value: 3.5 }, { label: 'Jun', value: 3.8 },
  { label: 'Jul', value: 4.2 }, { label: 'Aug', value: 4.5 },
  { label: 'Sep', value: 4.1 }, { label: 'Oct', value: 4.8 },
  { label: 'Nov', value: 5.2 }, { label: 'Dec', value: 5.6 },
];

const pageViewsData = [
  { label: 'Home', value: 12500 },
  { label: 'Services', value: 8200 },
  { label: 'Portfolio', value: 6800 },
  { label: 'Blog', value: 5400 },
  { label: 'About', value: 3200 },
  { label: 'Contact', value: 2100 },
];

const countryData = [
  { label: 'United States', value: 35 },
  { label: 'United Kingdom', value: 18 },
  { label: 'Germany', value: 12 },
  { label: 'India', value: 10 },
  { label: 'Canada', value: 8 },
  { label: 'Other', value: 17 },
];

const deviceData = [
  { label: 'Desktop', value: 58 },
  { label: 'Mobile', value: 32 },
  { label: 'Tablet', value: 10 },
];

const topPages = [
  { page: '/', views: 12500, bounce: '32%', avgTime: '2m 15s' },
  { page: '/services', views: 8200, bounce: '38%', avgTime: '1m 52s' },
  { page: '/portfolio', views: 6800, bounce: '41%', avgTime: '3m 02s' },
  { page: '/blog', views: 5400, bounce: '35%', avgTime: '4m 18s' },
  { page: '/about', views: 3200, bounce: '45%', avgTime: '1m 30s' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Track visitors, traffic sources, and conversion performance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Visitors" value="42.3K" icon={Users} change={18.2} changeLabel="vs last month" accent="primary" />
        <StatCard title="Page Views" value="128.5K" icon={Eye} change={12.4} changeLabel="vs last month" accent="accent" />
        <StatCard title="Conversion Rate" value="5.6%" icon={MousePointerClick} change={8.1} changeLabel="vs last month" accent="success" />
        <StatCard title="Avg. Session" value="3m 22s" icon={Clock} change={-2.3} changeLabel="vs last month" accent="warning" delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AreaChartCard
          title="Visitor Trends"
          description="Monthly unique visitors"
          data={visitorData}
          color="hsl(var(--chart-1))"
        />
        <LineChartCard
          title="Conversion Rate"
          description="Monthly conversion percentage"
          data={conversionData}
          color="hsl(var(--chart-3))"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BarChartCard
          title="Top Pages"
          description="Most viewed pages"
          data={pageViewsData}
          color="hsl(var(--chart-2))"
          className="lg:col-span-2"
        />
        <DonutChartCard
          title="Countries"
          description="Visitor geography"
          data={countryData}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-5">
            <CardTitle className="text-base font-semibold">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-4">
              {[
                { label: 'Desktop', value: 58, icon: Monitor },
                { label: 'Mobile', value: 32, icon: Smartphone },
                { label: 'Tablet', value: 10, icon: Tablet },
              ].map((device) => (
                <div key={device.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <device.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{device.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{device.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${device.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-5">
            <CardTitle className="text-base font-semibold">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-4">
              {[
                { label: 'Organic Search', value: 45, color: 'bg-primary' },
                { label: 'Direct', value: 25, color: 'bg-accent' },
                { label: 'Social Media', value: 18, color: 'bg-success' },
                { label: 'Referral', value: 12, color: 'bg-amber-500' },
              ].map((source) => (
                <div key={source.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium">{source.label}</span>
                    <span className="text-sm text-muted-foreground">{source.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={source.color + ' h-full rounded-full transition-all duration-500'}
                      style={{ width: `${source.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-5">
          <CardTitle className="text-base font-semibold">Top Pages Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Bounce Rate</TableHead>
                <TableHead className="text-right">Avg. Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPages.map((row) => (
                <TableRow key={row.page}>
                  <TableCell className="font-mono text-xs">{row.page}</TableCell>
                  <TableCell className="text-right font-medium">{row.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.bounce}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.avgTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
