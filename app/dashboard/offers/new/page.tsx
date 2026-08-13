// FILE: app/dashboard/offers/new/page.tsx
'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface ContactInfo {
    id: string;
    name: string;
    email: string;
    user: { id: string } | null;
}

interface ItemDraft {
    label: string;
    amount: string;
}

export default function NewOfferPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const contactId = searchParams.get('contactId');

    const { data: contact, loading } = useDashboardData<ContactInfo>(
        contactId ? `/api/dashboard/contacts/${contactId}` : null
    );

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [discount, setDiscount] = React.useState('0');
    const [validUntil, setValidUntil] = React.useState('');
    const [items, setItems] = React.useState<ItemDraft[]>([{ label: '', amount: '' }]);
    const [saving, setSaving] = React.useState(false);

    const subtotal = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    const total = Math.max(0, subtotal - (parseFloat(discount) || 0));

    const updateItem = (index: number, field: keyof ItemDraft, value: string) => {
        setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
    };

    const addItem = () => setItems((prev) => [...prev, { label: '', amount: '' }]);
    const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async () => {
        if (!contactId) {
            toast.error('No lead selected for this offer.');
            return;
        }
        const validItems = items.filter((i) => i.label.trim() && parseFloat(i.amount) > 0);
        if (!title.trim() || validItems.length === 0) {
            toast.error('Add a title and at least one valid item.');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/dashboard/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description: description || undefined,
                    contactId,
                    discount: parseFloat(discount) || 0,
                    validUntil: validUntil ? new Date(validUntil).toISOString() : undefined,
                    items: validItems.map((i) => ({ label: i.label, amount: parseFloat(i.amount) })),
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? 'Unable to create offer');
            }

            const offer = await res.json();
            toast.success('Offer created successfully.');
            router.push(`/dashboard/offers/${offer.id}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Unable to create offer.');
        } finally {
            setSaving(false);
        }
    };

    if (contactId && loading) return <DashboardSkeleton />;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Create Custom Offer"
                description={contact ? `For ${contact.name} (${contact.email})` : 'Select a lead first from the Leads page.'}
            />

            <Card className="flex flex-col gap-5 p-6">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="offer-title">Title</Label>
                    <Input id="offer-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. SEO + Web Development Package" />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="offer-desc">Description</Label>
                    <Textarea id="offer-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                </div>

                <div className="flex flex-col gap-3">
                    <Label>Items</Label>
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Input
                                placeholder="Item name (e.g. Technical SEO)"
                                value={item.label}
                                onChange={(e) => updateItem(i, 'label', e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                type="number"
                                placeholder="Amount"
                                value={item.amount}
                                onChange={(e) => updateItem(i, 'amount', e.target.value)}
                                className="w-32"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeItem(i)}
                                disabled={items.length === 1}
                                className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-fit gap-1.5">
                        <Plus className="h-3.5 w-3.5" /> Add item
                    </Button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                    <div className="flex flex-1 flex-col gap-2">
                        <Label htmlFor="offer-discount">Discount</Label>
                        <Input id="offer-discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <Label htmlFor="offer-valid">Valid Until</Label>
                        <Input id="offer-valid" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                    </div>
                </div>

                <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/40 p-4 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Discount</span><span>-${(parseFloat(discount) || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between border-t border-border pt-1 font-semibold"><span>Total</span><span>${total.toLocaleString()}</span></div>
                </div>

                <Button onClick={handleSubmit} disabled={saving || !contactId} size="lg" className="w-full gap-2">
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving draft...
                        </>
                    ) : (
                        'Save Draft'
                    )}
                </Button>
            </Card>
        </div>
    );
}