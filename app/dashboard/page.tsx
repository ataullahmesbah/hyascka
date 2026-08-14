'use client';

// FILE: app/dashboard/page.tsx

import * as React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Users,
  FolderKanban,
  FileText,
  Mail,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Newspaper,
  CheckCircle2,
  Clock,
  Circle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatCard } from '@/components/dashboard/stat-card';
import { AreaChartCard, DonutChartCard } from '@/components/dashboard/charts';
import { PageHeader } from '@/components/dashboard/page-header';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { PortalWelcome } from '@/components/dashboard/portal-welcome';
import { can, type Role } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { EditorOverview } from '@/components/dashboard/editor-overview';
import { ModeratorOverview } from '@/components/dashboard/moderator-overview';
import { ClientOverview } from '@/components/dashboard/client-overview';


interface DashboardStats {
  stats: {
    users: number;
    projects: number;
    blogs: number;
    messages: number;
    subscribers: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalLeads: number;
    newLeads: number;
    pendingOffers: number;
    acceptedOffers: number;
  };
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: string;
    role: { name: string };
  }>;
  recentBlogs: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    author: { name: string | null } | null;
    category: { name: string } | null;
  }>;
  recentContacts: Array<{
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    status: string;
    createdAt: string;
  }>;
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-destructive/10 text-destructive',
  ADMIN: 'bg-primary/10 text-primary',
  MODERATOR: 'bg-accent/10 text-accent',
  CLIENT: 'bg-success/10 text-success',
  USER: 'bg-secondary text-muted-foreground',
};

const statusColors: Record<string, string> = {
  NEW: 'bg-primary/10 text-primary',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-500',
  RESOLVED: 'bg-success/10 text-success',
  ARCHIVED: 'bg-muted text-muted-foreground',
};

const blogStatusColors: Record<string, string> = {
  PUBLISHED: 'bg-success/10 text-success',
  DRAFT: 'bg-muted text-muted-foreground',
  SCHEDULED: 'bg-accent/10 text-accent',
  ARCHIVED: 'bg-amber-500/10 text-amber-500',
};

function generateTrafficData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((label, i) => ({
    label,
    value: 2000 + Math.floor(Math.random() * 4000) + i * 300,
  }));
}

const deviceData = [
  { label: 'Desktop', value: 58 },
  { label: 'Mobile', value: 32 },
  { label: 'Tablet', value: 10 },
];

const quickActions = [
  { label: 'New Blog Post', href: '/dashboard/blog', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'] },
  { label: 'Add Project', href: '/dashboard/projects', icon: FolderKanban, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'] },
  { label: 'Add User', href: '/dashboard/users', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'View Messages', href: '/dashboard/messages', icon: Mail, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] },
];

const activityIcons: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  completed: { icon: CheckCircle2, color: 'text-success' },
  in_progress: { icon: Clock, color: 'text-amber-500' },
  pending: { icon: Circle, color: 'text-muted-foreground' },
};

