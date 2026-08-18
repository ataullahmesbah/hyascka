'use client';
// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/dashboard/blog/page.tsx
// ==========================================================

import * as React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, MoreHorizontal, Edit, Trash2, Calendar, Clock, X } from 'lucide-react';
import cloudinaryImageLoader from '@/lib/cloudinary-image-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/dashboard/image-upload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { StatCard } from '@/components/dashboard/stat-card';
import { TableSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: string | null;
  contentImages: string[];
  authorDesignation: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  status: string;
  readingTime: number;
  publishedAt: string | null;
  createdAt: string;
  author: { id: string; name: string | null; email: string } | null;
  category: { id: string; name: string } | null;
  tags: { id: string; name: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-success/10 text-success',
  DRAFT: 'bg-muted text-muted-foreground',
  PENDING_REVIEW: 'bg-primary/10 text-primary',
  SCHEDULED: 'bg-accent/10 text-accent',
  REJECTED: 'bg-destructive/10 text-destructive',
  ARCHIVED: 'bg-amber-500/10 text-amber-500',
};

const statusLabels: Record<string, string> = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending Review',
  SCHEDULED: 'Scheduled',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
};

export default function BlogPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  // Publishing rights (matches lib/permissions.ts content.publish): only
  // SUPER_ADMIN/ADMIN can set PUBLISHED/SCHEDULED/REJECTED/ARCHIVED —
  // MODERATOR/EDITOR are restricted to Draft / Submit for Review, enforced
  // again server-side regardless of what this UI shows.
  const canPublish = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const canDelete = role === 'SUPER_ADMIN';

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data: blogs, loading, error, refetch } = useDashboardData<BlogPost[]>('/api/dashboard/blog');
  const { data: categories } = useDashboardData<Category[]>('/api/dashboard/categories');
  const { data: tags } = useDashboardData<Tag[]>('/api/dashboard/tags');

  const [formData, setFormData] = React.useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'DRAFT',
    categoryId: '',
    readingTime: 5,
    featuredImage: '',
    contentImages: [] as string[],
    authorDesignation: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    tagIds: [] as string[],
  });

  const filtered = (blogs ?? []).filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || (b.author?.name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openEditor = (post: BlogPost | null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt ?? '',
        content: post.content ?? '',
        status: post.status,
        categoryId: post.category?.id ?? '',
        readingTime: post.readingTime,
        featuredImage: post.featuredImage ?? '',
        contentImages: post.contentImages,
        authorDesignation: post.authorDesignation ?? '',
        seoTitle: post.seoTitle ?? '',
        seoDescription: post.seoDescription ?? '',
        canonicalUrl: post.canonicalUrl ?? '',
        tagIds: post.tags.map((t) => t.id),
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '', excerpt: '', content: '', status: 'DRAFT', categoryId: '', readingTime: 5, featuredImage: '',
        contentImages: [], authorDesignation: '', seoTitle: '', seoDescription: '', canonicalUrl: '', tagIds: [],
      });
    }
    setEditorOpen(true);
  };

  const toggleTag = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(id) ? prev.tagIds.filter((t) => t !== id) : [...prev.tagIds, id],
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const url = editingPost
        ? `/api/dashboard/blog/${editingPost.id}`
        : '/api/dashboard/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: '',
          categoryId: formData.categoryId || undefined,
          canonicalUrl: formData.canonicalUrl || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to save blog post');
      }

      toast.success(editingPost ? 'Blog post updated' : 'Blog post created');
      setEditorOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/blog/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Blog post deleted');
      setDeleteId(null);
      refetch();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Blog CMS" description="Create, edit, and manage blog posts." />
        <TableSkeleton />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const published = (blogs ?? []).filter((b) => b.status === 'PUBLISHED').length;
  const drafts = (blogs ?? []).filter((b) => b.status === 'DRAFT').length;
  const scheduled = (blogs ?? []).filter((b) => b.status === 'SCHEDULED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog CMS"
        description="Create, edit, and manage blog posts."
        action={
          <Button size="sm" className="gap-2" onClick={() => openEditor(null)}>
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Posts" value={(blogs ?? []).length} icon={FileText} accent="primary" />
        <StatCard title="Published" value={published} icon={FileText} accent="success" />
        <StatCard title="Drafts" value={drafts} icon={FileText} accent="warning" />
        <StatCard title="Scheduled" value={scheduled} icon={FileText} accent="accent" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border p-0.5">
              {['ALL', 'PUBLISHED', 'PENDING_REVIEW', 'DRAFT', 'SCHEDULED', 'REJECTED', 'ARCHIVED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    statusFilter === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {s === 'ALL' ? 'All' : statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No posts found"
              description="Create your first blog post to get started."
              action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> New Post</Button>}
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-secondary"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">{blog.title}</h3>
                    <p className="truncate text-xs text-muted-foreground">{blog.excerpt || blog.content?.slice(0, 80) || 'No excerpt'}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[8px]">
                            {(blog.author?.name ?? 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {blog.author?.name ?? 'Unknown'}
                      </span>
                      {blog.publishedAt && (
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(blog.publishedAt).toLocaleDateString()}</span>
                      )}
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {blog.readingTime} min</span>
                      {blog.category && <span className="rounded-full bg-secondary px-2 py-0.5">{blog.category.name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn('text-[10px]', statusColors[blog.status])}>
                      {statusLabels[blog.status] ?? blog.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditor(blog)}>
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(blog.id)}>
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'New Blog Post'}</DialogTitle>
            <DialogDescription>{editingPost ? 'Update the blog post details.' : 'Create a new blog post.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter post title..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Brief summary..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your post content..." rows={6} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PENDING_REVIEW">{canPublish ? 'Pending Review' : 'Submit for Review'}</SelectItem>
                    {canPublish && (
                      <>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {!canPublish && (
                  <p className="text-xs text-muted-foreground">Publishing requires an editor/admin — save as Draft or submit for review.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {(categories ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="readingTime">Reading Time (min)</Label>
                <Input id="readingTime" type="number" min={1} max={60} value={formData.readingTime} onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 5 })} />
              </div>
            </div>

            {(tags ?? []).length > 0 && (
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {(tags ?? []).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.id)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                        formData.tagIds.includes(t.id)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="authorDesignation">Author Designation</Label>
              <Input id="authorDesignation" value={formData.authorDesignation} onChange={(e) => setFormData({ ...formData, authorDesignation: e.target.value })} placeholder="e.g. Senior SEO Strategist" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Cover Image</Label>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                folder="hyaska/blog"
                label="Cover image"
              />
            </div>

            <div className="space-y-2">
              <Label>Content Images</Label>
              <div className="flex flex-wrap gap-2">
                {formData.contentImages.map((url) => (
                  <div key={url} className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                    <Image src={url} alt="" fill loader={cloudinaryImageLoader} className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, contentImages: formData.contentImages.filter((u) => u !== url) })}
                      className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background/80 text-foreground"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
              <ImageUpload
                value=""
                onChange={(url) => url && setFormData({ ...formData, contentImages: [...formData.contentImages, url] })}
                folder="hyaska/blog"
                label="Add content image"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input id="seoTitle" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} maxLength={70} placeholder="Falls back to post title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input id="canonicalUrl" type="url" value={formData.canonicalUrl} onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })} placeholder="Leave blank unless syndicated" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea id="seoDescription" value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} maxLength={160} rows={2} placeholder="Falls back to excerpt" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingPost ? 'Update' : 'Create'} Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Blog Post?</DialogTitle>
            <DialogDescription>This action cannot be undone. The blog post will be permanently removed.</DialogDescription>
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