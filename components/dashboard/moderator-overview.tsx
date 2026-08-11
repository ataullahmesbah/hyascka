// FILE: components/dashboard/moderator-overview.tsx
'use client';

import * as React from 'react';
import { Inbox, MailWarning, MessagesSquare } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface ModeratorStats {
    openLeads: number;
    newLeads: number;
    recentLeads: Array<{
        id: string;
        name: string;
        email: string;
        service: string | null;
        status: string;
        createdAt: string;
    }>;
}

export function ModeratorOverview({ name }: { name: string }) {
    const { data, loading, error, refetch } = useDashboardData<ModeratorStats>('/api/dashboard/stats/moderator');

    if (loading) return <DashboardSkeleton />;
    if (error || !data) return <ErrorState message="Failed to load dashboard data" onRetry={refetch} />;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={`Welcome back, ${name}`} description="Here's what needs your attention." />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard title="Open Leads" value={data.openLeads} icon={Inbox} accent="primary" delay={0} />
                <StatCard title="New Leads" value={data.newLeads} icon={MailWarning} accent="warning" delay={0.05} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
                </CardHeader>
                <CardContent>
                    {data.recentLeads.length === 0 ? (
                        <EmptyState icon={Inbox} title="No open leads" description="New contact requests will show up here." />
                    ) : (
                        <div className="flex flex-col divide-y divide-border">
                            {data.recentLeads.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between gap-4 py-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{lead.name}</p>
                                        <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
                                    </div>
                                    <Badge variant="outline" className="shrink-0 capitalize">
                                        {lead.status.toLowerCase().replace('_', ' ')}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Messages, Support Tickets, and Meetings are real requirements for
          this dashboard but those models don't exist yet — an honest
          placeholder instead of fake counts. */}
            <EmptyState
                icon={MessagesSquare}
                title="Messages & support tools are on the way"
                description="Client messaging, support tickets, and meeting scheduling will appear here once those modules ship in an upcoming phase."
            />
        </div>
    );
}