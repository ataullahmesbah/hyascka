// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: app/services/[slug]/page.tsx
// ==========================================================
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { GradientOrbs } from '@/components/gradient-orbs';
import { ServiceBuyButton } from '@/components/service-buy-button';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/reveal';
import { CTASection } from '@/components/cta-section';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export const dynamic = 'force-dynamic';

async function getService(slug: string) {
    const service = await prisma.service.findUnique({
        where: { slug },
        include: {
            category: { select: { name: true, slug: true } },
            faqs: { where: { active: true }, orderBy: { order: 'asc' } },
        },
    });
    if (!service || service.status !== 'PUBLISHED') return null;
    return service;
}

async function getRelatedServices(categoryId: string | null, excludeId: string) {
    if (!categoryId) return [];
    return prisma.service.findMany({
        where: { status: 'PUBLISHED', categoryId, id: { not: excludeId } },
        orderBy: { order: 'asc' },
        take: 3,
        select: { id: true, slug: true, title: true, shortDescription: true },
    });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const service = await getService(params.slug);
    if (!service) return { title: 'Service Not Found — HYASCKA' };

    return {
        title: service.seoTitle || `${service.title} — HYASCKA`,
        description: service.seoDescription || service.shortDescription || service.description || undefined,
        alternates: { canonical: `/services/${service.slug}` },
    };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const service = await getService(params.slug);
    if (!service) notFound();

    const relatedServices = await getRelatedServices(service.categoryId, service.id);

    // Price is optional — most engagements are scoped as a custom quote.
    // Only a Fixed Price service with a real price value gets a Buy flow;
    // everything else routes straight to a custom-quote request. Nothing
    // ever renders "$0" or an empty price row.
    const hasFixedPrice = service.acquisitionType === 'FIXED_PRICE' && service.price !== null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.shortDescription ?? service.description ?? undefined,
        provider: { '@type': 'Organization', name: 'HYASCKA', url: 'https://hyascka.com' },
        ...(service.category && { serviceType: service.category.name }),
        ...(hasFixedPrice && {
            offers: {
                '@type': 'Offer',
                price: Number(service.price),
                priceCurrency: service.currency,
                url: `https://hyascka.com/services/${service.slug}`,
            },
        }),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-40 lg:pb-20">
                <GradientOrbs />
                <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" aria-hidden />

                <div className="relative mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
                    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Link href="/services" className="hover:text-foreground">Services</Link>
                        <span aria-hidden>/</span>
                        <span className="text-foreground">{service.title}</span>
                    </nav>

                    {service.category && (
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {service.category.name}
                        </span>
                    )}

                    <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.04]">
                        {service.title}
                    </h1>

                    {service.shortDescription && (
                        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                            {service.shortDescription}
                        </p>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        {hasFixedPrice ? (
                            <ServiceBuyButton slug={service.slug} />
                        ) : (
                            <Button asChild size="lg" className="group gap-2 rounded-btn px-6">
                                <Link href={`/contact?service=${encodeURIComponent(service.slug)}&custom=true`}>
                                    Request Custom Quote
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        )}
                        {hasFixedPrice && (
                            <span className="font-display text-xl font-semibold">
                                {service.currency} {Number(service.price).toLocaleString()}
                            </span>
                        )}
                        <Button asChild variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                            <Link href="/services">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Services
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {(service.description || service.approach || service.features.length > 0) && (
                <section className="relative py-20 sm:py-24">
                    <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-5 tab:px-8 lg:grid-cols-[1.4fr_1fr] lg:px-12">
                        <div className="flex flex-col gap-10">
                            {service.description && (
                                <Reveal>
                                    <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                        What We Do
                                    </h2>
                                    <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground text-pretty">
                                        {service.description}
                                    </div>
                                </Reveal>
                            )}

                            {service.approach && (
                                <Reveal delay={0.05}>
                                    <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                        Our Approach
                                    </h2>
                                    <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground text-pretty">
                                        {service.approach}
                                    </div>
                                </Reveal>
                            )}
                        </div>

                        {service.features.length > 0 && (
                            <Reveal delay={0.1}>
                                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                    What&apos;s Included
                                </h2>
                                <ul className="mt-4 flex flex-col gap-3">
                                    {service.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        )}
                    </div>
                </section>
            )}

            {service.faqs.length > 0 && (
                <section className="relative py-20 sm:py-24 bg-surface-secondary">
                    <div className="mx-auto max-w-3xl px-5 tab:px-8 lg:px-12">
                        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Frequently Asked Questions
                        </h2>
                        <Reveal delay={0.05} className="mt-6">
                            <Accordion type="single" collapsible className="flex flex-col gap-3">
                                {service.faqs.map((f) => (
                                    <AccordionItem
                                        key={f.id}
                                        value={f.id}
                                        className="rounded-btn border border-border bg-card px-5 shadow-soft data-[state=open]:border-primary/40"
                                    >
                                        <AccordionTrigger className="py-5 text-left font-display text-base font-medium tracking-tight hover:no-underline">
                                            {f.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm leading-relaxed text-muted-foreground text-pretty">
                                            {f.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Reveal>
                    </div>
                </section>
            )}

            {relatedServices.length > 0 && (
                <section className="relative py-20 sm:py-24">
                    <div className="mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
                        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Related Services
                        </h2>
                        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
                            {relatedServices.map((s, i) => (
                                <Reveal key={s.id} delay={Math.min(i * 0.05, 0.15)} className="h-full">
                                    <Link
                                        href={`/services/${s.slug}`}
                                        className="group relative flex h-full flex-col justify-between gap-8 bg-card p-6 transition-colors duration-300 hover:bg-secondary/50 sm:p-7"
                                    >
                                        <div>
                                            <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-balance">
                                                {s.title}
                                            </h3>
                                            {s.shortDescription && (
                                                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                                                    {s.shortDescription}
                                                </p>
                                            )}
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors group-hover:text-primary">
                                            Learn more
                                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </span>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CTASection
                title={<>Let&apos;s scope <span className="text-gradient-primary">{service.title}</span> for you</>}
                description="Every engagement starts with understanding what you actually need. No fixed packages — just a plan that fits."
                primaryLabel="Request Custom Quote"
                primaryHref={`/contact?service=${encodeURIComponent(service.slug)}&custom=true`}
                secondaryLabel="Back to Services"
                secondaryHref="/services"
            />
        </>
    );
}