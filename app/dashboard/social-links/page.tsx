// FILE: app/dashboard/social-links/page.tsx
// PURPOSE: Manage social media links shown in the site footer (PRD
// section 19). Previously these were hardcoded in the footer with
// href="#" placeholders — this page + the SocialLink model replace that.
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Share2, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SocialLinkRow {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  label: string | null;
  active: boolean;
  order: number;
}

const emptyForm = { platform: '', url: '', icon: '', label: '', active: true, order: 0 };

export default function SocialLinksPage() {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SocialLinkRow | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState(emptyForm);

  const { data: links, loading, error, refetch } = useDashboardData<SocialLinkRow[]>('/api/dashboard/social-links');

  const openEditor = (link: SocialLinkRow | null) => {
    if (link) {
      setEditing(link);
      setFormData({ platform: link.platform, url: link.url, icon: link.icon ?? '', label: link.label ?? '', active: link.active, order: link.order });
    } else {
      setEditing(null);
      setFormData({ ...emptyForm, order: (links ?? []).length });
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.platform.trim() || !formData.url.trim()) {
      toast.error('Platform and URL are required');
      return;
    }
    try {
      const url = editing ? `/api/dashboard/social-links/${editing.id}` : '/api/dashboard/social-links';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to save');
      }
      toast.success(editing ? 'Social link updated' : 'Social link added');
      setEditorOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/social-links/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Social link deleted');
      setDeleteId(null);
      refetch();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Social Links" description="Manage the social links shown in your site footer." />
        <div className="space-y-3">{[0, 1, 2].map((i) => <Card key={i}><CardContent className="h-16 animate-pulse rounded-lg bg-muted" /></Card>)}</div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const all = links ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Social Links" description="Manage the social links shown in your site footer."
        action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Link</Button>} />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Total" value={all.length} icon={Share2} accent="primary" />
        <StatCard title="Active" value={all.filter((l) => l.active).length} icon={Share2} accent="success" />
      </div>

      {all.length === 0 ? (
        <EmptyState icon={Share2} title="No social links yet" description="Add your first social link."
          action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Link</Button>} />
      ) : (
        <div className="space-y-2">
          {all.map((link, i) => (
            <motion.div key={link.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{link.label || link.platform}</p>
                    <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                  </div>
                  <Badge variant="secondary" className={cn('text-[10px]', link.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                    {link.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">#{link.order}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditor(link)}><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(link.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Social Link' : 'New Social Link'}</DialogTitle>
            <DialogDescription>{editing ? 'Update this social link.' : 'Add a new social link to the footer.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input id="platform" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} placeholder="e.g. LinkedIn, Facebook, X" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label (optional)</Label>
                <Input id="label" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Falls back to platform name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon key (optional)</Label>
                <Input id="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="linkedin, facebook, github, x, instagram, youtube..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="active" checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
              <Label htmlFor="active">Active (visible in footer)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'} Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Social Link?</DialogTitle><DialogDescription>This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
