'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { toast } from 'sonner';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  _count: { blogs: number };
}

export default function TagsPage() {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '' });

  const { data: tags, loading, error, refetch } = useDashboardData<TagItem[]>('/api/dashboard/tags');

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      const res = await fetch('/api/dashboard/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: '' }),
      });
      if (!res.ok) throw new Error('Failed to create tag');
      toast.success('Tag created');
      setEditorOpen(false);
      setFormData({ name: '' });
      refetch();
    } catch {
      toast.error('Failed to create tag');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/tags?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Tag deleted');
      refetch();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tags" description="Manage tags for blog posts." />
        <Card><CardContent className="h-32 animate-pulse rounded-lg bg-muted" /></Card>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Tags" description="Manage tags for blog posts."
        action={<Button size="sm" className="gap-2" onClick={() => setEditorOpen(true)}><Plus className="h-4 w-4" /> Add Tag</Button>} />

      {(tags ?? []).length === 0 ? (
        <EmptyState icon={Tag} title="No tags yet" description="Add your first tag."
          action={<Button size="sm" className="gap-2" onClick={() => setEditorOpen(true)}><Plus className="h-4 w-4" /> Add Tag</Button>} />
      ) : (
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-2">
              {(tags ?? []).map((tag, i) => (
                <motion.div key={tag.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className="group relative">
                  <Badge variant="secondary" className="gap-1.5 py-1.5 pl-3 pr-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{tag.name}</span>
                    <span className="text-xs text-muted-foreground">{tag._count.blogs}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="ml-1 flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => handleDelete(tag.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Tag</DialogTitle>
            <DialogDescription>Create a new tag for blog posts.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} placeholder="AI, Next.js..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Create Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}