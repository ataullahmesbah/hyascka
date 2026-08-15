// FILE: app/dashboard/my-services/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface ClientServiceRow {
    id: string;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    activatedAt: string | null;
    createdAt: string;
    service: { title: string; slug: string; deliveryTime: string | null };
    order: { orderNumber: string; createdAt: string };
}

interface ServicesResponse {
    services: ClientServiceRow[];
}

const statusVariant = {
    ACTIVE: 'default',
    COMPLETED: 'outline',
    CANCELLED: 'destructive',
} as const;

export default function MyServicesPage() {
    const { data, loading, error, refetch } = useDashboardData<ServicesResponse>('/api/client/services');

    if (loading) return <DashboardSkeleton />;
    if (error || !data) return <ErrorState message="Failed to load your services" onRetry={refetch} />;

    const { services } = data;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="My Services" description={`${services.length} purchased service${services.length === 1 ? '' : 's'}`} />

            {services.length === 0 ? (
                <EmptyState
                    icon={ShoppingBag}
                    title="No services yet"
                    description="Services you purchase will show up here once your order is confirmed."
                    action={
                        <Button asChild>
                            <Link href="/services">Browse Services</Link>
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {services.map((cs) => (
                        <Card key={cs.id} className="flex flex-col gap-3 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-display text-base font-semibold">{cs.service.title}</h3>
                                <Badge variant={statusVariant[cs.status]} className="shrink-0 capitalize">
                                    {cs.status.toLowerCase()}
                                </Badge>
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                <span>Order: {cs.order.orderNumber}</span>
                                <span>
                                    Purchased:{' '}
                                    {new Date(cs.activatedAt ?? cs.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                                {cs.service.deliveryTime && <span>Delivery: {cs.service.deliveryTime}</span>}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}