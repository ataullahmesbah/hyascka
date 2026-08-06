'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Activity, FileText, Users, Mail, FolderKanban, Newspaper, Settings, LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { cn } from '@/lib/utils';

interface MockActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'subscribe';
  time: string;
}

const mockActivities: MockActivity[] = [
  { id: '1', user: 'Sarah Chen', action: 'published a blog post', target: 'AI Trends 2026', type: 'create', time: '2 min ago' },
  { id: '2', user: 'Mike Johnson', action: 'created a new project', target: 'E-Commerce Platform', type: 'create', time: '15 min ago' },
  { id: '3', user: 'Anna Smith', action: 'updated site settings', target: '', type: 'update', time: '32 min ago' },
  { id: '4', user: 'Emma Brown', action: 'sent a contact message', target: 'Partnership inquiry', type: 'subscribe', time: '1 hour ago' },
  { id: '5', user: 'David Lee', action: 'subscribed to newsletter', target: '', type: 'subscribe', time: '2 hours ago' },
  { id: '6', user: 'James Wilson', action: 'registered an account', target: '', type: 'create', time: '3 hours ago' },
  { id: '7', user: 'Sarah Chen', action: 'logged in', target: '', type: 'login', time: '4 hours ago' },
  { id: '8', user: 'Anna Smith', action: 'deleted a draft post', target: 'Old Draft', type: 'delete', time: '5 hours ago' },
  { id: '9', user: 'Mike Johnson', action: 'updated a project', target: 'AI Chatbot Solution', type: 'update', time: '6 hours ago' },
  { id: '10', user: 'Linda Park', action: 'logged in', target: '', type: 'login', time: '1 day ago' },
];

const typeIcons = {
  create: FileText,
  update: Settings,
  delete: Activity,
  login: LogIn,
  subscribe: Newspaper,
};

const typeColors = {
  create: 'bg-success/10 text-success',
  update: 'bg-accent/10 text-accent',
  delete: 'bg-destructive/10 text-destructive',
  login: 'bg-primary/10 text-primary',
  subscribe: 'bg-amber-500/10 text-amber-500',
};

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Activity Logs" description="Timeline of recent activities across the platform." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today" value={mockActivities.filter((a) => !a.time.includes('day')).length} icon={Activity} accent="primary" />
        <StatCard title="Creates" value={mockActivities.filter((a) => a.type === 'create').length} icon={FileText} accent="success" />
        <StatCard title="Updates" value={mockActivities.filter((a) => a.type === 'update').length} icon={Settings} accent="accent" />
        <StatCard title="Logins" value={mockActivities.filter((a) => a.type === 'login').length} icon={LogIn} accent="warning" />
      </div>

      <Card>
        <CardHeader className="p-5"><CardTitle className="text-base font-semibold">Activity Timeline</CardTitle></CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-1">
            {mockActivities.map((activity, i) => {
              const Icon = typeIcons[activity.type];
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative flex items-start gap-4 py-3"
                >
                  <div className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-background', typeColors[activity.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-primary/10 text-[8px] font-semibold text-primary">
                          {activity.user.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        {activity.target && <span className="font-medium">{activity.target}</span>}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
