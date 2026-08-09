'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
    className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
    const { resolvedTheme } = useTheme();

    const logoSrc =
        resolvedTheme === 'dark'
            ? '/logo/logo2.png'
            : '/logo/logo1.png';

    return (
        <Image
            src={logoSrc}
            alt="HYASCKA"
            width={200}
            height={96}
            priority
            className={cn(
                'h-auto w-auto max-h-20 object-contain',
                className
            )}
        />
    );
}
