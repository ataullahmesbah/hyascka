'use server';

import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/lib/validation';
import { sendEmail, newsletterConfirmationEmail } from '@/lib/email';

type ActionResult = { success: boolean; error?: string };

export async function subscribeNewsletterAction(formData: FormData): Promise<ActionResult> {
  try {
    const data = {
      email: formData.get('email') as string,
      name: (formData.get('name') as string) || undefined,
    };

    const parsed = newsletterSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid email' };
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const existing = await prisma.newsletter.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.active) return { success: true };
      await prisma.newsletter.update({
        where: { email: normalizedEmail },
        data: { active: true, name: parsed.data.name },
      });
      return { success: true };
    }

    await prisma.newsletter.create({
      data: { email: normalizedEmail, name: parsed.data.name },
    });

    await sendEmail(newsletterConfirmationEmail(normalizedEmail));

    return { success: true };
  } catch {
    return { success: false, error: 'An error occurred while subscribing' };
  }
}

export async function unsubscribeNewsletterAction(email: string): Promise<ActionResult> {
  try {
    await prisma.newsletter.update({
      where: { email: email.toLowerCase() },
      data: { active: false },
    });
    return { success: true };
  } catch {
    return { success: false, error: 'An error occurred while unsubscribing' };
  }
}
