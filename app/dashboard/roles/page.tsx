'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, MoreHorizontal, Edit, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const roles = [
  { id: '1', name: 'SUPER_ADMIN', description: 'Full system access', users: 1, color: 'bg-destructive/10 text-destructive' },
  { id: '2', name: 'ADMIN', description: 'Administrative access', users: 2, color: 'bg-primary/10 text-primary' },
  { id: '3', name: 'MODERATOR', description: 'Content moderation', users: 1, color: 'bg-accent/10 text-accent' },
  { id: '4', name: 'CLIENT', description: 'Client portal access', users: 2, color: 'bg-success/10 text-success' },
  { id: '5', name: 'USER', description: 'Standard user access', users: 3, color: 'bg-secondary text-muted-foreground' },
  { id: '6', name: 'GUEST', description: 'Limited guest access', users: 0, color: 'bg-muted text-muted-foreground' },
];

const permissions = [
  { name: 'Create', super_admin: true, admin: true, moderator: true, client: false, user: false, guest: false },
  { name: 'Read', super_admin: true, admin: true, moderator: true, client: true, user: true, guest: true },
  { name: 'Update', super_admin: true, admin: true, moderator: true, client: false, user: false, guest: false },
  { name: 'Delete', super_admin: true, admin: true, moderator: false, client: false, user: false, guest: false },
  { name: 'Publish', super_admin: true, admin: true, moderator: true, client: false, user: false, guest: false },
  { name: 'Approve', super_admin: true, admin: true, moderator: true, client: false, user: false, guest: false },
  { name: 'Manage Settings', super_admin: true, admin: false, moderator: false, client: false, user: false, guest: false },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage role-based access control."
        action={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {roles.map((role, i) => (
          <motion.div key={role.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="transition-all hover:shadow-soft-md">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', role.color)}>
                    <Shield className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{role.users} users</Badge>
                </div>
                <p className="text-sm font-semibold">{role.name.replace('_', ' ')}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{role.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader className="p-5">
          <CardTitle className="text-base font-semibold">Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Permission</th>
                {roles.map((role) => (
                  <th key={role.id} className="pb-3 text-center text-xs font-medium text-muted-foreground">
                    {role.name.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, i) => (
                <motion.tr
                  key={perm.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50"
                >
                  <td className="py-3 text-sm font-medium">{perm.name}</td>
                  {[perm.super_admin, perm.admin, perm.moderator, perm.client, perm.user, perm.guest].map((allowed, j) => (
                    <td key={j} className="py-3 text-center">
                      {allowed ? (
                        <Check className="mx-auto h-4 w-4 text-success" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
