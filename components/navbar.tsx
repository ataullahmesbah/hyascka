'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { navLinks } from '@/constants/navigation';
import { UserMenu } from './auth/user-menu';

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

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
            <Logo />
            <span className="font-display text-lg font-semibold tracking-tight">HYASCKA</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
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
            ))}
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
              className="relative flex h-full flex-col px-5 pb-10 pt-24 tab:px-8"
            >
              <ul className="flex flex-col gap-1">
                {[...navLinks, { label: 'Contact', href: '/contact' }].map((l, i) => (
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
                ))}
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

function Logo() {
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-btn bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-soft">
      <span className="absolute inset-0 bg-grid-sm opacity-30" />
      <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" aria-hidden>
        <path
          d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="12" cy="12" r="3.4" fill="currentColor" />
      </svg>
    </span>
  );
}