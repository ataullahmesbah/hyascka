'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Search, Shield, Settings, FileText, Trash2, User, LogIn } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface MockLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
}

const mockLogs: MockLog[] = [
  { id: '1', user: 'Sarah Chen', action: 'LOGIN', resource: 'Auth System', ip: '192.168.1.10', timestamp: '2024-12-10 14:32:15' },
  { id: '2', user: 'Mike Johnson', action: 'UPDATE', resource: 'Site Settings', ip: '192.168.1.12', timestamp: '2024-12-10 14:28:03' },
  { id: '3', user: 'Sarah Chen', action: 'CREATE', resource: 'Blog Post: AI Trends', ip: '192.168.1.10', timestamp: '2024-12-10 14:15:42' },
  { id: '4', user: 'Anna Smith', action: 'DELETE', resource: 'User: linda@user.com', ip: '192.168.1.15', timestamp: '2024-12-10 13:55:20' },
  { id: '5', user: 'Mike Johnson', action: 'UPDATE', resource: 'Role: USER -> ADMIN', ip: '192.168.1.12', timestamp: '2024-12-10 13:40:11' },
  { id: '6', user: 'Sarah Chen', action: 'LOGIN', resource: 'Auth System', ip: '192.168.1.10', timestamp: '2024-12-10 09:15:00' },
  { id: '7', user: 'David Lee', action: 'UPDATE', resource: 'Profile', ip: '192.168.1.20', timestamp: '2024-12-09 18:22:34' },
  { id: '8', user: 'Anna Smith', action: 'DELETE', resource: 'Blog Post: Draft', ip: '192.168.1.15', timestamp: '2024-12-09 16:10:55' },
];

const actionIcons: Record<string, typeof LogIn> = {
  LOGIN: LogIn,
  LOGOUT: LogIn,
  CREATE: FileText,
  UPDATE: Settings,
  DELETE: Trash2,
  ROLE_CHANGE: Shield,
};

const actionColors: Record<string, string> = {
  LOGIN: 'bg-primary/10 text-primary',
  LOGOUT: 'bg-muted text-muted-foreground',
  CREATE: 'bg-success/10 text-success',
  UPDATE: 'bg-accent/10 text-accent',
  DELETE: 'bg-destructive/10 text-destructive',
  ROLE_CHANGE: 'bg-amber-500/10 text-amber-500',
};

export default function AuditLogsPage() {
  const [search, setSearch] = React.useState('');

  const filtered = mockLogs.filter((l) =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.resource.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Track every important action in the system." />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard title="Total Events" value={mockLogs.length} icon={ScrollText} accent="primary" />
        <StatCard title="Logins" value={mockLogs.filter((l) => l.action === 'LOGIN').length} icon={LogIn} accent="success" />
        <StatCard title="Updates" value={mockLogs.filter((l) => l.action === 'UPDATE').length} icon={Settings} accent="accent" />
        <StatCard title="Deletions" value={mockLogs.filter((l) => l.action === 'DELETE').length} icon={Trash2} accent="destructive" />
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
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="hidden md:table-cell">Resource</TableHead>
                <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log, i) => {
                const Icon = actionIcons[log.action] ?? FileText;
                return (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                            {log.user.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn('gap-1.5', actionColors[log.action])}>
                        <Icon className="h-3 w-3" />
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{log.resource}</TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground lg:table-cell">{log.ip}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
