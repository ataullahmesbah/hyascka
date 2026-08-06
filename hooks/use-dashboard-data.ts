'use client';

import * as React from 'react';

interface UseDashboardDataOptions {
  revalidateOnFocus?: boolean;
}

interface UseDashboardDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData<T>(
  url: string | null,
  options: UseDashboardDataOptions = {}
): UseDashboardDataResult<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refetchKey, setRefetchKey] = React.useState(0);

  const refetch = React.useCallback(() => setRefetchKey((k) => k + 1), []);

  React.useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? 'Failed to fetch data');
        }
        const json = await res.json();
        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    if (options.revalidateOnFocus) {
      window.addEventListener('focus', fetchData);
      return () => {
        cancelled = true;
        window.removeEventListener('focus', fetchData);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [url, refetchKey, options.revalidateOnFocus]);

  return { data, loading, error, refetch };
}
