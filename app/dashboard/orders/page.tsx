// FILE: app/dashboard/orders/page.tsx
'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, ClipboardList, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { can, type Role } from '@/lib/permissions';

interface OrderRow {
    id: string;
    orderNumber: string;
    amount: string;
    currency: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
    service: { title: string } | null;
    offer: { title: string; offerNumber: string } | null;
    user?: { name: string | null; email: string };
    payment: { status: string; provider: string } | null;
}

interface OrdersResponse {
    orders: OrderRow[];
    total: number;
}

const statusVariant: Record<string, 'default' | 'outline' | 'secondary' | 'destructive'> = {
    PENDING: 'secondary',
    CONFIRMED: 'outline',
    PROCESSING: 'outline',
    COMPLETED: 'default',
    CANCELLED: 'destructive',
    REFUNDED: 'destructive',
};

export default function OrdersPage() {
    const { data: session } = useSession();
    const role = (session?.user?.role ?? 'USER') as Role;
    const isAdmin = can(role, 'orders.read');

    const { data, loading, error, refetch } = useDashboardData<OrdersResponse>('/api/orders');
    const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

    const handleConfirmPayment = async (orderId: string) => {
        setConfirmingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/confirm-payment`, { method: 'POST' });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? 'Unable to confirm payment');
            }
            toast.success('Payment confirmed — invoice and service activated.');
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Unable to confirm payment.');
        } finally {
            setConfirmingId(null);
        }
    };

    if (loading) return <DashboardSkeleton />;
    if (error || !data) return <ErrorState message="Failed to load orders" onRetry={refetch} />;

    const { orders } = data;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={isAdmin ? 'Orders' : 'My Orders'} description={`${orders.length} order${orders.length === 1 ? '' : 's'}`} />

            <Card className="overflow-hidden p-0">
                {orders.length === 0 ? (
                    <EmptyState
                        icon={ClipboardList}
                        title="No orders yet"
                        description={isAdmin ? 'Orders placed by clients will appear here.' : "You haven't placed any orders yet."}
                        className="border-0"
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Service</TableHead>
                                {isAdmin && <TableHead>Customer</TableHead>}
                                <TableHead>Amount</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell className="font-medium">{o.orderNumber}</TableCell>
                                    <TableCell>{o.service?.title ?? o.offer?.title ?? '—'}</TableCell>
                                    {isAdmin && (
                                        <TableCell className="text-muted-foreground">
                                            {o.user?.name ?? o.user?.email ?? '—'}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        {o.currency} {Number(o.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={o.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="capitalize">
                                            {o.paymentStatus.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[o.status] ?? 'outline'} className="capitalize">
                                            {o.status.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell className="text-right">
                                            {o.paymentStatus === 'PAID' ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-success">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Confirmed
                                                </span>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={confirmingId === o.id}
                                                    onClick={() => handleConfirmPayment(o.id)}
                                                >
                                                    {confirmingId === o.id ? (
                                                        <>
                                                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                                            Confirming...
                                                        </>
                                                    ) : (
                                                        'Confirm Payment'
                                                    )}
                                                </Button>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}