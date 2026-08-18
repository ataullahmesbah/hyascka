'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Github, Linkedin, Facebook, Instagram, Youtube, Twitter, Globe, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Solutions', href: '/solutions' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'Resources', href: '/resources' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Documentation', href: '/blog' },
      { label: 'FAQs', href: '/#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  },
];

const ICONS: Record<string, typeof Globe> = {
  linkedin: Linkedin,
  facebook: Facebook,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  email: Mail,
  mail: Mail,
};

export interface FooterSocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  label: string | null;
}

interface FooterProps {
  /** Active social links, fetched server-side in app/layout.tsx. Empty
   * array is a safe fallback — the row just doesn't render. */
  socialLinks?: FooterSocialLink[];
}

export function Footer({ socialLinks = [] }: FooterProps) {
  const pathname = usePathname();
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  if (pathname?.startsWith('/dashboard')) return null;

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? 'Failed to subscribe');
      setSubscribed(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to subscribe');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="relative border-t border-border">
      <div className="absolute inset-0 bg-dots opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1280px] px-5 py-16 tab:px-8 sm:py-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-btn bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-soft">
                <span className="absolute inset-0 bg-grid-sm opacity-30" />
                <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none">
                  <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
                  <circle cx="12" cy="12" r="3.4" fill="currentColor" />
                </svg>
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">HYASCKA</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
              AI-first digital solutions for ambitious teams. We build intelligent software,
              automation, and enterprise systems that drive measurable growth.
            </p>

            <div className="mt-2">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Newsletter
              </h4>
              {subscribed ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Subscribed — thank you!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 flex-1"
                    aria-label="Email for newsletter"
                  />
                  <Button type="submit" size="sm" className="shrink-0 rounded-btn gap-1.5" disabled={submitting}>
                    {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Subscribe
                  </Button>
                </form>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => {
                  const Icon = ICONS[(s.icon ?? s.platform).toLowerCase()] ?? Globe;
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label ?? s.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-btn border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {col.title}
              </h4>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="group inline-flex w-fit items-center gap-1 text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60" />
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HYASCKA. All rights reserved.
          </p>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Available for new projects
          </span>
        </div>
      </div>
    </footer>
  );
}
