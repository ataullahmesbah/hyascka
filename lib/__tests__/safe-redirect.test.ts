// ==========================================================
// NEW FILE
// LOCATION: lib/__tests__/safe-redirect.test.ts
// ==========================================================
import { describe, expect, it } from 'vitest';
import { getSafeCallbackUrl } from '@/lib/safe-redirect';

describe('getSafeCallbackUrl', () => {
  it('allows a plain internal path', () => {
    expect(getSafeCallbackUrl('/dashboard/orders')).toBe('/dashboard/orders');
  });

  it('allows an internal path with a query string', () => {
    expect(getSafeCallbackUrl('/dashboard?tab=leads')).toBe('/dashboard?tab=leads');
  });

  it('falls back when the value is missing', () => {
    expect(getSafeCallbackUrl(null)).toBe('/');
    expect(getSafeCallbackUrl(undefined)).toBe('/');
    expect(getSafeCallbackUrl('', '/dashboard')).toBe('/dashboard');
  });

  it('rejects protocol-relative URLs (//evil.com)', () => {
    expect(getSafeCallbackUrl('//evil.com')).toBe('/');
  });

  it('rejects absolute URLs with a scheme', () => {
    expect(getSafeCallbackUrl('https://evil.com')).toBe('/');
    expect(getSafeCallbackUrl('javascript:alert(1)')).toBe('/');
  });

  it('rejects a URL-encoded absolute URL smuggled in a relative path', () => {
    expect(getSafeCallbackUrl('/%2F%2Fevil.com')).toBe('/');
    expect(getSafeCallbackUrl('/redirect?to=https%3A%2F%2Fevil.com')).toBe('/');
  });

  it('uses the given fallback, not just "/"', () => {
    expect(getSafeCallbackUrl('https://evil.com', '/login')).toBe('/login');
  });
});
