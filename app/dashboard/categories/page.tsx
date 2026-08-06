'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FolderTree, Plus, MoreHorizontal, Edit, Trash2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { blogs: number };
}

export default function CategoriesPage() {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({ name: '', description: '' });

  const { data: categories, loading, error, refetch } = useDashboardData<Category[]>('/api/dashboard/categories');

  const openEditor = (cat: Category | null) => {
    if (cat) {
      setEditing(cat);
      setFormData({ name: cat.name, description: cat.description ?? '' });
    } else {
      setEditing(null);
      setFormData({ name: '', description: '' });
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    try {
      const url = editing ? `/api/dashboard/categories/${editing.id}` : '/api/dashboard/categories';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: '' }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({ title: editing ? 'Category updated' : 'Category created' });
      setEditorOpen(false);
      refetch();
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/categories/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast({ title: 'Category deleted' });
      setDeleteId(null);
      refetch();
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Categories" description="Organize blog posts into categories." />
        <div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((i) => <Card key={i}><CardContent className="h-24 animate-pulse rounded-lg bg-muted" /></CardContent></Card>)}</div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Organize blog posts into categories."
        action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Category</Button>} />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Total Categories" value={(categories ?? []).length} icon={FolderTree} accent="primary" />
        <StatCard title="Total Posts" value={(categories ?? []).reduce((a, c) => a + c._count.blogs, 0)} icon={FileText} accent="accent" />
      </div>

      {(categories ?? []).length === 0 ? (
        <EmptyState icon={FolderTree} title="No categories yet" description="Create your first category."
          action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Category</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group transition-all hover:shadow-soft-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><FolderTree className="h-5 w-5 text-primary" /></div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditor(cat)}><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(cat.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="mt-3 font-medium">{cat.name}</h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">/{cat.slug}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{cat._count.blogs} blog posts</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the category.' : 'Create a new category.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'} Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Category?</DialogTitle><DialogDescription>This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
