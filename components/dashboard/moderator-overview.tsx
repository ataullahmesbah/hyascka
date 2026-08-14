// FILE: components/dashboard/moderator-overview.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Inbox, ClipboardList, FileSignature, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface ModeratorStats {
    assignedLeads: number;
    openLeads: number;
    offersNeedingAttention: number;
    unreadMessages: number;
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Assigned to Me" value={data.assignedLeads} icon={Inbox} accent="primary" delay={0} />
                <StatCard title="Open Leads" value={data.openLeads} icon={ClipboardList} accent="warning" delay={0.05} />
                <StatCard title="Offers Needing Attention" value={data.offersNeedingAttention} icon={FileSignature} accent="accent" delay={0.1} />
                <StatCard title="Unread Messages" value={data.unreadMessages} icon={MessageSquare} accent="success" delay={0.15} />
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
                                <Link
                                    key={lead.id}
                                    href={`/dashboard/leads/${lead.id}`}
                                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-primary"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{lead.name}</p>
                                        <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
                                    </div>
                                    <Badge variant="outline" className="shrink-0 capitalize">
                                        {lead.status.toLowerCase().replace('_', ' ')}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}