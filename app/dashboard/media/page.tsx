'use client';
// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/dashboard/media/page.tsx
// ==========================================================
// Previously this page rendered Array.from({length:12}) fake gradient
// tiles with no data source and no working buttons at all — Upload,
// Preview, Copy, and Delete had no onClick handlers. Rebuilt against the
// real Media model (populated automatically by every upload across the
// dashboard via app/api/upload/route.ts).

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Trash2, Copy, Pencil, Search, Folder, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import cloudinaryImageLoader from '@/lib/cloudinary-image-loader';

interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  folder: string;
  fileType: string;
  width: number | null;
  height: number | null;
  size: number | null;
  title: string | null;
  altText: string | null;
  caption: string | null;
  createdAt: string;
  uploadedBy: { id: string; name: string | null } | null;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export default function MediaPage() {
  const [activeFolder, setActiveFolder] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [editing, setEditing] = React.useState<MediaItem | null>(null);
  const [editForm, setEditForm] = React.useState({ title: '', altText: '', caption: '' });
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: media, loading, error, refetch } = useDashboardData<MediaItem[]>('/api/dashboard/media');

  const folders = React.useMemo(() => {
    const set = new Set((media ?? []).map((m) => m.folder));
    return ['All', ...Array.from(set).sort()];
  }, [media]);

  const filtered = (media ?? []).filter((m) => {
    const matchesFolder = activeFolder === 'All' || m.folder === activeFolder;
    const q = search.toLowerCase();
    const matchesSearch = !q || (m.title ?? m.publicId).toLowerCase().includes(q) || (m.altText ?? '').toLowerCase().includes(q);
    return matchesFolder && matchesSearch;
  });

  const totalBytes = (media ?? []).reduce((sum, m) => sum + (m.size ?? 0), 0);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'hyaska/media-library');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Upload failed');
      }
      toast.success('Image uploaded');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const openEdit = (item: MediaItem) => {
    setEditing(item);
    setEditForm({ title: item.title ?? '', altText: item.altText ?? '', caption: item.caption ?? '' });
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/media/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Media updated');
      setEditing(null);
      refetch();
    } catch {
      toast.error('Failed to update media');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/media/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Media deleted');
      setDeleteId(null);
      refetch();
    } catch {
      toast.error('Failed to delete media');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Media Library" description="Upload and manage images via Cloudinary." />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[0, 1, 2, 3, 4, 5].map((i) => <Card key={i}><CardContent className="h-28 animate-pulse rounded-lg bg-muted" /></Card>)}
        </div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
          e.target.value = '';
        }}
      />
      <PageHeader
        title="Media Library"
        description="Upload and manage images via Cloudinary."
        action={
          <Button size="sm" className="gap-2" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Files" value={(media ?? []).length} icon={ImageIcon} accent="primary" />
        <StatCard title="Folders" value={Math.max(folders.length - 1, 0)} icon={Folder} accent="accent" />
        <StatCard title="Storage Used" value={formatBytes(totalBytes)} icon={ImageIcon} accent="success" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border p-0.5">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    activeFolder === folder ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {folder}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="No media found"
              description="Upload an image to get started, or every editor across the dashboard (Blog, Projects, Services, Profile) adds here automatically."
              action={<Button size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> Upload</Button>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i, 20) * 0.02 }}
                  className="group relative overflow-hidden rounded-xl border border-border"
                >
                  <div className="relative h-28 w-full bg-secondary/40">
                    <Image
                      src={item.url}
                      alt={item.altText ?? item.title ?? ''}
                      fill
                      sizes="200px"
                      loader={cloudinaryImageLoader}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button type="button" variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button type="button" variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleCopy(item.url)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button type="button" variant="secondary" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-medium">{item.title || item.publicId.split('/').pop()}</p>
                    <p className="text-[10px] text-muted-foreground">{formatBytes(item.size)}{item.width && item.height ? ` · ${item.width}×${item.height}` : ''}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>Update title, alt text, and caption.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="relative h-40 w-full overflow-hidden rounded-lg border border-border bg-secondary/40">
                <Image src={editing.url} alt="" fill loader={cloudinaryImageLoader} className="object-contain" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altText">Alt Text</Label>
                <Input id="altText" value={editForm.altText} onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })} placeholder="Describe the image for accessibility/SEO" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea id="caption" value={editForm.caption} onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })} rows={2} />
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
                <p className="truncate">URL: {editing.url}</p>
                <p className="mt-1">Uploaded by {editing.uploadedBy?.name ?? 'Unknown'} on {new Date(editing.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Media?</DialogTitle>
            <DialogDescription>This removes the file from Cloudinary and the library permanently. If it&apos;s used elsewhere on the site, that reference will break.</DialogDescription>
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
