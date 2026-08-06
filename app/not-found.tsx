import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, Bot } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-30" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

      <div className="relative mx-auto flex max-w-lg flex-col items-center gap-6 px-5 text-center">
        {/* Robot / AI Assistant illustration */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-accent opacity-20 blur-2xl" />
          <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-3xl border border-border bg-card shadow-soft-lg">
            {/* robot face */}
            <div className="flex items-end gap-1.5">
              <span className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-4 w-4 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <Bot className="mt-1 h-8 w-8 text-primary" />
            {/* antenna */}
            <span className="absolute -top-2 left-1/2 h-4 w-px -translate-x-1/2 bg-border" />
            <span className="absolute -top-3 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>

        <div className="font-display text-7xl font-semibold tracking-tight text-gradient-primary">
          404
        </div>

        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Page Not Found
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Our AI assistant
          couldn&apos;t find it either — but we can get you back on track.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="group h-12 gap-2 rounded-btn px-6 text-base">
            <Link href="/">
              <Home className="h-4.5 w-4.5" />
              Go Home
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 gap-2 rounded-btn px-6 text-base">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
