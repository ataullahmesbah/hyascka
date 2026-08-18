'use client';
// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: components/dashboard/dashboard-sidebar.tsx
// ==========================================================

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboardNavGroups, dashboardAccountItems, type DashboardRole } from '@/constants/dashboard-nav';
import { Logo } from './logo';

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
  userRole: DashboardRole;
}

export function DashboardSidebar({ open, onClose, userRole }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const filterItems = (items: typeof dashboardNavGroups[0]['items']) =>
    items.filter((item) => !item.roles || item.roles.includes(userRole));

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <Logo />
          <span className="font-display text-base font-semibold tracking-tight">HYASCKA</span>
        </Link>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {dashboardNavGroups.map((group) => {
          const items = filterItems(group.items);
          if (items.length === 0) return null;
          return (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                          />
                        )}
                        <item.icon className={cn('h-4 w-4 shrink-0', active && 'text-primary')} />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border/60 px-3 py-3">
        <ul className="space-y-0.5">
          {dashboardAccountItems.map((item) => {
            const active = isActive(item.href);
            // '/api/auth/logout' is a sentinel href (see dashboard-nav.ts) —
            // it needs next-auth's signOut() for real session invalidation,
            // not client-side navigation to a route that doesn't exist.
            const isLogout = item.href === '/api/auth/logout';
            return (
              <li key={item.href}>
                {isLogout ? (
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/60 bg-card/40 backdrop-blur-xl lg:block">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card shadow-soft-lg lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
