import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // middleware.ts already handles this redirect for normal navigation and
    // preserves the exact callback URL. This check only runs as a fallback
    // (e.g. if a session expires between the middleware check and render),
    // so we reuse the pathname middleware forwarded instead of hardcoding one.
    const pathname = headers().get('x-pathname') ?? '/dashboard';
    redirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}