import type { RoleName } from '@prisma/client';

/**
 * Single source of truth for role-based access in the agency dashboard.
 *
 * IMPORTANT: This module is safe to import in both server code (API routes,
 * server components) and client components. The capability CHECKS here are
 * cheap booleans — the actual enforcement must always happen server-side
 * (in API routes / server components) using the session's role from the
 * database-backed JWT, never a role value supplied by the client.
 */

export type Role = RoleName; // 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'CLIENT' | 'USER' | 'GUEST'

/**
 * Capabilities available to each role. Add new capabilities here rather
 * than sprinkling `role === 'SUPER_ADMIN'` checks across the codebase —
 * that's how the Admin/Super Admin rules stay consistent everywhere.
 */
export const PERMISSIONS = {
    // --- User management (the Users page) ---
    viewAllUsers: ['SUPER_ADMIN', 'ADMIN'] as Role[],
    deleteUser: ['SUPER_ADMIN'] as Role[],
    editUserRole: ['SUPER_ADMIN'] as Role[],
    toggleUserActive: ['SUPER_ADMIN', 'ADMIN'] as Role[], // both can activate/deactivate...
    terminateUserSessions: ['SUPER_ADMIN'] as Role[],

    // --- Revenue / billing ---
    viewRevenue: ['SUPER_ADMIN', 'ADMIN'] as Role[],
    manageInvoices: ['SUPER_ADMIN', 'ADMIN'] as Role[],
    viewPayoutSettings: ['SUPER_ADMIN'] as Role[],

    // --- System ---
    viewAuditLogs: ['SUPER_ADMIN'] as Role[],
    manageAppearance: ['SUPER_ADMIN'] as Role[],
} as const;

export type Capability = keyof typeof PERMISSIONS;

export function can(role: Role | null | undefined, capability: Capability): boolean {
    if (!role) return false;
    return (PERMISSIONS[capability] as readonly Role[]).includes(role);
}

/**
 * SUPER_ADMIN accounts are protected from being modified by an ADMIN.
 * An ADMIN can toggle active/inactive for ordinary users, but never for
 * a SUPER_ADMIN account — use this alongside `can(role, 'toggleUserActive')`
 * when deciding whether an action button should be enabled.
 *
 *   const allowed =
 *     can(actorRole, 'toggleUserActive') && canActOnTarget(actorRole, targetRole);
 */
export function canActOnTarget(actorRole: Role, targetRole: Role): boolean {
    if (actorRole === 'SUPER_ADMIN') return true;
    if (actorRole === 'ADMIN') return targetRole !== 'SUPER_ADMIN';
    return false;
}

/**
 * Human-readable label for a role, used in the UserMenu badge and the
 * Users table. Keep label formatting here instead of re-implementing
 * `role.replace('_',' ').toLowerCase()` in every component.
 */
export function roleLabel(role: Role): string {
    return role.replace(/_/g, ' ').toLowerCase();
}