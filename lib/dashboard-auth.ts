import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RoleName } from '@prisma/client';

export const DASHBOARD_ROLES: RoleName[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'MODERATOR',
  'CLIENT',
  'USER',
];

export const EDITOR_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'];

export const MANAGER_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN'];

export const SUPER_ADMIN_ONLY: RoleName[] = ['SUPER_ADMIN'];

export async function getDashboardUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });
  return user;
}

export async function requireAuth() {
  const user = await getDashboardUser();
  return user;
}

export async function requireRole(allowedRoles: RoleName[]) {
  const user = await getDashboardUser();
  if (!user) return { user: null, authorized: false };
  return {
    user,
    authorized: allowedRoles.includes(user.role.name as RoleName),
  };
}

export function hasPermission(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
