'use server';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { registerSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validation';
import { sendEmail, welcomeEmail, verifyEmail, forgotPasswordEmail, resetPasswordEmail } from '@/lib/email';

type ActionResult = { success: boolean; error?: string; data?: unknown };

export async function registerAction(formData: FormData): Promise<ActionResult> {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
    const userRole = await prisma.role.findFirst({ where: { name: 'USER' } });
    if (!userRole) return { success: false, error: 'Server configuration error' };

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: normalizedEmail,
        password: hashedPassword,
        roleId: userRole.id,
      },
    });

    const token = crypto.randomBytes(32).toString('hex');
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: user.id,
      },
    });

    await sendEmail(welcomeEmail(parsed.data.name, normalizedEmail));
    await sendEmail(verifyEmail(parsed.data.name, normalizedEmail, token));

    return { success: true, data: { id: user.id, email: user.email } };
  } catch {
    return { success: false, error: 'An error occurred during registration' };
  }
}

export async function forgotPasswordAction(formData: FormData): Promise<ActionResult> {
  try {
    const data = { email: formData.get('email') as string };
    const parsed = forgotPasswordSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid email' };
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (user) {
      await prisma.passwordResetToken.updateMany({
        where: { email: normalizedEmail, used: false },
        data: { used: true },
      });

      const token = crypto.randomBytes(32).toString('hex');
      await prisma.passwordResetToken.create({
        data: {
          email: normalizedEmail,
          token,
          expires: new Date(Date.now() + 60 * 60 * 1000),
          userId: user.id,
        },
      });

      await sendEmail(forgotPasswordEmail(user.name ?? 'User', normalizedEmail, token));
    }

    return { success: true };
  } catch {
    return { success: false, error: 'An error occurred' };
  }
}

export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  try {
    const data = {
      token: formData.get('token') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const parsed = resetPasswordSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: parsed.data.token },
    });

    if (!resetToken || resetToken.used || resetToken.expires < new Date()) {
      return { success: false, error: 'Invalid or expired reset token' };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { token: parsed.data.token },
        data: { used: true },
      }),
    ]);

    const user = await prisma.user.findUnique({ where: { email: resetToken.email } });
    if (user) {
      await sendEmail(resetPasswordEmail(user.name ?? 'User', user.email));
    }

    return { success: true };
  } catch {
    return { success: false, error: 'An error occurred while resetting your password' };
  }
}
