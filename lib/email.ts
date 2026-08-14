import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type EmailTemplate = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail({ to, subject, html }: EmailTemplate): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? 'noreply@hyaska.com',
    to,
    subject,
    html,
  });
}

// ─────────────────────────────────────
// Email Templates
// ─────────────────────────────────────

export function welcomeEmail(name: string, to: string): EmailTemplate {
  return {
    to,
    subject: `Welcome to HYASCKA, ${name}!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a;">Welcome to HYASCKA</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">
          Your account has been created. We're excited to have you on board.
        </p>
        <a href="${process.env.APP_URL ?? process.env.NEXTAUTH_URL}/login"
           style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600;">
          Sign In
        </a>
      </div>
    `,
  };
}

export function verifyEmail(name: string, to: string, token: string): EmailTemplate {
  const url = `${process.env.APP_URL ?? process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  return {
    to,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a;">Verify Your Email</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">
          Please verify your email address to activate your account.
        </p>
        <a href="${url}"
           style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600;">
          Verify Email
        </a>
        <p style="font-size: 14px; color: #94a3b8; margin-top: 24px;">
          This link expires in 24 hours. If you didn't create an account, you can ignore this email.
        </p>
      </div>
    `,
  };
}

export function forgotPasswordEmail(name: string, to: string, token: string): EmailTemplate {
  const url = `${process.env.APP_URL ?? process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  return {
    to,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a;">Reset Your Password</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">
          We received a request to reset your password. Click the button below to choose a new one.
        </p>
        <a href="${url}"
           style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600;">
          Reset Password
        </a>
        <p style="font-size: 14px; color: #94a3b8; margin-top: 24px;">
          This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  };
}

export function resetPasswordEmail(name: string, to: string): EmailTemplate {
  return {
    to,
    subject: 'Your password has been reset',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a;">Password Reset Complete</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
      </div>
    `,
  };
}

export function contactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
}): EmailTemplate {
  return {
    to: process.env.ADMIN_EMAIL ?? 'admin@hyaska.com',
    subject: `New contact form submission from ${data.name}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a;">New Contact Submission</h1>
        <table style="width: 100%; font-size: 16px; color: #475569; line-height: 1.8;">
          <tr><td style="font-weight: 600; width: 120px;">Name:</td><td>${data.name}</td></tr>
          <tr><td style="font-weight: 600;">Email:</td><td>${data.email}</td></tr>
          <tr><td style="font-weight: 600;">Phone:</td><td>${data.phone ?? 'N/A'}</td></tr>
          <tr><td style="font-weight: 600;">Company:</td><td>${data.company ?? 'N/A'}</td></tr>
          <tr><td style="font-weight: 600;">Service:</td><td>${data.service ?? 'N/A'}</td></tr>
          <tr><td style="font-weight: 600;">Budget:</td><td>${data.budget ?? 'N/A'}</td></tr>
        </table>
        <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-top: 24px;">Message</h2>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">${data.message}</p>
      </div>
    `,
  };
}

export function newsletterConfirmationEmail(to: string): EmailTemplate {
  return {
    to,
    subject: 'Welcome to the HYASCKA newsletter',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a;">You're In!</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">
          Thanks for subscribing to the HYASCKA newsletter. You'll now receive our latest AI insights,
          engineering deep dives, and product updates.
        </p>
      </div>
    `,
  };
}

export function offerSentEmail(params: {
  clientName: string;
  to: string;
  offerTitle: string;
  offerNumber: string;
  total: string;
  currency: string;
  validUntil?: string;
}): EmailTemplate {
  return {
    to: params.to,
    subject: `New offer from HYASCKA: ${params.offerTitle}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a;">You have a new offer</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hi ${params.clientName}, HYASCKA has prepared a custom offer for you.</p>
        <table style="width: 100%; font-size: 16px; color: #475569; line-height: 1.8; margin-top: 16px;">
          <tr><td style="font-weight: 600; width: 140px;">Offer:</td><td>${params.offerTitle}</td></tr>
          <tr><td style="font-weight: 600;">Reference:</td><td>${params.offerNumber}</td></tr>
          <tr><td style="font-weight: 600;">Total:</td><td>${params.currency} ${params.total}</td></tr>
          ${params.validUntil ? `<tr><td style="font-weight: 600;">Valid until:</td><td>${params.validUntil}</td></tr>` : ''}
        </table>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-top: 24px;">Log in to your HYASCKA dashboard to review and respond.</p>
      </div>
    `,
  };
}

export function offerResponseStaffEmail(params: {
  to: string;
  staffName: string;
  offerTitle: string;
  offerNumber: string;
  accepted: boolean;
  rejectReason?: string;
}): EmailTemplate {
  return {
    to: params.to,
    subject: `Offer ${params.accepted ? 'accepted' : 'rejected'}: ${params.offerTitle}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a;">
          Offer ${params.accepted ? 'Accepted' : 'Rejected'}
        </h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hi ${params.staffName}, your offer <strong>${params.offerTitle}</strong> (${params.offerNumber}) was ${params.accepted ? 'accepted' : 'rejected'} by the client.</p>
        ${params.rejectReason ? `<p style="font-size: 16px; color: #475569; line-height: 1.6;">Reason: ${params.rejectReason}</p>` : ''}
      </div>
    `,
  };
}

export function clientInvitationEmail(params: {
  to: string;
  leadName: string;
  invitedByName: string;
  token: string;
  expiresInDays: number;
}): EmailTemplate {
  const url = `${process.env.APP_URL ?? process.env.NEXTAUTH_URL}/accept-invite?token=${params.token}`;
  return {
    to: params.to,
    subject: 'You have been invited to your HYASCKA client account',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a;">You're invited to HYASCKA</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hi ${params.leadName},</p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6;">
          ${params.invitedByName} at HYASCKA has invited you to set up a client account so you can
          securely review your custom offer, track your orders, and message our team directly.
        </p>
        <a href="${url}"
           style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600;">
          Set Up My Account
        </a>
        <p style="font-size: 14px; color: #94a3b8; margin-top: 24px;">
          This invitation link expires in ${params.expiresInDays} days and can only be used once.
          If you weren't expecting this invitation, you can safely ignore this email — no account
          will be created without you completing the setup.
        </p>
      </div>
    `,
  };
}

export { sendEmail };