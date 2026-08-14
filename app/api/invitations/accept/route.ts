// FILE: app/api/invitations/accept/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { acceptInvitationSchema } from '@/lib/validation';
import { linkClientToLeads } from '@/lib/client-linking';
import { sendEmail, welcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = acceptInvitationSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { token, name, password } = parsed.data;

        const invitation = await prisma.clientInvitation.findUnique({ where: { token } });
        if (!invitation) {
            return NextResponse.json({ error: 'This invitation link is invalid.' }, { status: 400 });
        }
        if (invitation.usedAt) {
            return NextResponse.json({ error: 'This invitation has already been used.' }, { status: 400 });
        }
        if (invitation.expiresAt < new Date()) {
            return NextResponse.json({ error: 'This invitation has expired.' }, { status: 400 });
        }

        const normalizedEmail = invitation.email.toLowerCase();

        // Race-condition guard: someone could have registered/been created
        // with this email between the invite being sent and now.
        const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
            await prisma.clientInvitation.update({
                where: { token },
                data: { usedAt: new Date() },
            });
            return NextResponse.json(
                { error: 'An account with this email already exists. Please log in instead.' },
                { status: 409 }
            );
        }

        const clientRole = await prisma.role.findFirst({ where: { name: 'CLIENT' } });
        if (!clientRole) {
            return NextResponse.json(
                { error: 'Client role not found. Run the database seed.' },
                { status: 500 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.$transaction(async (tx) => {
            const created = await tx.user.create({
                data: {
                    name,
                    email: normalizedEmail,
                    password: hashedPassword,
                    roleId: clientRole.id,
                    // The invitation link itself already proved control of
                    // this inbox — no separate email-verification step needed.
                    emailVerified: new Date(),
                },
            });

            await tx.clientInvitation.update({
                where: { token },
                data: { usedAt: new Date() },
            });

            await linkClientToLeads(tx, invitation.email, created.id);

            return created;
        });

        try {
            await sendEmail(welcomeEmail(name, normalizedEmail));
        } catch (emailError) {
            console.error('[invitations/accept] welcome email failed:', emailError);
        }

        return NextResponse.json(
            { message: 'Account created successfully.', user: { id: user.id, email: user.email } },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: 'An error occurred while setting up your account.' },
            { status: 500 }
        );
    }
}