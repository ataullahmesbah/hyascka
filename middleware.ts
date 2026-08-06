export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/profile/:path*',
    '/settings/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
