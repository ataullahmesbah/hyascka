// FILE: components/dashboard/notification-bell.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell() {
    const router = useRouter();
    const { data, loading, refetch } = useDashboardData<NotificationsResponse>('/api/notifications', {
        revalidateOnFocus: true,
        pollIntervalMs: 30000,
    });
    const [markingAll, setMarkingAll] = React.useState(false);

    const unreadCount = data?.unreadCount ?? 0;
    const notifications = data?.notifications ?? [];

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

    const handleClick = async (n: NotificationRow) => {
        if (!n.readAt) {
            fetch(`/api/notifications/${n.id}/read`, { method: 'POST' }).then(() => refetch());
        }
        if (n.link) router.push(n.link);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={markingAll}
                            className="text-xs font-normal text-primary hover:underline disabled:opacity-50"
                        >
                            {markingAll ? 'Marking...' : 'Mark all read'}
                        </button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {loading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                ) : notifications.length === 0 ? (
                    <p className="px-2 py-4 text-center text-sm text-muted-foreground">No notifications yet</p>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                onClick={() => handleClick(n)}
                                className="flex flex-col items-start gap-0.5 py-2.5"
                            >
                                <div className="flex w-full items-center gap-1.5">
                                    {!n.readAt && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                                    <span className="truncate text-sm font-medium">{n.title}</span>
                                </div>
                                {n.message && <span className="line-clamp-1 pl-3 text-xs text-muted-foreground">{n.message}</span>}
                                <span className="pl-3 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/notifications" className="cursor-pointer justify-center text-sm">
                        View all notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}