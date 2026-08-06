'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  accent?: 'primary' | 'accent' | 'success' | 'warning' | 'destructive';
  delay?: number;
}

const accentMap = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-amber-500/10 text-amber-500',
  destructive: 'bg-destructive/10 text-destructive',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  accent = 'primary',
  delay = 0,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="relative overflow-hidden p-5 transition-shadow hover:shadow-soft-md">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</p>
            {change !== undefined && (
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    isPositive ? 'text-success' : 'text-destructive'
                  )}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(change)}%
                </span>
                {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
              </div>
            )}
          </div>
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', accentMap[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