export default function DashboardHomePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'User';
  const userRole = (session?.user?.role ?? 'USER') as Role;
  const roleLabel = userRole.replace('_', ' ').toLowerCase();

  const showAgencyOverview = can(userRole, 'dashboard.viewAgencyOverview');
  const showModeratorOverview = !showAgencyOverview && can(userRole, 'dashboard.viewModeratorOverview');
  const showEditorOverview = !showAgencyOverview && !showModeratorOverview && can(userRole, 'dashboard.viewEditorOverview');
  const showClientOverview =
    !showAgencyOverview && !showModeratorOverview && !showEditorOverview && userRole === 'CLIENT';

  // Passing `null` when this role shouldn't see agency-wide stats skips
  // the fetch entirely (see hooks/use-dashboard-data.ts) rather than
  // fetching and discarding — the server route is also independently
  // gated to the same role set, this just avoids the wasted 403 round-trip.
  const { data: dashboardData, loading, error, refetch } = useDashboardData<DashboardStats>(
    showAgencyOverview ? '/api/dashboard/stats' : null
  );
  const trafficData = React.useMemo(() => generateTrafficData(), []);

  if (showModeratorOverview) return <ModeratorOverview name={userName} />;
  if (showEditorOverview) return <EditorOverview name={userName} />;
  if (showClientOverview) return <ClientOverview name={userName} />;
  if (!showAgencyOverview) {
    return <PortalWelcome name={userName} role={userRole} />;
  }

  if (loading) return <DashboardSkeleton />;
  if (error || !dashboardData) return <ErrorState message="Failed to load dashboard data" onRetry={refetch} />;

  const { stats, recentUsers, recentBlogs, recentContacts } = dashboardData;

  const visibleQuickActions = quickActions.filter((a) => a.roles.includes(userRole));
  const systemServices = [
    { label: 'Database', status: 'completed' as const },
    { label: 'API Services', status: 'completed' as const },
    { label: 'Email Service', status: 'completed' as const },
    { label: 'File Storage', status: 'completed' as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${userName.split(' ')[0]}`}
        description={`You are signed in as ${roleLabel}. Here's what's happening with your platform.`}
        action={
          (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') ? (
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/analytics">
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.users} icon={Users} accent="primary" delay={0} />
        <StatCard title="Total Projects" value={stats.projects} icon={FolderKanban} accent="accent" delay={0.05} />
        <StatCard title="Blog Posts" value={stats.blogs} icon={FileText} accent="success" delay={0.1} />
        <StatCard title="Messages" value={stats.messages} icon={Mail} accent="warning" delay={0.15} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={stats.totalLeads} icon={Mail} accent="primary" delay={0.2} />
        <StatCard title="New Leads" value={stats.newLeads} icon={Mail} accent="warning" delay={0.25} />
        <StatCard title="Pending Offers" value={stats.pendingOffers} icon={FileText} accent="accent" delay={0.3} />
        <StatCard title="Accepted Offers" value={stats.acceptedOffers} icon={FileText} accent="success" delay={0.35} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AreaChartCard
          title="Traffic Overview"
          description="Monthly visitor trends"
          data={trafficData}
          color="hsl(var(--chart-1))"
          className="lg:col-span-2"
        />
        <DonutChartCard
          title="Device Breakdown"
          description="Visitor devices"
          data={deviceData}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between p-5">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Link href="/dashboard/activity">View all<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-1">
              {recentUsers.length === 0 && recentBlogs.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p>
              ) : (
                <>
                  {recentBlogs.slice(0, 3).map((blog, i) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{blog.author?.name ?? 'Unknown'}</span>{' '}
                          <span className="text-muted-foreground">created blog post</span>{' '}
                          <span className="font-medium">{blog.title}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))}
                  {recentUsers.slice(0, 2).map((user, i) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (i + 3) * 0.05 }}
                      className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{user.name ?? user.email}</span>{' '}
                          <span className="text-muted-foreground">registered an account</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {visibleQuickActions.length > 0 && (
            <Card>
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {visibleQuickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center transition-all hover:border-primary/40 hover:bg-secondary"
                    >
                      <action.icon className="h-5 w-5 text-primary" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-5">
              <CardTitle className="text-base font-semibold">System Status</CardTitle>
              <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Operational
              </span>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="space-y-3">
                {systemServices.map((service) => {
                  const cfg = activityIcons[service.status];
                  return (
                    <div key={service.label} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{service.label}</span>
                      <span className={cn('flex items-center gap-1.5 text-xs font-medium', cfg.color)}>
                        <cfg.icon className="h-3.5 w-3.5" />
                        Active
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-5">
            <CardTitle className="text-base font-semibold">Latest Users</CardTitle>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Link href="/dashboard/users">View all<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-2">
              {recentUsers.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No users yet</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {(user.name ?? user.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.name ?? 'Unnamed'}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', roleColors[user.role.name] ?? roleColors.USER)}>
                      {user.role.name.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-5">
            <CardTitle className="text-base font-semibold">Latest Blog Posts</CardTitle>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Link href="/dashboard/blog">View all<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-2">
              {recentBlogs.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No blog posts yet</p>
              ) : (
                recentBlogs.map((blog) => (
                  <div key={blog.id} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{blog.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {blog.author?.name ?? 'Unknown'} · {blog.category?.name ?? 'Uncategorized'}
                      </p>
                    </div>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', blogStatusColors[blog.status] ?? blogStatusColors.DRAFT)}>
                      {blog.status.charAt(0) + blog.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}