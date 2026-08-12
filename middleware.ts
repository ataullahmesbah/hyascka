import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { getSafeCallbackUrl } from './lib/safe-redirect';


const PROTECTED_PREFIXES = ['/dashboard', '/profile', '/settings', '/admin', '/checkout'];
const AUTH_PAGES = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p);

  // Not authenticated + protected route -> send to /login, remembering the
  // exact page (path + query) the user originally wanted.
  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated + visiting /login or /register -> don't show the
  // auth form again. Respect an explicit callbackUrl if present, otherwise
  // fall back to the dashboard (there is nothing else useful to do on
  // /login once you're already signed in).
  if (isAuthPage && token) {
    const requestedCallback = getSafeCallbackUrl(
      req.nextUrl.searchParams.get('callbackUrl'),
      '/dashboard'
    );
    const target = new URL(requestedCallback, req.url);
    target.searchParams.set('notice', 'already-logged-in');
    return NextResponse.redirect(target);
  }

  // Pass the current pathname downstream so server components (e.g. nested
  // dashboard layouts) can build an accurate callback URL without
  // duplicating this logic or hardcoding a fallback path.
  const res = NextResponse.next();
  res.headers.set('x-pathname', pathname);
  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/checkout',
    '/login',
    '/register',
  ],
};