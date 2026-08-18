// ==========================================================
// NEW FILE
// LOCATION: lib/__tests__/permissions.test.ts
// ==========================================================
import { describe, expect, it } from 'vitest';
import { can, canActOnTarget, canPublishContent, roleLabel } from '@/lib/permissions';

describe('can', () => {
  it('grants access to a role listed for the capability', () => {
    expect(can('SUPER_ADMIN', 'users.delete')).toBe(true);
    expect(can('ADMIN', 'users.read')).toBe(true);
  });

  it('denies access to a role not listed for the capability', () => {
    expect(can('ADMIN', 'users.delete')).toBe(false);
    expect(can('CLIENT', 'users.read')).toBe(false);
  });

  it('denies GUEST for every capability, even dashboard.view', () => {
    expect(can('GUEST', 'dashboard.view')).toBe(false);
  });

  it('denies a null/undefined role', () => {
    expect(can(null, 'services.read')).toBe(false);
    expect(can(undefined, 'services.read')).toBe(false);
  });
});

describe('canActOnTarget', () => {
  it('lets SUPER_ADMIN act on anyone, including another SUPER_ADMIN', () => {
    expect(canActOnTarget('SUPER_ADMIN', 'SUPER_ADMIN')).toBe(true);
    expect(canActOnTarget('SUPER_ADMIN', 'ADMIN')).toBe(true);
  });

  it('never lets ADMIN act on a SUPER_ADMIN', () => {
    expect(canActOnTarget('ADMIN', 'SUPER_ADMIN')).toBe(false);
  });

  it('lets ADMIN act on non-SUPER_ADMIN roles', () => {
    expect(canActOnTarget('ADMIN', 'EDITOR')).toBe(true);
  });

  it('denies every other actor role', () => {
    expect(canActOnTarget('EDITOR', 'USER')).toBe(false);
  });
});

describe('canPublishContent', () => {
  it('matches the content.publish capability list', () => {
    expect(canPublishContent('ADMIN')).toBe(true);
    expect(canPublishContent('EDITOR')).toBe(false);
  });
});

describe('roleLabel', () => {
  it('lowercases and replaces underscores with spaces', () => {
    expect(roleLabel('SUPER_ADMIN')).toBe('super admin');
    expect(roleLabel('CLIENT')).toBe('client');
  });
});
