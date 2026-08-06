'use server';

import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validation';
import { sendEmail, contactNotificationEmail } from '@/lib/email';

type ActionResult = { success: boolean; error?: string };

export async function submitContactAction(formData: FormData): Promise<ActionResult> {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      company: (formData.get('company') as string) || undefined,
      service: (formData.get('service') as string) || undefined,
      budget: (formData.get('budget') as string) || undefined,
      message: formData.get('message') as string,
    };

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
    }

    await prisma.contact.create({ data: parsed.data });
    await sendEmail(contactNotificationEmail(parsed.data));

    return { success: true };
  } catch {
    return { success: false, error: 'An error occurred while submitting the form' };
  }
}
