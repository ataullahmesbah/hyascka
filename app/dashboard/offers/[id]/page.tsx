// FILE: app/dashboard/offers/[id]/page.tsx
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Send, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface OfferDetail {
    id: string;
    offerNumber: string;
    title: string;
    description: string | null;
    subtotal: string;
    discount: string;
    total: string;
    currency: string;
    status: string;
    validUntil: string | null;
    rejectReason: string | null;
    contact: { name: string; email: string };
    client: { id: string; name: string | null; email: string } | null;
    items: Array<{ id: string; label: string; amount: string }>;
    order: { id: string; orderNumber: string; status: string; paymentStatus: string } | null;
}

export default function OfferDetailPage() {
    const params = useParams<{ id: string }>();
    const { data: offer, loading, error, refetch } = useDashboardData<OfferDetail>(`/api/dashboard/offers/${params.id}`);
    const [actionLoading, setActionLoading] = React.useState<'send' | 'cancel' | null>(null);

    const handleAction = async (action: 'send' | 'cancel') => {
        setActionLoading(action);
        try {
            const res = await fetch(`/api/dashboard/offers/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? `Unable to ${action} offer`);
            }
            toast.success(action === 'send' ? 'Offer sent successfully.' : 'Offer cancelled successfully.');
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : `Unable to ${action} offer.`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <DashboardSkeleton />;
    if (error || !offer) return <ErrorState message="Failed to load offer" onRetry={refetch} />;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={offer.title}
                description={`${offer.offerNumber} — ${offer.contact.name}`}
                action={
                    <div className="flex items-center gap-2">
                        {offer.status === 'DRAFT' && (
                            <Button onClick={() => handleAction('send')} disabled={actionLoading !== null} className="gap-2">
                                {actionLoading === 'send' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                Send Offer
                            </Button>
                        )}
                        {(offer.status === 'DRAFT' || offer.status === 'SENT' || offer.status === 'VIEWED') && (
                            <Button
                                variant="outline"
                                onClick={() => handleAction('cancel')}
                                disabled={actionLoading !== null}
                                className="gap-2 text-destructive hover:text-destructive"
                            >
                                {actionLoading === 'cancel' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                Cancel
                            </Button>
                        )}
                    </div>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
                <Card className="flex flex-col gap-4 p-6">
                    {offer.description && <p className="text-sm text-muted-foreground">{offer.description}</p>}

                    <div className="flex flex-col divide-y divide-border">
                        {offer.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2.5 text-sm">
                                <span>{item.label}</span>
                                <span className="font-medium">{offer.currency} {Number(item.amount).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-1 border-t border-border pt-4 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span>{offer.currency} {Number(offer.subtotal).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Discount</span><span>-{offer.currency} {Number(offer.discount).toLocaleString()}</span></div>
                        <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{offer.currency} {Number(offer.total).toLocaleString()}</span></div>
                    </div>

                    {offer.rejectReason && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                            Rejection reason: {offer.rejectReason}
                        </div>
                    )}
                </Card>

                <Card className="flex flex-col gap-4 p-6">
                    <div>
                        <span className="text-xs uppercase text-muted-foreground">Status</span>
                        <div className="mt-1"><Badge className="capitalize">{offer.status.toLowerCase()}</Badge></div>
                    </div>
                    <div>
                        <span className="text-xs uppercase text-muted-foreground">Client</span>
                        <p className="mt-1 text-sm">
                            {offer.client ? (offer.client.name ?? offer.client.email) : 'Not linked to an account yet'}
                        </p>
                    </div>
                    {offer.validUntil && (
                        <div>
                            <span className="text-xs uppercase text-muted-foreground">Valid Until</span>
                            <p className="mt-1 text-sm">{new Date(offer.validUntil).toLocaleDateString()}</p>
                        </div>
                    )}
                    {offer.order && (
                        <div>
                            <span className="text-xs uppercase text-muted-foreground">Order</span>
                            <p className="mt-1 text-sm">{offer.order.orderNumber} — {offer.order.paymentStatus}</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}