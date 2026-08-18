// FILE: app/dashboard/activity/page.tsx
// PURPOSE: Real, database-backed operational activity timeline. Previously
// this page rendered a hardcoded mockActivities array with no API call at
// all; it now fetches from /api/dashboard/activity (ActivityLog model).
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Activity, FileText, Settings, Mail, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { cn } from '@/lib/utils';

interface ActivityRow {
  id: string;
  action: string;
  description: string;
  actorRole: string | null;
  actor: { id: string; name: string | null; email: string } | null;
  createdAt: string;
}

interface ActivityResponse {
  activities: ActivityRow[];
  todayCount: number;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function bucketFor(action: string): 'create' | 'update' | 'message' | 'delete' {
  if (action.includes('deleted')) return 'delete';
  if (action.includes('created')) return 'create';
  if (action.includes('sent')) return 'message';
  return 'update';
}

const bucketIcons = {
  create: FileText,
  update: Settings,
  message: Mail,
  delete: Trash2,
};

const bucketColors = {
  create: 'bg-success/10 text-success',
  update: 'bg-accent/10 text-accent',
  message: 'bg-primary/10 text-primary',
  delete: 'bg-destructive/10 text-destructive',
};

export default function ActivityPage() {
  const { data, loading, error, refetch } = useDashboardData<ActivityResponse>('/api/dashboard/activity');

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <ErrorState message="Failed to load activity log" onRetry={refetch} />;

  const activities = data.activities;
  const buckets = activities.map((a) => bucketFor(a.action));
  const createCount = buckets.filter((b) => b === 'create').length;
  const updateCount = buckets.filter((b) => b === 'update').length;
  const messageCount = buckets.filter((b) => b === 'message').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Activity Logs" description="Timeline of recent operational activity across the platform." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today" value={data.todayCount} icon={Activity} accent="primary" />
        <StatCard title="Created" value={createCount} icon={FileText} accent="success" />
        <StatCard title="Updates" value={updateCount} icon={Settings} accent="accent" />
        <StatCard title="Messages" value={messageCount} icon={Mail} accent="warning" />
      </div>

      <Card>
        <CardHeader className="p-5"><CardTitle className="text-base font-semibold">Activity Timeline</CardTitle></CardHeader>
        <CardContent className="p-5 pt-0">
          {activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
              <div className="space-y-1">
                {activities.map((item, i) => {
                  const bucket = bucketFor(item.action);
                  const Icon = bucketIcons[bucket];
                  const actorName = item.actor?.name ?? item.actor?.email ?? 'System';
                  const initials = actorName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i, 20) * 0.03 }}
                      className="relative flex items-start gap-4 py-3"
                    >
                      <div className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-background', bucketColors[bucket])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="bg-primary/10 text-[8px] font-semibold text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-medium">{actorName}</span>{' '}
                            <span className="text-muted-foreground">{item.description}</span>
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
