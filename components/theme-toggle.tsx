'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  // Render a stable placeholder until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex h-9 items-center gap-1 rounded-btn border border-border bg-background/60 px-1.5">
        {options.map((o) => (
          <span key={o.value} className="flex h-7 w-7 items-center justify-center opacity-40">
            <o.icon className="h-4 w-4" />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex h-9 items-center gap-1 rounded-btn border border-border bg-background/60 p-1 backdrop-blur-sm"
      role="radiogroup"
      aria-label="Theme"
    >
      {options.map((o) => {
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            onClick={() => setTheme(o.value)}
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-[8px] transition-all duration-200',
              active
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <o.icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
