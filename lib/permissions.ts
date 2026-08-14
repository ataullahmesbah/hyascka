// FILE: lib/permissions.ts
import type { RoleName } from '@prisma/client';

/**
 * Single source of truth for role-based access across the HYASCKA
 * dashboard. Consumed by:
 *  - lib/dashboard-auth.ts (server-side requireRole/requirePermission/requireOwnership)
 *  - constants/dashboard-nav.ts (UI-only nav visibility)
 *  - individual API routes / server components
 *
 * IMPORTANT: The checks here are cheap booleans safe to import anywhere
 * (server or client), but enforcement must always happen server-side.
 * Hiding a nav item or button is UX only — it is never authorization.
 *
 * GUEST is intentionally excluded from `Role`. The database enum still
 * contains it (removing a Postgres enum value is a destructive migration
 * and nothing assigns GUEST today), but no application code should ever
 * check for or grant it — `Role` below statically prevents that.
 */

export type Role = Exclude<RoleName, 'GUEST'>;

export const ALL_ROLES: Role[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'CLIENT', 'USER'];

/**
 * Capabilities required by the current phase of the HYASCKA dashboard.
 * Add new capabilities here as each phase introduces new modules — do not
 * duplicate this table or re-check `role === 'X'` inline elsewhere.
 */
export const PERMISSIONS = {
  // --- Dashboard shell ---
  'dashboard.view': ALL_ROLES, // everyone lands on /dashboard; the UI itself branches per role
  'dashboard.viewAgencyOverview': ['SUPER_ADMIN', 'ADMIN'] as Role[], // agency-wide Users/Projects/Blogs/Contacts stats
  'dashboard.viewModeratorOverview': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] as Role[], // leads-focused, no user-management data
  'dashboard.viewEditorOverview': ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as Role[], // content-focused (draft/published counts)

  // --- Users (Phase 1: user management foundation) ---
  'users.read': ['SUPER_ADMIN', 'ADMIN'] as Role[],
  'users.create': ['SUPER_ADMIN'] as Role[],
  'users.update': ['SUPER_ADMIN', 'ADMIN'] as Role[], // name + active/suspended status only
  'users.updateRole': ['SUPER_ADMIN'] as Role[], // reassigning a user's role — ADMIN cannot do this
  'users.delete': ['SUPER_ADMIN'] as Role[],

  // --- Clients (foundation only — no Client model yet, capability reserved for the next phase) ---
  'clients.read': ['SUPER_ADMIN', 'ADMIN'] as Role[],
  'clients.create': ['SUPER_ADMIN', 'ADMIN'] as Role[],
  'clients.update': ['SUPER_ADMIN', 'ADMIN'] as Role[],

  // --- Leads (Phase 3: Contact model doubles as Lead — see schema comment) ---
  'leads.read': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] as Role[],
  'leads.read_own': ['USER'] as Role[], // a USER may see contact requests they personally submitted while logged in
  'leads.update': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] as Role[], // status changes
  'leads.assign': ['SUPER_ADMIN', 'ADMIN'] as Role[],
  'leads.inviteClient': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] as Role[], // same roles as offers.create — inviting a client is part of the same offer workflow

  // --- Custom Offers (Phase 3) ---
  'offers.read': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] as Role[],
  'offers.read_own': ['CLIENT', 'USER'] as Role[],
  'offers.create': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] as Role[],
  'offers.send': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] as Role[],
  'offers.cancel': ['SUPER_ADMIN', 'ADMIN'] as Role[],
  'offers.respond_own': ['CLIENT', 'USER'] as Role[], // accept/reject an offer addressed to them

  // --- Services (existing Service model) ---
  'services.read': ALL_ROLES,
  'services.create': ['SUPER_ADMIN', 'ADMIN'] as Role[],
  'services.update': ['SUPER_ADMIN', 'ADMIN'] as Role[], // includes publish/archive status changes
  'services.categories.manage': ['SUPER_ADMIN', 'ADMIN'] as Role[],

  // --- Orders (Phase 2: real Order model) ---
  'orders.read': ['SUPER_ADMIN', 'ADMIN'] as Role[], // agency-wide order visibility
  'orders.read_own': ['CLIENT', 'USER'] as Role[], // a CLIENT/USER may only read orders requireOwnership() confirms belong to them
  'orders.create_own': ['CLIENT', 'USER'] as Role[], // checkout — creates an order owned by the requester
  'orders.update': ['SUPER_ADMIN', 'ADMIN'] as Role[], // status transitions (not price/amount — server-computed only)

  // --- Payments (Phase 2: real Payment model, MANUAL provider today) ---
  'payments.read': ['SUPER_ADMIN', 'ADMIN'] as Role[],
  'payments.confirm': ['SUPER_ADMIN', 'ADMIN'] as Role[], // manually mark a MANUAL payment as PAID

  // --- Invoices (Phase 2: real Invoice model) ---
  'invoices.read': ['SUPER_ADMIN', 'ADMIN'] as Role[],
  'invoices.read_own': ['CLIENT', 'USER'] as Role[],

  // --- Client Services (Phase 2: real ClientService model) ---
  'clientServices.read_own': ['CLIENT', 'USER'] as Role[],

  // --- Content (Blog/CMS — foundation capability only; module build-out is a later phase) ---
  'content.read': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'] as Role[],
  'content.create': ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as Role[],
  'content.update': ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as Role[],
  'content.publish': ['SUPER_ADMIN', 'ADMIN'] as Role[], // EDITOR can create/update but not publish by default (see below)
  'content.delete': ['SUPER_ADMIN', 'ADMIN'] as Role[],

  // --- Messages / Notifications (foundation capability only; module build-out is a later phase) ---
  'messages.read': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'CLIENT', 'USER'] as Role[],
  'messages.create': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'CLIENT', 'USER'] as Role[],
  'notifications.read': ALL_ROLES,
} as const;

export type Capability = keyof typeof PERMISSIONS;

export function can(role: Role | RoleName | null | undefined, capability: Capability): boolean {
  if (!role || role === 'GUEST') return false;
  return (PERMISSIONS[capability] as readonly Role[]).includes(role as Role);
}

/**
 * SUPER_ADMIN accounts can never be modified by an ADMIN (role changes,
 * suspension, deletion, session termination). Use alongside `can(role, 'users.update')`
 * when deciding whether an action is allowed against a specific target user:
 *
 *   const allowed = can(actorRole, 'users.update') && canActOnTarget(actorRole, targetRole);
 */
export function canActOnTarget(actorRole: Role, targetRole: Role): boolean {
  if (actorRole === 'SUPER_ADMIN') return true;
  if (actorRole === 'ADMIN') return targetRole !== 'SUPER_ADMIN';
  return false;
}

/**
 * Whether an EDITOR-authored piece of content can be published directly.
 * Kept as its own function (rather than folded into `content.publish`)
 * because the product requirement is explicitly permission-based per user,
 * not purely role-based: "make publishing permission-based so SUPER_ADMIN
 * can grant publish permission later." For Phase 1 this is a role-level
 * default (EDITOR: false); a later phase can extend this to check a
 * per-user grant once that data model exists.
 */
export function canPublishContent(role: Role): boolean {
  return can(role, 'content.publish');
}

/** Human-readable label for a role, e.g. for the UserMenu badge and Users table. */
export function roleLabel(role: Role | RoleName): string {
  return role.replace(/_/g, ' ').toLowerCase();
}