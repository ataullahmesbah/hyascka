'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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

interface Tech {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  category: string | null;
}

export default function TechnologiesPage() {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Tech | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({ name: '', description: '', icon: '', category: '' });

  const { data: techs, loading, error, refetch } = useDashboardData<Tech[]>('/api/dashboard/technologies');

  const openEditor = (tech: Tech | null) => {
    if (tech) {
      setEditing(tech);
      setFormData({ name: tech.name, description: tech.description ?? '', icon: tech.icon ?? '', category: tech.category ?? '' });
    } else {
      setEditing(null);
      setFormData({ name: '', description: '', icon: '', category: '' });
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      const url = editing ? `/api/dashboard/technologies/${editing.id}` : '/api/dashboard/technologies';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: '' }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success(editing ? 'Technology updated' : 'Technology created');
      setEditorOpen(false);
      refetch();
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/technologies/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Technology deleted');
      setDeleteId(null);
      refetch();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Technologies" description="Manage the technologies showcased on your website." />
        <div className="grid gap-4 sm:grid-cols-4">{[0, 1, 2, 3].map((i) => <Card key={i}><CardContent className="h-24 animate-pulse rounded-lg bg-muted" /></Card>)}</div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Technologies" description="Manage the technologies showcased on your website."
        action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Technology</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total" value={(techs ?? []).length} icon={Cpu} accent="primary" />
        <StatCard title="Categories" value={new Set((techs ?? []).map((t) => t.category).filter(Boolean)).size} icon={Cpu} accent="accent" />
        <StatCard title="With Icons" value={(techs ?? []).filter((t) => t.icon).length} icon={Cpu} accent="success" />
      </div>

      {(techs ?? []).length === 0 ? (
        <EmptyState icon={Cpu} title="No technologies yet" description="Add your first technology."
          action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Technology</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(techs ?? []).map((tech, i) => (
            <motion.div key={tech.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="group transition-all hover:shadow-soft-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Cpu className="h-5 w-5 text-primary" /></div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditor(tech)}><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(tech.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-medium">{tech.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{tech.description}</p>
                  {tech.category && <Badge variant="secondary" className="mt-3 text-[10px]">{tech.category}</Badge>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Technology' : 'New Technology'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the technology.' : 'Create a new technology.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="icon">Icon Name</Label><Input id="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Optional" /></div>
              <div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Frontend, Backend..." /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'} Technology</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Technology?</DialogTitle><DialogDescription>This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}