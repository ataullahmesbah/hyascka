// FILE: app/service/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { GradientOrbs } from '@/components/gradient-orbs';
import { ServiceBuyButton } from '@/components/service-buy-button';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

async function getService(slug: string) {
    const service = await prisma.service.findUnique({
        where: { slug },
        include: { category: { select: { name: true, slug: true } } },
    });
    if (!service || service.status !== 'PUBLISHED') return null;
    return service;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const service = await getService(params.slug);
    if (!service) return { title: 'Service Not Found — HYASCKA' };

    return {
        title: service.seoTitle || `${service.title} — HYASCKA`,
        description: service.seoDescription || service.shortDescription || service.description || undefined,
    };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const service = await getService(params.slug);
    if (!service) notFound();

    return (
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pt-40">
            <GradientOrbs />
            <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" aria-hidden />

            <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-5 tab:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
                <div>
                    <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Link href="/service" className="hover:text-foreground">Service Catalog</Link>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="text-foreground">{service.title}</span>
                    </nav>

                    {service.category && (
                        <span className="mb-3 inline-block text-xs font-medium uppercase tracking-wide text-primary">
                            {service.category.name}
                        </span>
                    )}

                    <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{service.title}</h1>

                    {service.shortDescription && (
                        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{service.shortDescription}</p>
                    )}

                    {service.description && (
                        <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                            {service.description}
                        </div>
                    )}

                    {service.features.length > 0 && (
                        <ul className="mt-8 flex flex-col gap-3">
                            {service.features.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-sm">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="lg:sticky lg:top-28 lg:self-start">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-lg">
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm text-muted-foreground">Price</span>
                            <span className="font-display text-2xl font-semibold">
                                {service.price !== null
                                    ? `${service.currency} ${Number(service.price).toLocaleString()}`
                                    : 'Custom'}
                            </span>
                        </div>

                        {service.deliveryTime && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Delivery: {service.deliveryTime}
                            </div>
                        )}

                        <div className="mt-6">
                            {service.price !== null ? (
                                <ServiceBuyButton slug={service.slug} />
                            ) : (
                                <Button asChild size="lg" className="w-full">
                                    <Link href="/contact">Contact Us for Pricing</Link>
                                </Button>
                            )}
                        </div>

                        <p className="mt-3 text-center text-xs text-muted-foreground">
                            {service.price !== null
                                ? "You'll review the order before anything is charged."
                                : 'Our team will get back to you with a custom quote.'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}