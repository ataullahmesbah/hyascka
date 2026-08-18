// FILE: app/services/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Clock, Shield, Zap } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { GradientOrbs } from '@/components/gradient-orbs';
import { ServiceBuyButton } from '@/components/service-buy-button';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/reveal';
import { CTASection } from '@/components/cta-section';

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
        alternates: { canonical: `/services/${service.slug}` },
        openGraph: {
            title: service.seoTitle || `${service.title} — HYASCKA`,
            description: service.seoDescription || service.shortDescription || service.description || undefined,
            type: 'website',
            url: `/services/${service.slug}`,
        },
    };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const service = await getService(params.slug);
    if (!service) notFound();

    const hasFixedPrice = service.acquisitionType === 'FIXED_PRICE' && service.price !== null;

    // Mock features if none exist (for demonstration)
    const features = service.features.length > 0 ? service.features : [
        'Expert consultation and strategy development',
        'Customized implementation plan',
        'Dedicated support throughout the engagement',
        'Regular progress updates and reporting',
        'Post-delivery review and optimization'
    ];

    return (
        <>
            {/* Hero Section - Enhanced */}
            <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pt-40 lg:pb-28">
                <GradientOrbs />
                <div className="absolute inset-0 bg-grid mask-fade-b opacity-30" aria-hidden />

                {/* Decorative elements */}
                <div className="absolute top-1/4 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-1/4 left-0 h-48 w-48 rounded-full bg-secondary/5 blur-3xl" />

                <div className="relative mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
                    {/* Breadcrumb - Enhanced */}
                    <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <span className="text-muted-foreground/40">/</span>
                        <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                            Services
                        </Link>
                        <span className="text-muted-foreground/40">/</span>
                        <span className="text-foreground font-medium">{service.title}</span>
                    </nav>

                    {/* Category Badge - Enhanced */}
                    {service.category && (
                        <div className="mb-6 flex items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                                </span>
                                {service.category.name}
                            </span>
                            {hasFixedPrice && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-4 py-1.5 text-xs font-medium text-success">
                                    <Zap className="h-3 w-3" />
                                    Fixed Price
                                </span>
                            )}
                        </div>
                    )}

                    {/* Title - Enhanced */}
                    <div className="max-w-4xl">
                        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[4rem] lg:leading-[1.04]">
                            {service.title}
                        </h1>
                    </div>

                    {/* Description - Enhanced */}
                    {service.shortDescription && (
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                            {service.shortDescription}
                        </p>
                    )}

                    {/* Action Bar - Enhanced */}
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        {hasFixedPrice ? (
                            <div className="flex items-center gap-4">
                                <ServiceBuyButton slug={service.slug} />
                                <span className="font-display text-2xl font-bold text-primary">
                                    {service.currency} {Number(service.price).toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <Button asChild size="lg" className="group gap-2 rounded-btn px-8 py-6 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                <Link href={`/contact?service=${encodeURIComponent(service.slug)}&custom=true`}>
                                    Request Custom Quote
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        )}

                        <Button asChild variant="ghost" size="lg" className="gap-2 text-muted-foreground hover:text-foreground">
                            <Link href="/services">
                                <ArrowLeft className="h-4 w-4" />
                                All Services
                            </Link>
                        </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-12 flex flex-wrap gap-8 border-t border-border/50 pt-8">
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary/60" />
                            <span className="text-sm text-muted-foreground">Flexible timeline</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary/60" />
                            <span className="text-sm text-muted-foreground">Confidential & secure</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-primary/60" />
                            <span className="text-sm text-muted-foreground">Tailored to your needs</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section - Enhanced with better visual hierarchy */}
            {(service.description || features.length > 0) && (
                <section className="relative py-16 sm:py-20 bg-secondary/5">
                    <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />

                    <div className="relative mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.4fr_1fr]">
                            {/* Description Column */}
                            {service.description && (
                                <Reveal>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-px w-8 bg-primary/30" />
                                            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                                What We Do
                                            </h2>
                                        </div>
                                        <div className="prose prose-lg prose-invert max-w-none">
                                            <div className="whitespace-pre-line text-base leading-relaxed text-muted-foreground text-pretty">
                                                {service.description}
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            )}

                            {/* Features Column - Enhanced */}
                            {features.length > 0 && (
                                <Reveal delay={0.1}>
                                    <div className="rounded-2xl border border-border/60 bg-background/50 backdrop-blur-sm p-8 shadow-sm">
                                        <div className="flex items-center gap-3 mb-6">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                                What&apos;s Included
                                            </h2>
                                        </div>
                                        <ul className="flex flex-col gap-4">
                                            {features.map((f, index) => (
                                                <li key={index} className="flex items-start gap-3 text-sm leading-relaxed group">
                                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    </span>
                                                    <span className="text-foreground/90">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Reveal>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Enhanced CTA Section */}
            <CTASection
                title={
                    <>
                        Ready to get started with{' '}
                        <span className="text-gradient-primary font-semibold">{service.title}</span>?
                    </>
                }
                description="Let's discuss your specific needs and create a customized solution that delivers real results."
                primaryLabel="Get Your Custom Quote"
                primaryHref={`/contact?service=${encodeURIComponent(service.slug)}&custom=true`}
                secondaryLabel="Explore All Services"
                secondaryHref="/services"
                className="bg-gradient-to-b from-background to-secondary/5"
            />
        </>
    );
}