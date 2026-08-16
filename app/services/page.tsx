// FILE: app/services/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Services — HYASCKA',
  description:
    'Browse HYASCKA services by category — AI, search, paid media, and full-stack development, scoped around what you need.',
};

export const dynamic = 'force-dynamic';

async function getGroupedServices() {
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      services: {
        where: { status: 'PUBLISHED' },
        orderBy: { order: 'asc' },
      },
    },
  });

  const uncategorized = await prisma.service.findMany({
    where: { status: 'PUBLISHED', categoryId: null },
    orderBy: { order: 'asc' },
  });

  return {
    categories: categories.filter((c) => c.services.length > 0),
    uncategorized,
  };
}

export default async function ServicesPage() {
  const { categories, uncategorized } = await getGroupedServices();
  const isEmpty = categories.length === 0 && uncategorized.length === 0;

  return (
    <>
      <PageHero
        eyebrow="Services"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }]}
        title={
          <>
            Full-stack capability, organized{' '}
            <span className="text-gradient-primary">around outcomes</span>
          </>
        }
        description="From search and paid media to product engineering — scoped around what your business actually needs, not a fixed package."
      >
        <Button asChild size="lg" className="group gap-2 rounded-btn px-6">
          <Link href="/contact">
            Let&apos;s Talk
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </PageHero>

      <section className="relative pb-24 sm:pb-28 lg:pb-32">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          {isEmpty ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              No services are published yet — please{' '}
              <Link href="/contact" className="text-primary hover:underline">get in touch</Link>{' '}
              and we&apos;ll help you scope the right engagement.
            </div>
          ) : (
            <div className="flex flex-col">
              {categories.map((category, gi) => (
                <ServiceGroup
                  key={category.id}
                  name={category.name}
                  description={category.description}
                  services={category.services}
                  isFirst={gi === 0}
                />
              ))}

              {uncategorized.length > 0 && (
                <ServiceGroup
                  name="Other Services"
                  description={null}
                  services={uncategorized}
                  isFirst={categories.length === 0}
                />
              )}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title={<>Not sure where to <span className="text-gradient-primary">start?</span></>}
        description="Tell us what you're trying to achieve. We'll help you map the right services to your goals — no fixed packages required."
        primaryLabel="Request a custom quote"
        secondaryLabel="View our work"
        secondaryHref="/portfolio"
      />
    </>
  );
}

type ServiceCardData = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
};

function ServiceGroup({
  name,
  description,
  services,
  isFirst,
}: {
  name: string;
  description: string | null;
  services: ServiceCardData[];
  isFirst: boolean;
}) {
  return (
    <div className={isFirst ? '' : 'mt-20 border-t border-border pt-16 sm:mt-24 sm:pt-20'}>
      <Reveal>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {name}
          </h2>
        </div>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={Math.min(i * 0.04, 0.2)} className="h-full">
            <ServiceCard service={s} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col justify-between gap-8 bg-card p-6 transition-colors duration-300 hover:bg-secondary/50 sm:p-7"
    >
      <div>
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-balance">
          {service.title}
        </h3>
        {service.shortDescription && (
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground text-pretty">
            {service.shortDescription}
          </p>
        )}
      </div>

      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors group-hover:text-primary">
        Learn more
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}