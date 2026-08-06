'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  type LucideIcon,
  AlertTriangle,
  WifiOff,
  ServerCrash,
  RefreshCw,
  Home,
} from 'lucide-react';

type ErrorVariant = '500' | 'network' | 'generic';

type ErrorStateProps = {
  variant?: ErrorVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  showHome?: boolean;
  className?: string;
};

const defaults: Record<ErrorVariant, {
  icon: LucideIcon;
  code: string;
  title: string;
  description: string;
}> = {
  '500': {
    icon: ServerCrash,
    code: '500',
    title: 'Server Error',
    description: 'Something went wrong on our end. Our team has been notified — please try again in a moment.',
  },
  network: {
    icon: WifiOff,
    code: 'Network',
    title: 'Connection Lost',
    description: 'You appear to be offline. Check your internet connection and try again.',
  },
  generic: {
    icon: AlertTriangle,
    code: 'Error',
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again or return home.',
  },
};

export function ErrorState({
  variant = 'generic',
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  showHome = true,
  className,
}: ErrorStateProps) {
  const config = defaults[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 px-5 py-20 text-center',
        className
      )}
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 rounded-3xl bg-destructive/10 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-card shadow-soft-lg">
          <Icon className="h-9 w-9 text-destructive" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {config.code}
        </span>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title ?? config.title}
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
          {description ?? config.description}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {onRetry && (
          <Button onClick={onRetry} size="lg" className="group gap-2 rounded-btn">
            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
            {retryLabel}
          </Button>
        )}
        {showHome && (
          <Button asChild size="lg" variant="outline" className="gap-2 rounded-btn">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
