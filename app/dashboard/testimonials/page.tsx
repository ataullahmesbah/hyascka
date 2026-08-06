'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote, Plus, MoreHorizontal, Edit, Trash2, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  position: string;
  company: string | null;
  initials: string;
  rating: number;
  active: boolean;
}

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    quote: '', name: '', position: '', company: '', initials: '', rating: 5, active: true,
  });

  const { data: testimonials, loading, error, refetch } = useDashboardData<Testimonial[]>('/api/dashboard/testimonials');

  const openEditor = (t: Testimonial | null) => {
    if (t) {
      setEditing(t);
      setFormData({ quote: t.quote, name: t.name, position: t.position, company: t.company ?? '', initials: t.initials, rating: t.rating, active: t.active });
    } else {
      setEditing(null);
      setFormData({ quote: '', name: '', position: '', company: '', initials: '', rating: 5, active: true });
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.quote.trim() || !formData.name.trim()) {
      toast({ title: 'Quote and name are required', variant: 'destructive' });
      return;
    }
    const initials = formData.initials || formData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    try {
      const url = editing ? `/api/dashboard/testimonials/${editing.id}` : '/api/dashboard/testimonials';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, initials }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({ title: editing ? 'Testimonial updated' : 'Testimonial created' });
      setEditorOpen(false);
      refetch();
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/testimonials/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast({ title: 'Testimonial deleted' });
      setDeleteId(null);
      refetch();
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Testimonials" description="Manage client testimonials shown on your website." />
        <div className="grid gap-4 sm:grid-cols-2">{[0, 1].map((i) => <Card key={i}><CardContent className="h-40 animate-pulse rounded-lg bg-muted" /></CardContent></Card>)}</div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" description="Manage client testimonials shown on your website."
        action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Testimonial</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total" value={(testimonials ?? []).length} icon={Quote} accent="primary" />
        <StatCard title="Active" value={(testimonials ?? []).filter((t) => t.active).length} icon={Quote} accent="success" />
        <StatCard title="Avg Rating" value={((testimonials ?? []).reduce((a, t) => a + t.rating, 0) / Math.max(testimonials?.length ?? 1, 1)).toFixed(1)} icon={Star} accent="warning" />
      </div>

      {(testimonials ?? []).length === 0 ? (
        <EmptyState icon={Quote} title="No testimonials yet" description="Add your first testimonial."
          action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Testimonial</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(testimonials ?? []).map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group transition-all hover:shadow-soft-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <Quote className="h-8 w-8 text-primary/30" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditor(t)}><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(t.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{t.initials}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.position}{t.company ? `, ${t.company}` : ''}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={cn('h-3.5 w-3.5', idx < t.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30')} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="secondary" className={cn(t.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                      {t.active ? 'Active' : 'Inactive'}
                    </Badge>
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
            <DialogTitle>{editing ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the testimonial.' : 'Create a new testimonial.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quote">Quote</Label>
              <Textarea id="quote" value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} rows={3} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="position">Position</Label><Input id="position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="rating">Rating</Label><Input id="rating" type="number" min={1} max={5} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="active" checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'} Testimonial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Testimonial?</DialogTitle><DialogDescription>This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
