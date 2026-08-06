'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FolderKanban, MoreHorizontal, Edit, Trash2, Star } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { StatCard } from '@/components/dashboard/stat-card';
import { TableSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  overview: string | null;
  image: string | null;
  status: string;
  featured: boolean;
  techStack: string[];
  technologies: { id: string; name: string }[];
  createdAt: string;
}

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-success/10 text-success',
  IN_PROGRESS: 'bg-primary/10 text-primary',
  PLANNED: 'bg-accent/10 text-accent',
  ON_HOLD: 'bg-amber-500/10 text-amber-500',
  CANCELLED: 'bg-destructive/10 text-destructive',
};

export default function ProjectsPage() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState('');
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data: projects, loading, error, refetch } = useDashboardData<Project[]>('/api/dashboard/projects');

  const [formData, setFormData] = React.useState({
    title: '',
    category: '',
    overview: '',
    status: 'COMPLETED',
    featured: false,
    image: '',
    techStack: '',
  });

  const filtered = (projects ?? []).filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openEditor = (project: Project | null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        overview: project.overview ?? '',
        status: project.status,
        featured: project.featured,
        image: project.image ?? '',
        techStack: project.techStack.join(', '),
      });
    } else {
      setEditingProject(null);
      setFormData({ title: '', category: '', overview: '', status: 'COMPLETED', featured: false, image: '', techStack: '' });
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      toast({ title: 'Title and category are required', variant: 'destructive' });
      return;
    }

    try {
      const url = editingProject ? `/api/dashboard/projects/${editingProject.id}` : '/api/dashboard/projects';
      const method = editingProject ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: '',
          techStack: formData.techStack.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to save project');
      }

      toast({ title: editingProject ? 'Project updated' : 'Project created' });
      setEditorOpen(false);
      refetch();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to save', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/projects/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast({ title: 'Project deleted' });
      setDeleteId(null);
      refetch();
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Projects" description="Manage your portfolio projects and case studies." />
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects and case studies."
        action={
          <Button size="sm" className="gap-2" onClick={() => openEditor(null)}>
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Projects" value={(projects ?? []).length} icon={FolderKanban} accent="primary" />
        <StatCard title="Completed" value={(projects ?? []).filter((p) => p.status === 'COMPLETED').length} icon={FolderKanban} accent="success" />
        <StatCard title="In Progress" value={(projects ?? []).filter((p) => p.status === 'IN_PROGRESS').length} icon={FolderKanban} accent="primary" />
        <StatCard title="Featured" value={(projects ?? []).filter((p) => p.featured).length} icon={Star} accent="warning" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={FolderKanban} title="No projects found" description="Create your first project to get started."
              action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add Project</Button>} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="group transition-all hover:shadow-soft-md">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <FolderKanban className="h-5 w-5 text-primary" />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditor(project)}><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(project.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{project.category}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className={cn('text-[10px]', statusColors[project.status])}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                        {project.featured && (
                          <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-500">
                            <Star className="h-2.5 w-2.5" /> Featured
                          </Badge>
                        )}
                      </div>
                      {project.techStack.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <span key={tech} className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">{tech}</span>
                          ))}
                          {project.techStack.length > 4 && <span className="text-[10px] text-muted-foreground">+{project.techStack.length - 4}</span>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'New Project'}</DialogTitle>
            <DialogDescription>{editingProject ? 'Update the project details.' : 'Create a new project.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Web Development" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="overview">Overview</Label>
              <Textarea id="overview" value={formData.overview} onChange={(e) => setFormData({ ...formData, overview: e.target.value })} rows={3} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNED">Planned</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
              <Input id="techStack" value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} placeholder="Next.js, TypeScript, PostgreSQL" />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
              <Label htmlFor="featured">Featured project</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingProject ? 'Update' : 'Create'} Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Project?</DialogTitle>
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
