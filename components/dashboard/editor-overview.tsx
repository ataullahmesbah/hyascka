// FILE: components/dashboard/editor-overview.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { FileEdit, CheckCircle2, Globe } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface EditorStats {
    myDrafts: number;
    myPublished: number;
    sitePublished: number;
    recentDrafts: Array<{ id: string; title: string; slug: string; updatedAt: string }>;
}

export function EditorOverview({ name }: { name: string }) {
    const { data, loading, error, refetch } = useDashboardData<EditorStats>('/api/dashboard/stats/editor');

    if (loading) return <DashboardSkeleton />;
    if (error || !data) return <ErrorState message="Failed to load dashboard data" onRetry={refetch} />;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={`Welcome back, ${name}`} description="Here's your content at a glance." />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard title="My Drafts" value={data.myDrafts} icon={FileEdit} accent="warning" delay={0} />
                <StatCard title="My Published Posts" value={data.myPublished} icon={CheckCircle2} accent="success" delay={0.05} />
                <StatCard title="Site-wide Published" value={data.sitePublished} icon={Globe} accent="primary" delay={0.1} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Your Drafts</CardTitle>
                </CardHeader>
                <CardContent>
                    {data.recentDrafts.length === 0 ? (
                        <EmptyState icon={FileEdit} title="No drafts yet" description="Posts you start writing will show up here." />
                    ) : (
                        <div className="flex flex-col divide-y divide-border">
                            {data.recentDrafts.map((draft) => (
                                <Link
                                    key={draft.id}
                                    href="/dashboard/blog"
                                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-primary"
                                >
                                    <p className="truncate text-sm font-medium">{draft.title}</p>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {new Date(draft.updatedAt).toLocaleDateString()}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}