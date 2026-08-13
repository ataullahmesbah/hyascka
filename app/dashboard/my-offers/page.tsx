// FILE: app/dashboard/my-offers/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, FileSignature, Check, X } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface OfferRow {
    id: string;
    offerNumber: string;
    title: string;
    description: string | null;
    total: string;
    currency: string;
    status: string;
    validUntil: string | null;
    items: Array<{ id: string; label: string; amount: string }>;
}

const statusVariant: Record<string, 'default' | 'outline' | 'secondary' | 'destructive'> = {
    SENT: 'outline',
    VIEWED: 'outline',
    ACCEPTED: 'default',
    REJECTED: 'destructive',
    EXPIRED: 'destructive',
};

export default function MyOffersPage() {
    const router = useRouter();
    const { data, loading, error, refetch } = useDashboardData<{ offers: OfferRow[] }>('/api/offers');
    const [acceptingId, setAcceptingId] = React.useState<string | null>(null);
    const [rejectTarget, setRejectTarget] = React.useState<OfferRow | null>(null);
    const [rejecting, setRejecting] = React.useState(false);

    const handleAccept = async (id: string) => {
        setAcceptingId(id);
        try {
            const res = await fetch(`/api/offers/${id}/accept`, { method: 'POST' });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? 'Unable to accept offer');
            }
            toast.success('Offer accepted — redirecting to your order.');
            router.push('/dashboard/orders');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Unable to accept offer.');
        } finally {
            setAcceptingId(null);
        }
    };

    const handleReject = async () => {
        if (!rejectTarget) return;
        setRejecting(true);
        try {
            const res = await fetch(`/api/offers/${rejectTarget.id}/reject`, { method: 'POST' });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? 'Unable to reject offer');
            }
            toast.success('Offer rejected.');
            setRejectTarget(null);
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Unable to reject offer.');
        } finally {
            setRejecting(false);
        }
    };

    if (loading) return <DashboardSkeleton />;
    if (error || !data) return <ErrorState message="Failed to load offers" onRetry={refetch} />;

    const { offers } = data;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="My Offers" description={`${offers.length} offer${offers.length === 1 ? '' : 's'}`} />

            {offers.length === 0 ? (
                <EmptyState icon={FileSignature} title="No offers yet" description="Custom offers our team sends you will appear here." />
            ) : (
                <div className="flex flex-col gap-4">
                    {offers.map((offer) => {
                        const actionable = offer.status === 'SENT' || offer.status === 'VIEWED';
                        return (
                            <Card key={offer.id} className="flex flex-col gap-4 p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-display text-base font-semibold">{offer.title}</h3>
                                        <p className="text-xs text-muted-foreground">{offer.offerNumber}</p>
                                    </div>
                                    <Badge variant={statusVariant[offer.status] ?? 'outline'} className="shrink-0 capitalize">
                                        {offer.status.toLowerCase()}
                                    </Badge>
                                </div>

                                {offer.description && <p className="text-sm text-muted-foreground">{offer.description}</p>}

                                <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
                                    {offer.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between px-3 py-2 text-sm">
                                            <span>{item.label}</span>
                                            <span>{offer.currency} {Number(item.amount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {offer.validUntil && `Valid until ${new Date(offer.validUntil).toLocaleDateString()}`}
                                    </div>
                                    <span className="font-display text-lg font-semibold">
                                        {offer.currency} {Number(offer.total).toLocaleString()}
                                    </span>
                                </div>

                                {actionable && (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleAccept(offer.id)}
                                            disabled={acceptingId === offer.id}
                                            className="flex-1 gap-2"
                                        >
                                            {acceptingId === offer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                            Accept
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setRejectTarget(offer)}
                                            disabled={acceptingId === offer.id}
                                            className="flex-1 gap-2"
                                        >
                                            <X className="h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}

            {rejectTarget && (
                <AlertDialog open onOpenChange={(open) => !open && !rejecting && setRejectTarget(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reject &quot;{rejectTarget.title}&quot;?</AlertDialogTitle>
                            <AlertDialogDescription>This offer will no longer be actionable. This can&apos;t be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={rejecting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleReject();
                                }}
                                disabled={rejecting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {rejecting ? (
                                    <>
                                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                        Rejecting...
                                    </>
                                ) : (
                                    'Reject Offer'
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}