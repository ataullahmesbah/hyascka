'use client';

// FILE: components/dashboard/portal-welcome.tsx

import * as React from 'react';
import { LayoutDashboard, FileText, Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import type { Role } from '@/lib/permissions';

const COPY: Partial<Record<Role, { title: string; description: string; icon: typeof LayoutDashboard }>> = {
    EDITOR: {
        title: 'Your content tools are on the way',
        description:
            'The Blog, Drafts, and SEO workspace for editors is being built in an upcoming phase. Once it ships, this is where you\u2019ll manage everything you write.',
        icon: FileText,
    },
    CLIENT: {
        title: 'Your project portal is on the way',
        description:
            'Projects, invoices, documents, and messages tied to your account will appear here once the client portal ships in an upcoming phase.',
        icon: Briefcase,
    },
    USER: {
        title: 'Welcome to HYASCKA',
        description:
            'Service requests, saved services, and inquiries will appear here once that part of the dashboard ships in an upcoming phase.',
        icon: LayoutDashboard,
    },
};

/**
 * Foundation-only landing view for roles whose real dashboard modules
 * haven't been built yet (Phase 1 explicitly defers Projects, Blog CMS,
 * Client Portal, etc). Every role still lands on /dashboard per the
 * routing requirement — this is what they see until their module ships.
 */
export function PortalWelcome({ name, role }: { name: string; role: Role }) {
    const copy = COPY[role] ?? COPY.USER!;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={`Welcome back, ${name}`} description="Here's your HYASCKA dashboard." />
            <EmptyState icon={copy.icon} title={copy.title} description={copy.description} />
        </div>
    );
}