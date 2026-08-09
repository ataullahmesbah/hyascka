// components/auth/auth-notice.tsx


'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { toast } from 'sonner';

export function AuthNotice() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const notice = searchParams.get('notice');

    React.useEffect(() => {
        if (notice === 'already-logged-in') {
            toast.info("You're already logged in.");
            const params = new URLSearchParams(searchParams.toString());
            params.delete('notice');
            router.replace(params.toString() ? `${pathname}?${params}` : pathname);
        }
    }, [notice, pathname, router, searchParams]);

    return null;
}