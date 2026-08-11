'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, MoreHorizontal, Edit, Trash2, Star } from 'lucide-react';
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
import { StatCard } from '@/components/dashboard/stat-card';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  features: string[];
  order: number;
  featured: boolean;
}

export default function ServicesPage() {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({ title: '', description: '', icon: '', order: 0, featured: false });

  const { data: services, loading, error, refetch } = useDashboardData<Service[]>('/api/dashboard/services');

  const openEditor = (service: Service | null) => {
    if (service) {
      setEditing(service);
      setFormData({ title: service.title, description: service.description ?? '', icon: service.icon ?? '', order: service.order, featured: service.featured });
    } else {
      setEditing(null);
      setFormData({ title: '', description: '', icon: '', order: 0, featured: false });
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    try {
      const url = editing ? `/api/dashboard/services/${editing.id}` : '/api/dashboard/services';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: '', features: [] }),
      });
      if (!res.ok) throw new Error('Failed to save service');
      toast.success(editing ? 'Service updated' : 'Service created');
      setEditorOpen(false);
      refetch();
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/services/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Service deleted');
      setDeleteId(null);
      refetch();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Services" description="Manage the services displayed on your website." />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => <Card key={i}><CardContent className="h-32 animate-pulse rounded-lg bg-muted" /></Card>)}
        </div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage the services displayed on your website."
        action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Service</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Services" value={(services ?? []).length} icon={Wrench} accent="primary" />
        <StatCard title="Featured" value={(services ?? []).filter((s) => s.featured).length} icon={Star} accent="warning" />
        <StatCard title="Active" value={(services ?? []).length} icon={Wrench} accent="success" />
      </div>

      {(services ?? []).length === 0 ? (
        <EmptyState icon={Wrench} title="No services yet" description="Add your first service to display on the website."
          action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Service</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((service, i) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group transition-all hover:shadow-soft-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditor(service)}><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(service.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-medium">{service.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">Order: {service.order}</Badge>
                    {service.featured && <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-500"><Star className="h-2.5 w-2.5" /> Featured</Badge>}
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
            <DialogTitle>{editing ? 'Edit Service' : 'New Service'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the service details.' : 'Create a new service.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input id="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Bot, Workflow..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
              <Label htmlFor="featured">Featured service</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'} Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Service?</DialogTitle>
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