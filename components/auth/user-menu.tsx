'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Reusable authenticated-user control for the Navbar (and anywhere else
 * that needs it). Reads auth state from the existing NextAuth session —
 * it does not implement its own auth or authorization logic. Hiding
 * Dashboard/Profile here is a UX convenience only; those routes are
 * independently protected by middleware.ts and their own server checks.
 */
export function UserMenu() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    // Avoid a layout-shifting flash while the session is resolving.
    if (status === 'loading') {
        return <div className="h-9 w-9 animate-pulse rounded-full bg-secondary" aria-hidden />;
    }

    if (status === 'unauthenticated' || !session?.user) {
        return (
            <button
                type="button"
                onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Sign in"
                title="Sign in"
            >
                <UserIcon className="h-4 w-4" />
            </button>
        );
    }

    const { name, email, image, role } = session.user;
    const initials = name
        ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : email?.[0]?.toUpperCase() ?? 'U';
    const roleLabel = role ? role.replace(/_/g, ' ').toLowerCase() : '';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/40 hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                    aria-label={`Account menu for ${name ?? email}`}
                    title={name ?? email ?? 'Account'}
                >
                    <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={image ?? undefined} alt={name ?? 'User avatar'} />
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={10} className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-foreground">{name ?? 'User'}</span>
                    {email && <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>}
                    {roleLabel && (
                        <span className="mt-1 inline-flex w-fit items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                            {roleLabel}
                        </span>
                    )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex cursor-pointer items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex cursor-pointer items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                    className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}