'use client';

import * as React from 'react';
import { Palette, Save, Moon, Sun, Monitor, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { PageHeader } from '@/components/dashboard/page-header';
import { cn } from '@/lib/utils';

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Appearance" description="Customize the look and feel of your dashboard." />

      <Card>
        <CardHeader className="p-5"><CardTitle className="text-base font-semibold">Theme</CardTitle></CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <Label>Choose your preferred theme mode</Label>
          <div className="grid gap-4 sm:grid-cols-3">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                  mounted && theme === t.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40'
                )}
              >
                {mounted && theme === t.value && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl',
                  t.value === 'light' && 'bg-amber-100 text-amber-600',
                  t.value === 'dark' && 'bg-slate-800 text-slate-200',
                  t.value === 'system' && 'bg-secondary text-muted-foreground'
                )}>
                  <t.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-5"><CardTitle className="text-base font-semibold">Color Preview</CardTitle></CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: 'Primary', className: 'bg-primary' },
              { name: 'Accent', className: 'bg-accent' },
              { name: 'Success', className: 'bg-success' },
              { name: 'Warning', className: 'bg-amber-500' },
              { name: 'Destructive', className: 'bg-destructive' },
              { name: 'Muted', className: 'bg-muted' },
            ].map((color) => (
              <div key={color.name} className="flex flex-col items-center gap-2">
                <div className={cn('h-16 w-full rounded-xl', color.className)} />
                <span className="text-xs font-medium text-muted-foreground">{color.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2"><Save className="h-4 w-4" /> Save Preferences</Button>
      </div>
    </div>
  );
}
