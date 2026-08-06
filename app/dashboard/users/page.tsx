'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, MoreHorizontal, Shield, Mail, Trash2, Edit, Ban, CheckCircle2, Download } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { StatCard } from '@/components/dashboard/stat-card';
import { TableSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DashboardUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: string | null;
  createdAt: string;
  role: { id: string; name: string };
}

interface Role {
  id: string;
  name: string;
}

interface UsersResponse {
  users: DashboardUser[];
  roles: Role[];
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-destructive/10 text-destructive',
  ADMIN: 'bg-primary/10 text-primary',
  MODERATOR: 'bg-accent/10 text-accent',
  CLIENT: 'bg-success/10 text-success',
  USER: 'bg-secondary text-muted-foreground',
  GUEST: 'bg-muted text-muted-foreground',
};

export default function UsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('ALL');
  const [editUser, setEditUser] = React.useState<DashboardUser | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [editRoleId, setEditRoleId] = React.useState('');
  const [editName, setEditName] = React.useState('');

  const { data, loading, error, refetch } = useDashboardData<UsersResponse>('/api/dashboard/users');
  const users = data?.users ?? [];
  const roles = data?.roles ?? [];

  const filtered = users.filter((u) => {
    const matchesSearch = (u.name ?? '').toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || u.role.name === selectedRole;
    return matchesSearch && matchesRole;
  });

  const openEdit = (user: DashboardUser) => {
    setEditUser(user);
    setEditName(user.name ?? '');
    setEditRoleId(user.role.id);
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    try {
      const res = await fetch('/api/dashboard/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editUser.id, name: editName, roleId: editRoleId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to update user');
      }
      toast({ title: 'User updated successfully' });
      setEditUser(null);
      refetch();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/dashboard/users?id=${deleteId}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to delete user');
      }
      toast({ title: 'User deleted' });
      setDeleteId(null);
      refetch();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="User Management" description="Manage users, roles, and permissions." />
        <TableSkeleton />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage users, roles, and permissions." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={users.length} icon={Users} accent="primary" />
        <StatCard title="Verified" value={users.filter((u) => u.emailVerified).length} icon={CheckCircle2} accent="success" />
        <StatCard title="Admins" value={users.filter((u) => u.role.name === 'ADMIN' || u.role.name === 'SUPER_ADMIN').length} icon={Shield} accent="warning" />
        <StatCard title="Clients" value={users.filter((u) => u.role.name === 'CLIENT').length} icon={Users} accent="accent" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
                {['ALL', 'SUPER_ADMIN', 'ADMIN', 'CLIENT', 'USER'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                      selectedRole === role ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {role === 'ALL' ? 'All' : role.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Users} title="No users found" description="Try adjusting your search or filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user, i) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {(user.name ?? user.email).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name ?? 'Unnamed'}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn('font-medium', roleColors[user.role.name] ?? roleColors.USER)}>
                        {user.role.name.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEdit(user)}>
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2" asChild>
                            <a href={`mailto:${user.email}`}><Mail className="h-3.5 w-3.5" /> Email</a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteId(user.id)}>
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user name and role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Name</Label>
              <Input id="editName" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select value={editRoleId} onValueChange={setEditRoleId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User?</DialogTitle>
            <DialogDescription>This action cannot be undone. The user account will be permanently removed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
