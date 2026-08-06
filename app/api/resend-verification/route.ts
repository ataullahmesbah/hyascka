// app/api/resend-verification/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail, verifyEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

        // user না থাকলেও success দেখান — email enumeration ঠেকাতে
        if (!user || user.emailVerified) {
            return NextResponse.json({ message: 'success' }, { status: 200 });
        }

        await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail } });

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.verificationToken.create({
            data: { identifier: normalizedEmail, token, expires, userId: user.id },
        });

        await sendEmail(verifyEmail(user.name ?? '', normalizedEmail, token));

        return NextResponse.json({ message: 'success' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}