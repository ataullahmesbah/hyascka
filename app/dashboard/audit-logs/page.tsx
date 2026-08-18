'use client';
// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/dashboard/audit-logs/page.tsx
// ==========================================================

import * as React from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Search, Settings, FileText, Trash2, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { cn } from '@/lib/utils';

interface AuditLogRow {
  id: string;
  actorId: string | null;
  actor: { name: string | null; email: string } | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: string;
}

interface AuditLogResponse {
  logs: AuditLogRow[];
  total: number;
}

// Actions are free-form strings written by lib/audit-log.ts call sites
// (e.g. "user.role_changed", "settings.updated") — bucket by prefix so new
// action names get a sensible icon/color without a hardcoded lookup table.
function actionCategory(action: string): 'create' | 'update' | 'delete' | 'login' {
  if (action.includes('deleted')) return 'delete';
  if (action.includes('role_changed') || action.startsWith('login')) return 'login';
  if (action.includes('created')) return 'create';
  return 'update';
}

const categoryIcons = { login: LogIn, create: FileText, update: Settings, delete: Trash2 } as const;
const categoryColors = {
  login: 'bg-primary/10 text-primary',
  create: 'bg-success/10 text-success',
  update: 'bg-accent/10 text-accent',
  delete: 'bg-destructive/10 text-destructive',
} as const;

export default function AuditLogsPage() {
  const [search, setSearch] = React.useState('');
  const { data, loading, error, refetch } = useDashboardData<AuditLogResponse>('/api/dashboard/audit-logs');

  const logs = data?.logs ?? [];
  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      (l.actor?.name ?? l.actor?.email ?? '').toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      (l.targetType ?? '').toLowerCase().includes(q)
    );
  });

  const counts = {
    login: logs.filter((l) => actionCategory(l.action) === 'login').length,
    update: logs.filter((l) => actionCategory(l.action) === 'update').length,
    delete: logs.filter((l) => actionCategory(l.action) === 'delete').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Every sensitive dashboard action — role changes, deletions, settings and payment updates." />

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No audit events yet"
          description="Sensitive actions (role changes, deletions, settings and payment updates) will appear here as they happen."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <StatCard title="Total Events" value={data?.total ?? logs.length} icon={ScrollText} accent="primary" />
            <StatCard title="Logins / Role Changes" value={counts.login} icon={LogIn} accent="success" />
            <StatCard title="Updates" value={counts.update} icon={Settings} accent="accent" />
            <StatCard title="Deletions" value={counts.delete} icon={Trash2} accent="destructive" />
          </div>

          <Card>
            <CardContent className="p-5">
              <div className="mb-4 relative max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Target</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((log, i) => {
                    const category = actionCategory(log.action);
                    const Icon = categoryIcons[category];
                    const actorLabel = log.actor?.name ?? log.actor?.email ?? 'System';
                    return (
                      <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                                {actorLabel.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{actorLabel}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn('gap-1.5', categoryColors[category])}>
                            <Icon className="h-3 w-3" />
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                          {log.targetType ? `${log.targetType}${log.targetId ? ` · ${log.targetId.slice(0, 8)}` : ''}` : '—'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
