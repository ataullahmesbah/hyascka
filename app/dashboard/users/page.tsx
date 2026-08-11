// FILE: app/dashboard/users/page.tsx
'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Pencil, ShieldAlert, Trash2, Users as UsersIcon } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Unauthorized } from '@/components/dashboard/unauthorized';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { can, canActOnTarget, roleLabel, type Role } from '@/lib/permissions';

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: string | null;
  createdAt: string;
  role: { id: string; name: Role };
}

interface RoleRow {
  id: string;
  name: Role;
}

interface UsersResponse {
  users: UserRow[];
  roles: RoleRow[];
}

export default function UsersPage() {
  const { data: session } = useSession();
  const actorRole = (session?.user?.role ?? 'USER') as Role;
  const actorId = session?.user?.id;

  const { data, loading, error, refetch } = useDashboardData<UsersResponse>('/api/dashboard/users');

  const [editTarget, setEditTarget] = React.useState<UserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<UserRow | null>(null);

  if (!can(actorRole, 'users.read')) {
    return <Unauthorized message="You don't have permission to view the Users page." />;
  }

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <ErrorState message="Failed to load users" onRetry={refetch} />;

  const { users, roles } = data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Users" description={`${users.length} registered user${users.length === 1 ? '' : 's'}`} />

      <Card className="overflow-hidden p-0">
        {users.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No users found" description="Registered users will appear here." className="border-0" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const targetRole = u.role.name;
                const isSuperAdminTarget = targetRole === 'SUPER_ADMIN';
                const canEdit = can(actorRole, 'users.update') && canActOnTarget(actorRole, targetRole);
                const canChangeRole = can(actorRole, 'users.updateRole') && canActOnTarget(actorRole, targetRole);
                const canDelete =
                  can(actorRole, 'users.delete') && canActOnTarget(actorRole, targetRole) && u.id !== actorId;

                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={isSuperAdminTarget ? 'default' : 'outline'} className="capitalize">
                        {roleLabel(targetRole)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          disabled={!canEdit && !canChangeRole}
                          title={
                            !canEdit && !canChangeRole
                              ? "You can't modify a Super Admin account"
                              : 'Edit user'
                          }
                          onClick={() => setEditTarget(u)}
                        >
                          {!canEdit && !canChangeRole ? (
                            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Pencil className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={!canDelete}
                          title={
                            u.id === actorId
                              ? "You can't delete your own account"
                              : !canDelete
                                ? 'Only Super Admin can delete users'
                                : 'Delete user'
                          }
                          onClick={() => setDeleteTarget(u)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {editTarget && (
        <EditUserDialog
          user={editTarget}
          roles={roles}
          canChangeRole={can(actorRole, 'users.updateRole') && canActOnTarget(actorRole, editTarget.role.name)}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            refetch();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteUserDialog
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

function EditUserDialog({
  user,
  roles,
  canChangeRole,
  onClose,
  onSaved,
}: {
  user: UserRow;
  roles: RoleRow[];
  canChangeRole: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = React.useState(user.name ?? '');
  const [roleId, setRoleId] = React.useState(user.role.id);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/dashboard/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name,
          ...(canChangeRole && roleId !== user.role.id ? { roleId } : {}),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Unable to update user');
      }

      toast.success('User updated successfully.');
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} disabled={saving} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select value={roleId} onValueChange={setRoleId} disabled={!canChangeRole || saving}>
              <SelectTrigger id="edit-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {roleLabel(r.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!canChangeRole && (
              <p className="text-xs text-muted-foreground">Only a Super Admin can change roles.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteUserDialog({
  user,
  onClose,
  onDeleted,
}: {
  user: UserRow;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/users?id=${encodeURIComponent(user.id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Unable to delete user');
      }

      toast.success('User deleted successfully.');
      onDeleted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to delete user.');
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open onOpenChange={(open) => !open && !deleting && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {user.name ?? user.email}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the user account. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}