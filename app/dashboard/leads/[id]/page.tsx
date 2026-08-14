// FILE: app/dashboard/leads/[id]/page.tsx
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, Mail, Phone, FileText, ArrowRight, MessageSquare, UserPlus, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface UsersResponse {
    users: Array<{ id: string; name: string | null; email: string; role: { name: string } }>;
}

interface LeadDetail {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    message: string;
    status: string;
    priority: string;
    isCustomRequest: boolean;
    assignedTo: { id: string; name: string | null; email: string } | null;
    user: { id: string; name: string | null; email: string; role: { name: string } } | null;
    offers: Array<{ id: string; offerNumber: string; title: string; status: string; total: string; currency: string }>;
    invitations: Array<{ id: string; email: string; expiresAt: string; usedAt: string | null; createdAt: string }>;
    createdAt: string;
}

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'CONVERTED', 'LOST'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'];

export default function LeadDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { data: lead, loading, error, refetch } = useDashboardData<LeadDetail>(`/api/dashboard/contacts/${params.id}`);
    const { data: usersData } = useDashboardData<UsersResponse>('/api/dashboard/users');
    const [saving, setSaving] = React.useState(false);
    const [messaging, setMessaging] = React.useState(false);
    const [inviting, setInviting] = React.useState(false);

    const handleInviteClient = async () => {
        if (!lead) return;
        setInviting(true);
        try {
            const res = await fetch(`/api/dashboard/contacts/${lead.id}/invite`, { method: 'POST' });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(body.error ?? 'Unable to invite client');
            }
            toast.success(body.message ?? 'Invitation sent.');
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Unable to invite client.');
        } finally {
            setInviting(false);
        }
    };

    const handleMessageCustomer = async () => {
        if (!lead?.user) return;
        setMessaging(true);
        try {
            const res = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contactId: lead.id, clientId: lead.user.id }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? 'Unable to start conversation');
            }
            const { conversation } = await res.json();
            router.push(`/dashboard/messages?c=${conversation.id}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Unable to start conversation.');
        } finally {
            setMessaging(false);
        }
    };

    const staff = (usersData?.users ?? []).filter((u) => STAFF_ROLES.includes(u.role.name));

    const updateLead = async (patch: Record<string, unknown>) => {
        if (!lead) return;
        setSaving(true);
        try {
            const res = await fetch('/api/dashboard/contacts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: lead.id, ...patch }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? 'Unable to update lead');
            }
            toast.success('Lead updated successfully.');
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Unable to update lead.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <DashboardSkeleton />;
    if (error || !lead) return <ErrorState message="Failed to load lead" onRetry={refetch} />;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={lead.name}
                description={lead.isCustomRequest ? 'Custom service request' : 'Contact inquiry'}
                action={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleMessageCustomer}
                            disabled={!lead.user || messaging}
                            title={!lead.user ? "This lead doesn't have a registered account yet" : undefined}
                            className="gap-2"
                        >
                            {messaging ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                            Message Customer
                        </Button>
                        <Button
                            onClick={() => router.push(`/dashboard/offers/new?contactId=${lead.id}`)}
                            className="gap-2"
                        >
                            Create Custom Offer
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
                <Card className="flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" /> {lead.email}
                        </span>
                        {lead.phone && (
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" /> {lead.phone}
                            </span>
                        )}
                        {lead.company && <span className="text-muted-foreground">Company: {lead.company}</span>}
                    </div>

                    <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 p-4 text-sm">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <p className="whitespace-pre-line">{lead.message}</p>
                    </div>

                    {lead.offers.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">Offers from this lead</span>
                            {lead.offers.map((o) => (
                                <Link
                                    key={o.id}
                                    href={`/dashboard/offers/${o.id}`}
                                    className="flex items-center justify-between rounded-lg border border-border p-3 text-sm transition-colors hover:border-primary/40"
                                >
                                    <span>{o.title} — {o.offerNumber}</span>
                                    <Badge variant="outline" className="capitalize">{o.status.toLowerCase()}</Badge>
                                </Link>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-2">
                        <Label>Client Account</Label>
                        {lead.user ? (
                            <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
                                <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
                                <div>
                                    <div className="font-medium">Active</div>
                                    <div className="text-xs text-muted-foreground">{lead.user.name ?? lead.user.email}</div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {(() => {
                                    const invitation = lead.invitations[0];
                                    const isExpired = invitation && new Date(invitation.expiresAt) < new Date();
                                    const isPending = invitation && !invitation.usedAt && !isExpired;
                                    return (
                                        <div className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
                                            <span className="text-muted-foreground">
                                                {isPending
                                                    ? `Invitation sent — expires ${new Date(invitation.expiresAt).toLocaleDateString()}`
                                                    : isExpired
                                                        ? 'Previous invitation expired'
                                                        : 'Not created'}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleInviteClient}
                                                disabled={inviting}
                                                className="w-full gap-2"
                                            >
                                                {inviting ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <UserPlus className="h-3.5 w-3.5" />
                                                )}
                                                {isPending ? 'Resend Invitation' : 'Invite Client'}
                                            </Button>
                                        </div>
                                    );
                                })()}
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Status</Label>
                        <Select value={lead.status} onValueChange={(v) => updateLead({ status: v })} disabled={saving}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((s) => (
                                    <SelectItem key={s} value={s} className="capitalize">{s.toLowerCase()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Priority</Label>
                        <Select value={lead.priority} onValueChange={(v) => updateLead({ priority: v })} disabled={saving}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {PRIORITY_OPTIONS.map((p) => (
                                    <SelectItem key={p} value={p} className="capitalize">{p.toLowerCase()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Assigned To</Label>
                        <Select
                            value={lead.assignedTo?.id ?? 'unassigned'}
                            onValueChange={(v) => updateLead({ assignedToId: v === 'unassigned' ? null : v })}
                            disabled={saving}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {staff.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>{s.name ?? s.email}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {saving && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                        </span>
                    )}
                </Card>
            </div>
        </div>
    );
}