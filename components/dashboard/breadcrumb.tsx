'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Crumb {
  label: string;
  href?: string;
}

function buildBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return [{ label: 'Dashboard' }];

  const crumbs: Crumb[] = [{ label: 'Dashboard', href: '/dashboard' }];

  let path = '';
  for (let i = 1; i < segments.length; i++) {
    path += '/' + segments[i];
    const label = segments[i]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const isLast = i === segments.length - 1;
    crumbs.push({ label, href: isLast ? undefined : path });
  }

  return crumbs;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Dashboard</span>
      </Link>
      {crumbs.slice(1).map((crumb, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className={cn('font-medium text-foreground')}>{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
