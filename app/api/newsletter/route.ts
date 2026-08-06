import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/lib/validation';
import { sendEmail, newsletterConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.newsletter.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: 'You are already subscribed' },
          { status: 200 }
        );
      }
      await prisma.newsletter.update({
        where: { email: normalizedEmail },
        data: { active: true, name },
      });
      return NextResponse.json(
        { message: 'Subscription reactivated' },
        { status: 200 }
      );
    }

    await prisma.newsletter.create({
      data: { email: normalizedEmail, name },
    });

    await sendEmail(newsletterConfirmationEmail(normalizedEmail));

    return NextResponse.json(
      { message: 'Subscribed successfully' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'An error occurred while subscribing' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await prisma.newsletter.update({
      where: { email: email.toLowerCase() },
      data: { active: false },
    });

    return NextResponse.json(
      { message: 'Unsubscribed successfully' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'An error occurred while unsubscribing' },
      { status: 500 }
    );
  }
}
