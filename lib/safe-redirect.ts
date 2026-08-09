/**
 * Validates that a callback URL is a safe, internal, relative path before
 * it is used as a redirect target. Prevents open-redirect vulnerabilities
 * (absolute URLs, protocol-relative URLs, or embedded scheme handlers).
 */
export function getSafeCallbackUrl(
    url: string | null | undefined,
    fallback = '/'
): string {
    if (!url) return fallback;

    // Must be a relative, single-slash internal path (blocks "//evil.com", "http://...", etc.)
    if (!url.startsWith('/') || url.startsWith('//')) return fallback;

    try {
        const decoded = decodeURIComponent(url);
        if (decoded.includes('://') || decoded.startsWith('//')) return fallback;
    } catch {
        return fallback;
    }

    return url;
}