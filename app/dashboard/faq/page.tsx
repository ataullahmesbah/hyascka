'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Plus, MoreHorizontal, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
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
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

export default function FAQPage() {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FAQ | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({ question: '', answer: '', order: 0, active: true });

  const { data: faqs, loading, error, refetch } = useDashboardData<FAQ[]>('/api/dashboard/faq');

  const openEditor = (faq: FAQ | null) => {
    if (faq) {
      setEditing(faq);
      setFormData({ question: faq.question, answer: faq.answer, order: faq.order, active: faq.active });
    } else {
      setEditing(null);
      setFormData({ question: '', answer: '', order: (faqs ?? []).length, active: true });
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({ title: 'Question and answer are required', variant: 'destructive' });
      return;
    }
    try {
      const url = editing ? `/api/dashboard/faq/${editing.id}` : '/api/dashboard/faq';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({ title: editing ? 'FAQ updated' : 'FAQ created' });
      setEditorOpen(false);
      refetch();
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/faq/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast({ title: 'FAQ deleted' });
      setDeleteId(null);
      refetch();
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="FAQ Management" description="Manage frequently asked questions." />
        <div className="space-y-3">{[0, 1, 2].map((i) => <Card key={i}><CardContent className="h-16 animate-pulse rounded-lg bg-muted" /></CardContent></Card>)}</div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="FAQ Management" description="Manage frequently asked questions."
        action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add FAQ</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total FAQs" value={(faqs ?? []).length} icon={HelpCircle} accent="primary" />
        <StatCard title="Active" value={(faqs ?? []).filter((f) => f.active).length} icon={HelpCircle} accent="success" />
        <StatCard title="Inactive" value={(faqs ?? []).filter((f) => !f.active).length} icon={HelpCircle} accent="destructive" />
      </div>

      {(faqs ?? []).length === 0 ? (
        <EmptyState icon={HelpCircle} title="No FAQs yet" description="Add your first FAQ."
          action={<Button size="sm" className="gap-2" onClick={() => openEditor(null)}><Plus className="h-4 w-4" /> Add FAQ</Button>} />
      ) : (
        <div className="space-y-3">
          {(faqs ?? []).map((faq, i) => (
            <motion.div key={faq.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="group transition-all hover:shadow-soft-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium">{faq.question}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn('text-[10px]', faq.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                      {faq.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">#{faq.order}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditor(faq)}><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(faq.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            <DialogTitle>{editing ? 'Edit FAQ' : 'New FAQ'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the FAQ.' : 'Create a new FAQ.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="question">Question</Label><Input id="question" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="answer">Answer</Label><Textarea id="answer" value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} rows={3} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="order">Display Order</Label><Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="active" checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'} FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete FAQ?</DialogTitle><DialogDescription>This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
