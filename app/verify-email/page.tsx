'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

const hasVerified = React.useRef(false);

 React.useEffect(() => {
  if (!token) {
    setStatus('error');
    return;
  }

  if (hasVerified.current) return;

  hasVerified.current = true;

  fetch(`/api/verify-email?token=${encodeURIComponent(token)}`, {
    method: 'POST',
  })
    .then((res) => {
      if (res.ok) setStatus('success');
      else setStatus('error');
    })
    .catch(() => setStatus('error'));
}, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-5 pt-20">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft-lg">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h1 className="mt-4 font-display text-xl font-semibold">Verifying your email...</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h1 className="mt-4 font-display text-xl font-semibold">Email verified!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your email has been verified. You can now log in to your account.
            </p>
            <Link href="/login" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 font-display text-xl font-semibold">Verification failed</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The verification link is invalid or has expired.
            </p>
            <Link href="/login" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
