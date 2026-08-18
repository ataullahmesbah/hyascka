// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/dashboard/services/page.tsx
// ==========================================================
'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Wrench, Plus, MoreHorizontal, Edit, Trash2, Star, FolderTree, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
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

interface ServiceGroupOption {
  id: string;
  name: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  approach: string | null;
  image: string | null;
  icon: string | null;
  features: string[];
  order: number;
  featured: boolean;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  price: number | string | null;
  currency: string;
  acquisitionType: 'FIXED_PRICE' | 'CUSTOM_QUOTE';
  deliveryTime: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  seoTitle: string | null;
  seoDescription: string | null;
}

const emptyForm = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  approach: '',
  image: '',
  icon: '',
  features: '', // comma-separated in the form, split on save
  order: 0,
  featured: false,
  categoryId: 'none',
  price: '',
  currency: 'USD',
  acquisitionType: 'FIXED_PRICE' as 'FIXED_PRICE' | 'CUSTOM_QUOTE',
  deliveryTime: '',
  status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
  seoTitle: '',
  seoDescription: '',
};

export default function ServicesPage() {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [formData, setFormData] = React.useState(emptyForm);

  const { data: services, loading, error, refetch } = useDashboardData<Service[]>('/api/dashboard/services');
  const { data: groups } = useDashboardData<ServiceGroupOption[]>('/api/dashboard/service-categories');

  const openEditor = (service: Service | null) => {
    if (service) {
      setEditing(service);
      setFormData({
        title: service.title,
        slug: service.slug,
        shortDescription: service.shortDescription ?? '',
        description: service.description ?? '',
        approach: service.approach ?? '',
        image: service.image ?? '',
        icon: service.icon ?? '',
        features: service.features.join(', '),
        order: service.order,
        featured: service.featured,
        categoryId: service.categoryId ?? 'none',
        price: service.price !== null ? String(service.price) : '',
        currency: service.currency,
        acquisitionType: service.acquisitionType,
        deliveryTime: service.deliveryTime ?? '',
        status: service.status,
        seoTitle: service.seoTitle ?? '',
        seoDescription: service.seoDescription ?? '',
      });
    } else {
      setEditing(null);
      setFormData(emptyForm);
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (formData.acquisitionType === 'FIXED_PRICE' && !formData.price) {
      toast.error('Fixed-price services need a price — or switch this to Custom Quote.');
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/dashboard/services/${editing.id}` : '/api/dashboard/services';
      const method = editing ? 'PUT' : 'POST';
      const payload = {
        title: formData.title,
        slug: formData.slug || undefined,
        shortDescription: formData.shortDescription || undefined,
        description: formData.description || undefined,
        approach: formData.approach || undefined,
        image: formData.image || undefined,
        icon: formData.icon || undefined,
        features: formData.features
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
        order: formData.order,
        featured: formData.featured,
        categoryId: formData.categoryId === 'none' ? undefined : formData.categoryId,
        price: formData.acquisitionType === 'FIXED_PRICE' && formData.price ? Number(formData.price) : undefined,
        currency: formData.currency,
        acquisitionType: formData.acquisitionType,
        deliveryTime: formData.deliveryTime || undefined,
        status: formData.status,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? 'Failed to save service');
      toast.success(editing ? 'Service updated' : 'Service created');
      setEditorOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (service: Service, status: Service['status']) => {
    try {
      const res = await fetch(`/api/dashboard/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`Service marked as ${status.toLowerCase()}`);
      refetch();
    } catch {
      toast.error('Failed to update service status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/services/${deleteId}`, { method: 'DELETE' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? 'Failed to delete');
      toast.success('Service deleted');
      setDeleteId(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete service');
    } finally {
      setDeleting(false);
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

  const allServices = services ?? [];
  const published = allServices.filter((s) => s.status === 'PUBLISHED');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage the services displayed on /services."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href="/dashboard/services/groups"><FolderTree className="h-4 w-4" /> Manage Groups</Link>
            </Button>
            <Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Service</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Services" value={allServices.length} icon={Wrench} accent="primary" />
        <StatCard title="Published" value={published.length} icon={Wrench} accent="success" />
        <StatCard title="Featured" value={allServices.filter((s) => s.featured).length} icon={Star} accent="warning" />
      </div>

      {allServices.length === 0 ? (
        <EmptyState icon={Wrench} title="No services yet" description="Add your first service to display on the website."
          action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Service</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allServices.map((service, i) => (
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
                        {service.status !== 'PUBLISHED' && (
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusToggle(service, 'PUBLISHED')}>Publish</DropdownMenuItem>
                        )}
                        {service.status !== 'DRAFT' && (
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusToggle(service, 'DRAFT')}>Move to Draft</DropdownMenuItem>
                        )}
                        {service.status !== 'ARCHIVED' && (
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusToggle(service, 'ARCHIVED')}>Archive</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(service.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="font-medium">{service.title}</h3>
                    <Badge
                      variant={service.status === 'PUBLISHED' ? 'default' : service.status === 'DRAFT' ? 'secondary' : 'outline'}
                      className="text-[10px] capitalize"
                    >
                      {service.status.toLowerCase()}
                    </Badge>
                  </div>
                  {service.category && (
                    <span className="mt-1 block text-xs text-muted-foreground">{service.category.name}</span>
                  )}
                  {service.shortDescription && (
                    <p className="mt-1 text-xs text-muted-foreground">{service.shortDescription}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {service.acquisitionType === 'FIXED_PRICE' && service.price !== null
                        ? `${service.currency} ${Number(service.price).toLocaleString()}`
                        : 'Custom quote'}
                    </Badge>
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
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Service' : 'New Service'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the service details.' : 'Create a new service.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (auto-generated if left blank)</Label>
                <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="meta-ads" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input id="shortDescription" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Shown on the catalog card" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">What We Do</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} placeholder="Shown as the 'What We Do' section on the service page" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="approach">Our Approach</Label>
              <Textarea id="approach" value={formData.approach} onChange={(e) => setFormData({ ...formData, approach: e.target.value })} rows={4} placeholder="Shown as the 'Our Approach' section on the service page" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">What&apos;s Included (comma-separated)</Label>
              <Textarea id="features" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} rows={2} placeholder="Strategy, Implementation, Reporting" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Service Group</Label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No group</SelectItem>
                    {(groups ?? []).map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Service['status'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Acquisition Type</Label>
              <Select value={formData.acquisitionType} onValueChange={(v) => setFormData({ ...formData, acquisitionType: v as 'FIXED_PRICE' | 'CUSTOM_QUOTE' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED_PRICE">Fixed Price — direct checkout</SelectItem>
                  <SelectItem value="CUSTOM_QUOTE">Custom Quote — routes to Contact/Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.acquisitionType === 'FIXED_PRICE' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })} maxLength={3} />
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input id="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Bot, Workflow..." />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deliveryTime">Delivery Time</Label>
                <Input id="deliveryTime" value={formData.deliveryTime} onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })} placeholder="2-3 weeks" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input id="seoTitle" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} maxLength={70} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Input id="seoDescription" value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} maxLength={160} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
              <Label htmlFor="featured">Featured service</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? 'Update' : 'Create'} Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Service?</DialogTitle>
            <DialogDescription>Services with order history can&apos;t be deleted — archive them instead.</DialogDescription>
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