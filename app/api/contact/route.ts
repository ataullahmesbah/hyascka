// FILE: app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { contactSchema } from '@/lib/validation';
import { sendEmail, contactNotificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // If the submitter happens to be logged in, link the lead to their
    // account automatically — this is what lets "USER can see their own
    // submitted requests" (Phase 3 §5) and "leads.read_own" work without
    // asking them to re-enter anything.
    const session = await getServerSession(authOptions);
    const { isCustomRequest, ...contactData } = parsed.data;

    const contact = await prisma.contact.create({
      data: {
        ...contactData,
        isCustomRequest: isCustomRequest ?? false,
        userId: session?.user?.id,
      },
    });

    await sendEmail(contactNotificationEmail(contactData));

    return NextResponse.json(
      { message: 'Contact form submitted successfully', id: contact.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'An error occurred while submitting the form' },
      { status: 500 }
    );
  }
}

// NOTE: the previous GET handler here returned every Contact record
// (name/email/phone/message) to any unauthenticated caller — a real data
// leak, unrelated to Phase 3 but fixed while touching this file. Lead
// listing now lives only behind /api/dashboard/contacts, which is
// permission-gated.