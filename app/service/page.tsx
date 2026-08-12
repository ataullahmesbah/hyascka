// FILE: app/service/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'Service Catalog — HYASCKA',
    description: 'Browse and purchase HYASCKA services directly — pricing, delivery time, and what you get.',
};

export const dynamic = 'force-dynamic';

export default async function ServiceCatalogPage() {
    const services = await prisma.service.findMany({
        where: { status: 'PUBLISHED' },
        include: { category: { select: { name: true } } },
        orderBy: { order: 'asc' },
    });

    return (
        <>
            <PageHero
                eyebrow="Service Catalog"
                crumbs={[{ label: 'Home', href: '/' }, { label: 'Service Catalog', href: '/service' }]}
                title={<>Purchase a service <span className="text-gradient-primary">directly</span></>}
                description="Real-time availability and pricing, pulled straight from our system."
            />

            <section className="relative py-16 sm:py-20">
                <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
                    {services.length === 0 ? (
                        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
                            No services are available for direct purchase right now — see our{' '}
                            <Link href="/services" className="text-primary hover:underline">full services list</Link> or{' '}
                            <Link href="/contact" className="text-primary hover:underline">get in touch</Link>.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/service/${s.slug}`}
                                    className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-lg"
                                >
                                    {s.category && (
                                        <span className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            {s.category.name}
                                        </span>
                                    )}
                                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                                    {s.shortDescription && (
                                        <p className="mt-2 text-sm text-muted-foreground">{s.shortDescription}</p>
                                    )}
                                    <div className="mt-auto flex items-center justify-between pt-6">
                                        <span className="font-display text-base font-semibold">
                                            {s.price !== null ? `${s.currency} ${Number(s.price).toLocaleString()}` : 'Contact us'}
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}