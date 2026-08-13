// FILE: app/dashboard/offers/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { FileSignature } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface OfferRow {
    id: string;
    offerNumber: string;
    title: string;
    total: string;
    currency: string;
    status: string;
    contact: { name: string; email: string };
    createdAt: string;
}

const statusVariant: Record<string, 'default' | 'outline' | 'secondary' | 'destructive'> = {
    DRAFT: 'secondary',
    SENT: 'outline',
    VIEWED: 'outline',
    ACCEPTED: 'default',
    REJECTED: 'destructive',
    EXPIRED: 'destructive',
    CANCELLED: 'destructive',
};

export default function OffersPage() {
    const { data: offers, loading, error, refetch } = useDashboardData<OfferRow[]>('/api/dashboard/offers');

    if (loading) return <DashboardSkeleton />;
    if (error || !offers) return <ErrorState message="Failed to load offers" onRetry={refetch} />;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Custom Offers" description={`${offers.length} offer${offers.length === 1 ? '' : 's'}`} />

            <Card className="overflow-hidden p-0">
                {offers.length === 0 ? (
                    <EmptyState icon={FileSignature} title="No offers yet" description="Create one from a lead's detail page." className="border-0" />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Offer</TableHead>
                                <TableHead>Lead</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offers.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/dashboard/offers/${o.id}`} className="hover:text-primary">
                                            {o.title}
                                        </Link>
                                        <div className="text-xs text-muted-foreground">{o.offerNumber}</div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{o.contact.name}</TableCell>
                                    <TableCell>{o.currency} {Number(o.total).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[o.status] ?? 'outline'} className="capitalize">
                                            {o.status.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}