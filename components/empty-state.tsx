import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { type LucideIcon, SearchX, ArrowRight } from 'lucide-react';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center',
        className
      )}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-soft">
          <Icon className="h-7 w-7 text-muted-foreground" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Button asChild size="sm" className="group gap-2 rounded-btn">
            <Link href={actionHref}>
              {actionLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        ) : (
          <Button size="sm" onClick={onAction} className="group gap-2 rounded-btn">
            {actionLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )
      )}
    </div>
  );
}
