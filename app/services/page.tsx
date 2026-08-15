// FILE: app/services/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { CTASection } from '@/components/cta-section';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Services — HYASCKA',
  description:
    'Browse HYASCKA services by category — real-time availability and pricing, pulled straight from our system.',
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

  return { categories: categories.filter((c: { services: unknown[] }) => c.services.length > 0), uncategorized };
}

export default async function ServicesPage() {
  const { categories, uncategorized } = await getGroupedServices();
  const isEmpty = categories.length === 0 && uncategorized.length === 0;

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }]}
        title={
          <>
            Full-stack AI engineering, from{' '}
            <span className="text-gradient-primary">concept to scale</span>
          </>
        }
        description="Real-time availability and pricing, pulled straight from our system — grouped by what you're trying to solve."
      />

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
          {isEmpty ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              No services are published yet — please{' '}
              <Link href="/contact" className="text-primary hover:underline">get in touch</Link>{' '}
              and we'll help you scope the right engagement.
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              {categories.map((category: { id: string; name: string; description: string | null; services: ServiceCardData[] }) => (
                <div key={category.id}>
                  <div className="mb-6">
                    <h2 className="font-display text-2xl font-semibold tracking-tight">{category.name}</h2>
                    {category.description && (
                      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                  <ServiceGrid services={category.services} />
                </div>
              ))}

              {uncategorized.length > 0 && (
                <div>
                  {categories.length > 0 && (
                    <div className="mb-6">
                      <h2 className="font-display text-2xl font-semibold tracking-tight">Other Services</h2>
                    </div>
                  )}
                  <ServiceGrid services={uncategorized} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title={<>Let&apos;s scope your <span className="text-gradient-primary">next build</span></>}
        description="Tell us what you're trying to achieve. We'll help you map the right services to your goals."
        primaryLabel="Start your project"
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
  price: unknown;
  currency: string;
};

function ServiceGrid({ services }: { services: ServiceCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Link
          key={s.id}
          href={`/services/${s.slug}`}
          className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-lg"
        >
          <h3 className="font-display text-lg font-semibold">{s.title}</h3>
          {s.shortDescription && (
            <p className="mt-2 text-sm text-muted-foreground">{s.shortDescription}</p>
          )}
          <div className="mt-auto flex items-center justify-between pt-6">
            <span className="font-display text-base font-semibold">
              {s.price !== null ? `${s.currency} ${Number(s.price).toLocaleString()}` : 'Custom quote'}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </Link>
      ))}
    </div>
  );
}