// FILE: components/service-buy-button.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ServiceBuyButton({ slug }: { slug: string }) {
    const { status } = useSession();
    const router = useRouter();

    const target = `/checkout?service=${encodeURIComponent(slug)}`;

    const handleClick = () => {
        if (status === 'authenticated') {
            router.push(target);
            return;
        }
        // Preserve exactly where the visitor wanted to go — they land back on
        // checkout for this same service after logging in, not a generic page.
        router.push(`/login?callbackUrl=${encodeURIComponent(target)}`);
    };

    if (status === 'loading') {
        return (
            <Button size="lg" disabled className="w-full gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
            </Button>
        );
    }

    return (
        <Button size="lg" onClick={handleClick} className="group w-full gap-2">
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
    );
}