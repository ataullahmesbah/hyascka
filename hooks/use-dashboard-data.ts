'use client';

import * as React from 'react';

interface UseDashboardDataOptions {
  revalidateOnFocus?: boolean;
  /** Re-fetch on this interval (ms) while the tab is visible — e.g. for the
   * notification bell, so a new notification created elsewhere shows up
   * without the user having to trigger a manual refetch. Omit for one-shot
   * fetch-on-mount data that doesn't need to stay live. */
  pollIntervalMs?: number;
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
      if (!url) return; // re-check inside the closure so TS narrows string | null → string here
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

    const cleanups: Array<() => void> = [];

    if (options.revalidateOnFocus) {
      window.addEventListener('focus', fetchData);
      cleanups.push(() => window.removeEventListener('focus', fetchData));
    }

    if (options.pollIntervalMs) {
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') fetchData();
      }, options.pollIntervalMs);
      cleanups.push(() => clearInterval(interval));
    }

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [url, refetchKey, options.revalidateOnFocus, options.pollIntervalMs]);

  return { data, loading, error, refetch };
}