-- FILE: prisma/migrations/20260810224619_add_editor_role/migration.sql
-- Phase 1 RBAC: add EDITOR to the RoleName enum.
--
-- EDITOR is already referenced live in application code
-- (constants/dashboard-nav.ts, app/dashboard/page.tsx,
-- app/api/dashboard/blog/route.ts, app/api/dashboard/projects/route.ts)
-- but was missing from the database enum, making those checks dead code
-- (no user could ever actually hold the EDITOR role). This migration adds
-- it without touching any existing enum values or data.
--
-- GUEST is intentionally left in the enum. Per the target architecture it
-- should never be assigned to an authenticated user going forward, but
-- removing an enum value in Postgres requires recreating the type and
-- rewriting every dependent column — an unnecessarily destructive change
-- for Phase 1 since nothing currently assigns GUEST. Enforcement that
-- GUEST is never used lives in the application layer (lib/permissions.ts).

ALTER TYPE "RoleName" ADD VALUE IF NOT EXISTS 'EDITOR';