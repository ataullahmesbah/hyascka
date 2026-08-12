// FILE: components/dashboard/client-overview.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, ClipboardList, Clock, ReceiptText, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface ClientStats {
    activeServices: number;
    totalOrders: number;
    pendingOrders: number;
    unpaidInvoices: number;
    completedServices: number;
}

export function ClientOverview({ name }: { name: string }) {
    const { data, loading, error, refetch } = useDashboardData<ClientStats>('/api/client/stats');

    if (loading) return <DashboardSkeleton />;
    if (error || !data) return <ErrorState message="Failed to load dashboard data" onRetry={refetch} />;

    const hasAnyActivity = data.totalOrders > 0;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={`Welcome back, ${name}`} description="Here's what's happening with your services." />

            {!hasAnyActivity ? (
                <EmptyState
                    icon={ShoppingBag}
                    title="You haven't purchased any services yet"
                    description="Browse what HYASCKA offers and get started on your first project."
                    action={
                        <Button asChild>
                            <Link href="/services">Explore Services</Link>
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard title="Active Services" value={data.activeServices} icon={ShoppingBag} accent="success" delay={0} />
                    <StatCard title="Total Orders" value={data.totalOrders} icon={ClipboardList} accent="primary" delay={0.05} />
                    <StatCard title="Pending Orders" value={data.pendingOrders} icon={Clock} accent="warning" delay={0.1} />
                    <StatCard title="Unpaid Invoices" value={data.unpaidInvoices} icon={ReceiptText} accent="destructive" delay={0.15} />
                    <StatCard title="Completed Services" value={data.completedServices} icon={CheckCircle2} accent="accent" delay={0.2} />
                </div>
            )}
        </div>
    );
}