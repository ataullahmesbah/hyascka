'use client';

// FILE: components/dashboard/unauthorized.tsx

import * as React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UnauthorizedProps {
    title?: string;
    message?: string;
    className?: string;
}

/**
 * Shown when a user is authenticated but lacks the role/permission for
 * the current page or action — distinct from being logged out (that case
 * never reaches a page; middleware redirects to /login first).
 */
export function Unauthorized({
    title = "You don't have access to this",
    message = "Your account doesn't have permission to view this page. If you think this is a mistake, contact your administrator.",
    className,
}: UnauthorizedProps) {
    return (
        <Card className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
                <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mt-4 text-base font-medium">{title}</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
        </Card>
    );
}