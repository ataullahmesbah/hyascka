// FILE: app/checkout/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ServiceDetail {
    id: string;
    title: string;
    shortDescription: string | null;
    price: string | null;
    currency: string;
    deliveryTime: string | null;
    status: string;
}

interface CreatedOrder {
    id: string;
    orderNumber: string;
    amount: string;
    currency: string;
}

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const slug = searchParams.get('service');

    const [service, setService] = React.useState<ServiceDetail | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [notFound, setNotFound] = React.useState(false);
    const [placing, setPlacing] = React.useState(false);
    const [order, setOrder] = React.useState<CreatedOrder | null>(null);

    React.useEffect(() => {
        if (!slug) {
            setLoading(false);
            setNotFound(true);
            return;
        }
        fetch(`/api/services/${encodeURIComponent(slug)}`)
            .then((res) => {
                if (!res.ok) throw new Error('not found');
                return res.json();
            })
            .then((data) => setService(data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    const handlePlaceOrder = async () => {
        if (!service) return;
        setPlacing(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceId: service.id }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? 'Unable to place order');
            }

            const created = await res.json();
            setOrder(created);
            toast.success('Order placed successfully.');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Unable to place order.');
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center pt-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (notFound || !service) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 pt-20 text-center">
                <h1 className="font-display text-xl font-semibold">Service not found</h1>
                <p className="mt-2 text-sm text-muted-foreground">This service isn&apos;t available for checkout.</p>
                <Button asChild className="mt-6">
                    <Link href="/service">Browse services</Link>
                </Button>
            </div>
        );
    }

    if (service.price === null) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 pt-20 text-center">
                <h1 className="font-display text-xl font-semibold">This service needs a custom quote</h1>
                <p className="mt-2 text-sm text-muted-foreground">Get in touch with our team for pricing.</p>
                <Button asChild className="mt-6">
                    <Link href="/contact">Contact Us</Link>
                </Button>
            </div>
        );
    }

    if (order) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 pt-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <h1 className="mt-4 font-display text-xl font-semibold">Order placed — {order.orderNumber}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Our team will reach out to complete payment for {order.currency} {Number(order.amount).toLocaleString()}.
                    You can track this order any time from your dashboard.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/dashboard/orders">View My Orders</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-lg px-5 pb-24 pt-32 tab:px-8">
            <h1 className="font-display text-2xl font-semibold tracking-tight">Checkout</h1>
            <p className="mt-1 text-sm text-muted-foreground">Review your order before confirming.</p>

            <Card className="mt-8 p-6">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <h2 className="font-medium">{service.title}</h2>
                        {service.shortDescription && (
                            <p className="mt-1 text-sm text-muted-foreground">{service.shortDescription}</p>
                        )}
                        {service.deliveryTime && (
                            <p className="mt-1 text-xs text-muted-foreground">Delivery: {service.deliveryTime}</p>
                        )}
                    </div>
                    <span className="shrink-0 font-display text-lg font-semibold">
                        {service.currency} {Number(service.price).toLocaleString()}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <span className="font-medium">Total</span>
                    <span className="font-display text-xl font-semibold">
                        {service.currency} {Number(service.price).toLocaleString()}
                    </span>
                </div>

                <Button onClick={handlePlaceOrder} disabled={placing} size="lg" className="mt-6 w-full gap-2">
                    {placing ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Placing order...
                        </>
                    ) : (
                        'Confirm Order'
                    )}
                </Button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Payment is confirmed by our team after checkout — you won&apos;t be charged automatically.
                </p>
            </Card>
        </div>
    );
}