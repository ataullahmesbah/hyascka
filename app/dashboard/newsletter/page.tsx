'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, Download, Trash2, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { StatCard } from '@/components/dashboard/stat-card';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  createdAt: string;
}

export default function NewsletterPage() {
  const [search, setSearch] = React.useState('');

  const { data: subscribers, loading, error, refetch } = useDashboardData<Subscriber[]>('/api/dashboard/newsletter');

  const filtered = (subscribers ?? []).filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()) || (s.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/newsletter?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Subscriber deleted');
      refetch();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Name', 'Status', 'Subscribed At'];
    const rows = (subscribers ?? []).map((s) => [
      s.email,
      s.name ?? '',
      s.active ? 'Active' : 'Unsubscribed',
      new Date(s.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Newsletter" description="Manage subscribers and export your mailing list." />
        <Card><CardContent className="p-5"><div className="h-48 animate-pulse rounded-lg bg-muted" /></CardContent></Card>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const activeCount = (subscribers ?? []).filter((s) => s.active).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter"
        description="Manage subscribers and export your mailing list."
        action={
          <Button size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Subscribers" value={(subscribers ?? []).length} icon={Newspaper} accent="primary" />
        <StatCard title="Active" value={activeCount} icon={Newspaper} accent="success" />
        <StatCard title="Unsubscribed" value={(subscribers ?? []).length - activeCount} icon={Newspaper} accent="destructive" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search subscribers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Newspaper} title="No subscribers found" description="No subscribers match your search." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscriber</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Subscribed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub, i) => (
                  <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                            {(sub.name ?? sub.email).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{sub.name ?? 'Subscriber'}</p>
                          <p className="text-xs text-muted-foreground">{sub.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(sub.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                        {sub.active ? 'Active' : 'Unsubscribed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={`mailto:${sub.email}`}><Mail className="h-3.5 w-3.5" /></a>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(sub.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}