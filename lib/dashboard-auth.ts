// FILE: lib/dashboard-auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { RoleName } from '@prisma/client';
import { can, type Capability, type Role } from '@/lib/permissions';

/**
 * Centralized server-side authorization for the dashboard. This is the
 * ONLY place API routes / server components should pull role/permission
 * checks from — do not inline role arrays elsewhere (that's how EDITOR
 * ended up referenced in code without existing in the schema before).
 *
 * Role-capability data itself lives in lib/permissions.ts; this file is
 * purely the "fetch the session/user and enforce it" layer.
 */

// Kept for any existing call sites during Phase 1 migration; prefer
// `requirePermission()` for new code, which is capability- not role-based.
export const DASHBOARD_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'CLIENT', 'USER'];
export const EDITOR_ROLES: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'];
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

/** Authenticated, no role/permission requirement. */
export async function requireAuth() {
  const user = await getDashboardUser();
  return user;
}

/** Authenticated + role must be one of `allowedRoles`. */
export async function requireRole(allowedRoles: RoleName[]) {
  const user = await getDashboardUser();
  if (!user) return { user: null, authorized: false as const };
  return {
    user,
    authorized: allowedRoles.includes(user.role.name as RoleName),
  };
}

/**
 * Authenticated + must hold `capability` per lib/permissions.ts. Prefer
 * this over requireRole() for new routes — it keeps authorization tied to
 * "what can this role do" (defined once, centrally) rather than a
 * hand-rolled role list per route.
 */
export async function requirePermission(capability: Capability) {
  const user = await getDashboardUser();
  if (!user) return { user: null, authorized: false as const };
  return {
    user,
    authorized: can(user.role.name as Role, capability),
  };
}

/**
 * Authenticated + owns the resource. `ownerId` is whatever the resource
 * record actually stores as its owning user's id — always read that from
 * the database, never trust a client-supplied id.
 *
 * `bypassRoles` lets internal roles (e.g. SUPER_ADMIN, ADMIN) act on any
 * resource regardless of ownership — pass an empty array to require strict
 * ownership with no bypass.
 *
 * Usage:
 *   const project = await prisma.project.findUnique({ where: { id } });
 *   if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
 *   const { authorized } = await requireOwnership(project.clientId, { bypassRoles: MANAGER_ROLES });
 *   if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
 */
export async function requireOwnership(
  ownerId: string | null | undefined,
  options: { bypassRoles?: RoleName[] } = {}
) {
  const user = await getDashboardUser();
  if (!user) return { user: null, authorized: false as const };

  const bypass = options.bypassRoles?.includes(user.role.name as RoleName) ?? false;
  const owns = !!ownerId && ownerId === user.id;

  return {
    user,
    authorized: bypass || owns,
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