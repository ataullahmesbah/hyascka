// FILE: app/dashboard/notifications/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Bell, CheckCheck } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface NotificationRow {
  id: string;
  title: string;
  message: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: NotificationRow[];
  unreadCount: number;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data, loading, error, refetch } = useDashboardData<NotificationsResponse>('/api/notifications');
  const [markingAll, setMarkingAll] = React.useState(false);

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'POST' });
      if (!res.ok) throw new Error();
      toast.success('All notifications marked as read.');
      refetch();
    } catch {
      toast.error('Unable to mark all as read.');
    } finally {
      setMarkingAll(false);
    }
  };

  const handleOpen = async (n: NotificationRow) => {
    if (!n.readAt) {
      await fetch(`/api/notifications/${n.id}/read`, { method: 'POST' });
      refetch();
    }
    if (n.link) router.push(n.link);
  };

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <ErrorState message="Failed to load notifications" onRetry={refetch} />;

  const { notifications, unreadCount } = data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        action={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={markingAll} className="gap-1.5">
              <CheckCheck className="h-3.5 w-3.5" />
              {markingAll ? 'Marking...' : 'Mark all read'}
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="You'll see important updates here as they happen." />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="flex flex-col divide-y divide-border">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleOpen(n)}
                className={cn(
                  'flex items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/60',
                  !n.readAt && 'bg-primary/[0.03]'
                )}
              >
                <span
                  className={cn(
                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                    n.readAt ? 'bg-transparent' : 'bg-primary'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.message && <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}