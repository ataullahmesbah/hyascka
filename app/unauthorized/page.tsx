import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 pt-20 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 rounded-3xl bg-destructive/10 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-card shadow-soft-lg">
          <ShieldAlert className="h-9 w-9 text-destructive" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          403
        </span>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Access Denied
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
          You don't have permission to access this page. Please contact an administrator if you
          believe this is an error.
        </p>
      </div>

      <Button asChild className="gap-2">
        <Link href="/">
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </Button>
    </div>
  );
}
