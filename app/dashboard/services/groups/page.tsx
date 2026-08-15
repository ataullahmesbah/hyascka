// FILE: app/dashboard/services/groups/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FolderTree, Plus, MoreHorizontal, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface ServiceGroup {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    order: number;
    isActive: boolean;
    _count: { services: number };
}

export default function ServiceGroupsPage() {
    const [editorOpen, setEditorOpen] = React.useState(false);
    const [editing, setEditing] = React.useState<ServiceGroup | null>(null);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [saving, setSaving] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [formData, setFormData] = React.useState({ name: '', description: '', order: 0, isActive: true });

    const { data: groups, loading, error, refetch } = useDashboardData<ServiceGroup[]>('/api/dashboard/service-categories');

    const openEditor = (group: ServiceGroup | null) => {
        if (group) {
            setEditing(group);
            setFormData({ name: group.name, description: group.description ?? '', order: group.order, isActive: group.isActive });
        } else {
            setEditing(null);
            setFormData({ name: '', description: '', order: 0, isActive: true });
        }
        setEditorOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error('Group name is required');
            return;
        }
        setSaving(true);
        try {
            const url = editing ? `/api/dashboard/service-categories/${editing.id}` : '/api/dashboard/service-categories';
            const method = editing ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body.error ?? 'Failed to save group');
            toast.success(editing ? 'Service group updated' : 'Service group created');
            setEditorOpen(false);
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to save group');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (group: ServiceGroup) => {
        try {
            const res = await fetch(`/api/dashboard/service-categories/${group.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !group.isActive }),
            });
            if (!res.ok) throw new Error('Failed to update status');
            toast.success(group.isActive ? 'Group deactivated' : 'Group activated');
            refetch();
        } catch {
            toast.error('Failed to update group status');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/dashboard/service-categories/${deleteId}`, { method: 'DELETE' });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body.error ?? 'Failed to delete');
            toast.success('Service group deleted');
            setDeleteId(null);
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete group');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Service Groups" description="Organize services into categories shown on /services." />
                <div className="grid gap-4 sm:grid-cols-3">
                    {[0, 1, 2].map((i) => <Card key={i}><CardContent className="h-28 animate-pulse rounded-lg bg-muted" /></Card>)}
                </div>
            </div>
        );
    }
    if (error) return <ErrorState message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Service Groups"
                description="Organize services into categories shown on /services."
                action={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link href="/dashboard/services"><ArrowLeft className="h-4 w-4" /> Back to Services</Link>
                        </Button>
                        <Button size="sm" className="gap-2" onClick={() => openEditor(null)}>
                            <Plus className="h-4 w-4" /> Create Service Group
                        </Button>
                    </div>
                }
            />

            {(groups ?? []).length === 0 ? (
                <EmptyState
                    icon={FolderTree}
                    title="No service groups yet"
                    description="Create a group like 'Paid Media' or 'Search & SEO' to organize your services."
                    action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Create Service Group</Button>}
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(groups ?? []).map((group, i) => (
                        <motion.div key={group.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className="group transition-all hover:shadow-soft-md">
                                <CardContent className="p-5">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                            <FolderTree className="h-5 w-5 text-primary" />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditor(group)}><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                                                    onClick={() => setDeleteId(group.id)}
                                                    disabled={group._count.services > 0}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <h3 className="font-medium">{group.name}</h3>
                                    {group.description && <p className="mt-1 text-xs text-muted-foreground">{group.description}</p>}
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px]">Order: {group.order}</Badge>
                                            <Badge variant="secondary" className="text-[10px]">{group._count.services} service{group._count.services === 1 ? '' : 's'}</Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Switch checked={group.isActive} onCheckedChange={() => handleToggleActive(group)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Service Group' : 'New Service Group'}</DialogTitle>
                        <DialogDescription>{editing ? 'Update the group details.' : 'Create a new service category.'}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Paid Media" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="order">Display Order</Label>
                                <Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="flex items-center gap-3 pt-6">
                                <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                                <Label htmlFor="isActive">Active</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="gap-2">
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {editing ? 'Update' : 'Create'} Group
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Service Group?</DialogTitle>
                        <DialogDescription>This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="gap-2">
                            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}