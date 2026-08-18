'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/auth/user-menu';
import { cn } from '@/lib/utils';
import { navLinks } from '@/constants/navigation';
import { BrandLogo } from './brand-logo';

export interface NavServiceGroup {
  id: string;
  name: string;
  slug: string;
  services: { id: string; title: string; slug: string }[];
}

interface NavbarProps {
  /** Active service groups + published services, for the Services
   * mega-menu. Fetched server-side in app/layout.tsx — this component
   * never queries the database itself (it's a client component). Empty
   * array is a safe fallback (falls back to a plain link to /services). */
  serviceGroups?: NavServiceGroup[];
}

export function Navbar({ serviceGroups = [] }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = React.useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const servicesMenuRef = React.useRef<HTMLLIElement>(null);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close the Services dropdown on outside click and on Escape — required
  // for keyboard users, not just a hover convenience.
  React.useEffect(() => {
    if (!servicesOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [servicesOpen]);

  React.useEffect(() => {
    setServicesOpen(false);
    setMobileServicesOpen(false);
    setOpen(false);
  }, [pathname]);

  const cancelClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => setServicesOpen(false), 150);
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-border/60 bg-background/75 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 tab:px-8 lg:h-[4.5rem] lg:px-12">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="HYASCKA home">
            <BrandLogo className="rounded-btn" />

          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              if (l.href === '/services') {
                return (
                  <li key={l.href} ref={servicesMenuRef} className="relative">
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      onClick={() => setServicesOpen((v) => !v)}
                      onMouseEnter={() => {
                        cancelClose();
                        setServicesOpen(true);
                      }}
                      onMouseLeave={scheduleClose}
                      className={cn(
                        'flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                        isActive(l.href) || servicesOpen
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      )}
                    >
                      {l.label}
                      <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', servicesOpen && 'rotate-180')} />
                      {isActive(l.href) && (
                        <motion.span
                          layoutId="nav-active"
                          className="ml-0.5 inline-block h-1 w-1 rounded-full bg-primary align-middle"
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          onMouseEnter={cancelClose}
                          onMouseLeave={scheduleClose}
                          role="menu"
                          className="absolute left-1/2 top-full mt-3 w-[min(90vw,760px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover shadow-soft-lg"
                        >
                          {serviceGroups.length === 0 ? (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                              <Link href="/services" className="text-primary hover:underline" onClick={() => setServicesOpen(false)}>
                                Browse all services
                              </Link>
                            </div>
                          ) : (
                            <div className="grid max-h-[33vh] grid-cols-2 gap-x-8 gap-y-6 overflow-y-auto p-6 sm:grid-cols-3">
                              {serviceGroups.map((group) => (
                                <div key={group.id}>
                                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                                    {group.name}
                                  </p>
                                  <ul className="mt-3 flex flex-col gap-2.5">
                                    {group.services.map((s) => (
                                      <li key={s.id}>
                                        <Link
                                          href={`/services/${s.slug}`}
                                          onClick={() => setServicesOpen(false)}
                                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                          {s.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="border-t border-border/60 bg-secondary/30 px-6 py-3">
                            <Link
                              href="/services"
                              onClick={() => setServicesOpen(false)}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                              View all services
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                      isActive(l.href)
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    {l.label}
                    {isActive(l.href) && (
                      <motion.span
                        layoutId="nav-active"
                        className="ml-1.5 inline-block h-1 w-1 rounded-full bg-primary align-middle"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Button asChild size="sm" className="group gap-1.5 rounded-btn">
              <Link href="/contact">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <UserMenu />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <UserMenu />
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-border bg-background/60 text-foreground"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <motion.div
          style={{ scaleX }}
          className="h-px origin-left bg-gradient-to-r from-primary via-accent to-primary"
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative flex h-full flex-col overflow-y-auto px-5 pb-10 pt-24 tab:px-8"
            >
              <ul className="flex flex-col gap-1">
                {[...navLinks, { label: 'Contact', href: '/contact' }].map((l, i) => {
                  if (l.href === '/services') {
                    return (
                      <motion.li
                        key={l.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05 }}
                        className="border-b border-border/60"
                      >
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen((v) => !v)}
                          aria-expanded={mobileServicesOpen}
                          className={cn(
                            'flex w-full items-center justify-between py-4 font-display text-2xl font-medium tracking-tight',
                            isActive(l.href) && 'text-primary'
                          )}
                        >
                          {l.label}
                          <ChevronDown className={cn('h-5 w-5 transition-transform', mobileServicesOpen && 'rotate-180')} />
                        </button>
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-4 pb-4 pl-1">
                                {serviceGroups.length === 0 ? (
                                  <Link href="/services" onClick={() => setOpen(false)} className="text-base text-muted-foreground">
                                    Browse all services
                                  </Link>
                                ) : (
                                  serviceGroups.map((group) => (
                                    <div key={group.id}>
                                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                                        {group.name}
                                      </p>
                                      <ul className="mt-2 flex flex-col gap-2">
                                        {group.services.map((s) => (
                                          <li key={s.id}>
                                            <Link
                                              href={`/services/${s.slug}`}
                                              onClick={() => setOpen(false)}
                                              className="text-base text-muted-foreground"
                                            >
                                              {s.title}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))
                                )}
                                <Link href="/services" onClick={() => setOpen(false)} className="text-sm font-medium text-primary">
                                  View all services →
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  }

                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center justify-between border-b border-border/60 py-4 font-display text-2xl font-medium tracking-tight',
                          isActive(l.href) && 'text-primary'
                        )}
                      >
                        {l.label}
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-auto flex flex-col gap-3">
                <Button asChild size="lg" className="rounded-btn">
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
