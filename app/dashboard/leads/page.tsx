// FILE: app/dashboard/leads/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Inbox } from 'lucide-react';
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

interface LeadRow {
    id: string;
    name: string;
    email: string;
    status: string;
    priority: string;
    isCustomRequest: boolean;
    assignedTo: { name: string | null; email: string } | null;
    createdAt: string;
}

const priorityVariant: Record<string, 'default' | 'outline' | 'secondary' | 'destructive'> = {
    LOW: 'outline',
    MEDIUM: 'secondary',
    HIGH: 'default',
    URGENT: 'destructive',
};

export default function LeadsPage() {
    const { data: leads, loading, error, refetch } = useDashboardData<LeadRow[]>('/api/dashboard/contacts');

    if (loading) return <DashboardSkeleton />;
    if (error || !leads) return <ErrorState message="Failed to load leads" onRetry={refetch} />;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Leads" description={`${leads.length} lead${leads.length === 1 ? '' : 's'}`} />

            <Card className="overflow-hidden p-0">
                {leads.length === 0 ? (
                    <EmptyState icon={Inbox} title="No leads yet" description="Contact form submissions will appear here." className="border-0" />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id} className="cursor-pointer">
                                    <TableCell className="font-medium">
                                        <Link href={`/dashboard/leads/${lead.id}`} className="hover:text-primary">
                                            {lead.name}
                                            {lead.isCustomRequest && (
                                                <Badge variant="outline" className="ml-2 text-[10px]">Custom</Badge>
                                            )}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{lead.status.toLowerCase()}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={priorityVariant[lead.priority] ?? 'outline'} className="capitalize">
                                            {lead.priority.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {lead.assignedTo?.name ?? lead.assignedTo?.email ?? 'Unassigned'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}