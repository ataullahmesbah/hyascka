'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Mail, FileText, Users, Newspaper, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { cn } from '@/lib/utils';

interface MockNotification {
  id: string;
  title: string;
  message: string;
  type: 'user' | 'message' | 'blog' | 'newsletter';
  read: boolean;
  time: string;
}

const mockNotifications: MockNotification[] = [
  { id: '1', title: 'New User Registration', message: 'James Wilson just registered an account', type: 'user', read: false, time: '5 min ago' },
  { id: '2', title: 'New Contact Message', message: 'Emma Brown sent a contact message about AI consultation', type: 'message', read: false, time: '20 min ago' },
  { id: '3', title: 'Blog Post Published', message: 'Sarah Chen published "The Future of AI Agents"', type: 'blog', read: false, time: '1 hour ago' },
  { id: '4', title: 'New Newsletter Subscriber', message: 'alice@example.com subscribed to the newsletter', type: 'newsletter', read: true, time: '3 hours ago' },
  { id: '5', title: 'New Contact Message', message: 'Carlos Rodriguez sent a message about custom dashboard', type: 'message', read: true, time: '5 hours ago' },
  { id: '6', title: 'New User Registration', message: 'Diana Lee just registered an account', type: 'user', read: true, time: '1 day ago' },
  { id: '7', title: 'Blog Post Scheduled', message: 'Anna Smith scheduled "Automation Workflows for 2026"', type: 'blog', read: true, time: '2 days ago' },
];

const typeIcons = {
  user: Users,
  message: Mail,
  blog: FileText,
  newsletter: Newspaper,
};

const typeColors = {
  user: 'bg-primary/10 text-primary',
  message: 'bg-accent/10 text-accent',
  blog: 'bg-success/10 text-success',
  newsletter: 'bg-amber-500/10 text-amber-500',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated on all platform activities."
        action={
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}>
            <Check className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total" value={notifications.length} icon={Bell} accent="primary" />
        <StatCard title="Unread" value={unreadCount} icon={Bell} accent="warning" />
        <StatCard title="Read" value={notifications.length - unreadCount} icon={Bell} accent="success" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-1 rounded-lg border border-border p-0.5 w-fit">
            {['all', 'unread'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as 'all' | 'unread')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize',
                  filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((notif, i) => {
              const Icon = typeIcons[notif.type];
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    'flex items-center gap-4 rounded-xl border p-4 transition-colors',
                    notif.read ? 'border-border' : 'border-primary/20 bg-primary/5'
                  )}
                >
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', typeColors[notif.type])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{notif.title}</p>
                      {!notif.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{notif.message}</p>
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:block">{notif.time}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!notif.read && (
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n))}>
                          <Check className="h-3.5 w-3.5" /> Mark as read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
