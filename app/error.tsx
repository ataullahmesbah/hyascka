'use client';

import { ErrorState } from '@/components/error-state';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState variant="500" onRetry={reset} />;
}
