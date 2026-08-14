// FILE: app/api/invitations/[token]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public — a person opening their invitation link is by definition not
// logged in yet. Returns only what the accept-invite UI needs to render
// the right state; never exposes the token itself back, ids, or anything
// beyond the email being activated.
export async function GET(_req: Request, { params }: { params: { token: string } }) {
    try {
        const invitation = await prisma.clientInvitation.findUnique({
            where: { token: params.token },
        });

        if (!invitation) {
            return NextResponse.json({ valid: false, reason: 'not_found' });
        }
        if (invitation.usedAt) {
            return NextResponse.json({ valid: false, reason: 'used' });
        }
        if (invitation.expiresAt < new Date()) {
            return NextResponse.json({ valid: false, reason: 'expired' });
        }

        return NextResponse.json({ valid: true, email: invitation.email });
    } catch {
        return NextResponse.json({ valid: false, reason: 'error' }, { status: 500 });
    }
}