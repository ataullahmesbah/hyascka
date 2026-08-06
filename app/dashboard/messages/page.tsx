'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Archive, Trash2, MoreHorizontal, Reply } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { StatCard } from '@/components/dashboard/stat-card';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  NEW: 'bg-primary/10 text-primary',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-500',
  RESOLVED: 'bg-success/10 text-success',
  ARCHIVED: 'bg-muted text-muted-foreground',
};

const statusOrder = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'];

export default function MessagesPage() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = React.useState('ALL');

  const { data: messages, loading, error, refetch } = useDashboardData<ContactMessage[]>('/api/dashboard/contacts');

  const filtered = (messages ?? []).filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  React.useEffect(() => {
    if (filtered.length > 0 && !selected) {
      setSelected(filtered[0]);
    }
  }, [messages, selected]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/dashboard/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      refetch();
      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
      toast({ title: `Status updated to ${status.replace('_', ' ')}` });
    } catch {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/contacts?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast({ title: 'Message deleted' });
      if (selected?.id === id) setSelected(null);
      refetch();
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Contact Messages" description="Manage and respond to contact form submissions." />
        <Card><CardContent className="p-5"><div className="h-96 animate-pulse rounded-lg bg-muted" /></CardContent></Card>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Messages" description="Manage and respond to contact form submissions." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={(messages ?? []).length} icon={Mail} accent="primary" />
        <StatCard title="New" value={(messages ?? []).filter((m) => m.status === 'NEW').length} icon={Mail} accent="accent" />
        <StatCard title="In Progress" value={(messages ?? []).filter((m) => m.status === 'IN_PROGRESS').length} icon={Mail} accent="warning" />
        <StatCard title="Resolved" value={(messages ?? []).filter((m) => m.status === 'RESOLVED').length} icon={Mail} accent="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="mb-3 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="mb-3 flex items-center gap-1 rounded-lg border border-border p-0.5">
              {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors',
                    statusFilter === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="max-h-[500px] space-y-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <EmptyState icon={Mail} title="No messages" description="No messages match your search." />
              ) : (
                filtered.map((msg, i) => (
                  <motion.button
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelected(msg)}
                    className={cn(
                      'w-full rounded-lg p-3 text-left transition-colors',
                      selected?.id === msg.id ? 'bg-primary/10' : 'hover:bg-secondary'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                          {msg.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{msg.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{msg.message.slice(0, 40)}...</p>
                      </div>
                      <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold', statusColors[msg.status])}>
                        {msg.status.replace('_', ' ')}
                      </span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {selected.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-semibold">{selected.name}</h3>
                      <p className="text-xs text-muted-foreground">{selected.email}</p>
                      {selected.company && <p className="text-xs text-muted-foreground">{selected.company}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', statusColors[selected.status])}>
                      {selected.status.replace('_', ' ')}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => updateStatus(selected.id, 'IN_PROGRESS')}>Mark In Progress</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => updateStatus(selected.id, 'RESOLVED')}>Mark Resolved</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => updateStatus(selected.id, 'ARCHIVED')}><Archive className="h-3.5 w-3.5" /> Archive</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => handleDelete(selected.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selected.message}</p>
                </div>
                {(selected.phone || selected.service || selected.budget) && (
                  <div className="grid gap-2 rounded-xl border border-border bg-secondary/50 p-4 text-xs">
                    {selected.phone && <p><span className="font-medium text-foreground">Phone:</span> {selected.phone}</p>}
                    {selected.service && <p><span className="font-medium text-foreground">Service:</span> {selected.service}</p>}
                    {selected.budget && <p><span className="font-medium text-foreground">Budget:</span> {selected.budget}</p>}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <EmptyState icon={Mail} title="Select a message" description="Choose a message from the list to view its details." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
