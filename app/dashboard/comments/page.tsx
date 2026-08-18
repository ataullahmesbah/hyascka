// FILE: app/dashboard/comments/page.tsx
// PURPOSE: Blog comment moderation. New comments default to PENDING and
// are invisible on the public post until approved here (or rejected/
// deleted). SUPER_ADMIN/ADMIN/MODERATOR per lib/permissions.ts comments.moderate.
'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Check, X, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface CommentRow {
  id: string;
  name: string;
  email: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  blog: { id: string; title: string; slug: string };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-accent/10 text-accent',
  APPROVED: 'bg-success/10 text-success',
  REJECTED: 'bg-destructive/10 text-destructive',
};

export default function CommentsPage() {
  const [filter, setFilter] = React.useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data: comments, loading, error, refetch } = useDashboardData<CommentRow[]>('/api/dashboard/comments');

  const setStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/dashboard/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(status === 'APPROVED' ? 'Comment approved' : 'Comment rejected');
      refetch();
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/comments/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Comment deleted');
      setDeleteId(null);
      refetch();
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Comments" description="Moderate blog comments." />
        <div className="space-y-3">{[0, 1, 2].map((i) => <Card key={i}><CardContent className="h-20 animate-pulse rounded-lg bg-muted" /></Card>)}</div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const all = comments ?? [];
  const pending = all.filter((c) => c.status === 'PENDING');
  const approved = all.filter((c) => c.status === 'APPROVED');
  const rejected = all.filter((c) => c.status === 'REJECTED');
  const filtered = filter === 'ALL' ? all : all.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Comments" description="Moderate comments submitted on blog posts." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={all.length} icon={MessageSquare} accent="primary" />
        <StatCard title="Pending" value={pending.length} icon={MessageSquare} accent="accent" />
        <StatCard title="Approved" value={approved.length} icon={MessageSquare} accent="success" />
        <StatCard title="Rejected" value={rejected.length} icon={MessageSquare} accent="destructive" />
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 w-fit">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              filter === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No comments" description="Nothing to moderate here." />
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.email}</span>
                        <Badge variant="secondary" className={cn('text-[10px]', statusColors[c.status])}>{c.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{c.content}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <Link href={`/blog/${c.blog.slug}`} target="_blank" className="inline-flex items-center gap-1 hover:text-foreground">
                          {c.blog.title} <ExternalLink className="h-3 w-3" />
                        </Link>
                        <span>{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {c.status !== 'APPROVED' && (
                        <Button size="icon" variant="outline" className="h-8 w-8 text-success hover:text-success" onClick={() => setStatus(c.id, 'APPROVED')}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {c.status !== 'REJECTED' && (
                        <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setStatus(c.id, 'REJECTED')}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setDeleteId(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Comment?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
