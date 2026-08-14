// FILE: app/api/dashboard/contacts/[id]/invite/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/dashboard-auth';
import { linkClientToLeads } from '@/lib/client-linking';
import { sendEmail, clientInvitationEmail } from '@/lib/email';

const INVITATION_EXPIRY_DAYS = 7;

// Roles that must NEVER be silently converted into a CLIENT account or
// have a client invitation sent to their address.
const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'];

export async function POST(_req: Request, { params }: { params: { id: string } }) {
    try {
        const { user, authorized } = await requirePermission('leads.inviteClient');
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const contact = await prisma.contact.findUnique({ where: { id: params.id } });
        if (!contact) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

        if (contact.userId) {
            return NextResponse.json(
                { error: 'This lead is already linked to a client account.' },
                { status: 400 }
            );
        }

        // Case-insensitive: /contact does not lowercase the submitted email
        // before storing it (see lib/client-linking.ts).
        const existingUser = await prisma.user.findFirst({
            where: { email: { equals: contact.email, mode: 'insensitive' } },
            include: { role: true },
        });

        if (existingUser) {
            if (STAFF_ROLES.includes(existingUser.role.name)) {
                return NextResponse.json(
                    { error: 'This email belongs to a staff account and cannot be converted into a client.' },
                    { status: 409 }
                );
            }

            if (existingUser.role.name === 'CLIENT') {
                // Case 1: the account already exists — link instantly, no
                // invitation/email needed.
                await prisma.$transaction(async (tx) => {
                    await linkClientToLeads(tx, contact.email, existingUser.id);
                });
                return NextResponse.json({
                    status: 'linked',
                    message: 'An existing client account was found and linked to this lead.',
                });
            }

            // role === 'USER' (or any other non-staff, non-client role): do
            // not silently create a duplicate or auto-upgrade their role.
            return NextResponse.json(
                {
                    error:
                        'This email belongs to an existing user account. Ask a Super Admin to upgrade it to Client from Users management, then use Invite Client again to link it.',
                },
                { status: 409 }
            );
        }

        // Case 2: no account at all — invalidate any previous unused
        // invitation for this email, then create + email a fresh one.
        await prisma.clientInvitation.updateMany({
            where: { email: { equals: contact.email, mode: 'insensitive' }, usedAt: null },
            data: { usedAt: new Date() },
        });

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

        await prisma.clientInvitation.create({
            data: {
                email: contact.email,
                token,
                leadId: contact.id,
                invitedById: user.id,
                expiresAt,
            },
        });

        let emailSent = true;
        try {
            await sendEmail(
                clientInvitationEmail({
                    to: contact.email,
                    leadName: contact.name,
                    invitedByName: user.name ?? 'The HYASCKA team',
                    token,
                    expiresInDays: INVITATION_EXPIRY_DAYS,
                })
            );
        } catch (emailError) {
            // The invitation record is already saved — a local SMTP failure
            // must not be reported as if nothing happened.
            console.error('[invite] invitation email failed:', emailError);
            emailSent = false;
        }

        return NextResponse.json({
            status: 'invited',
            emailSent,
            message: emailSent
                ? 'Invitation sent.'
                : 'Invitation created, but the email could not be sent (check local SMTP configuration).',
        });
    } catch {
        return NextResponse.json({ error: 'Failed to invite client' }, { status: 500 });
    }
}