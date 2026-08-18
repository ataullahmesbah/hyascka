import { z } from 'zod';

// ─────────────────────────────────────
// Auth Schemas
// ─────────────────────────────────────

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, 'Password must include uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, 'Password must include uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, 'Password must include uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ─────────────────────────────────────
// Contact Schema
// ─────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
  isCustomRequest: z.boolean().optional(),
});

// ─────────────────────────────────────
// Newsletter Schema
// ─────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
});

// ─────────────────────────────────────
// Blog Schema
// ─────────────────────────────────────

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().max(200).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  contentImages: z.array(z.string()).default([]),
  authorDesignation: z.string().max(200).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'SCHEDULED', 'REJECTED', 'ARCHIVED']).default('DRAFT'),
  categoryId: z.string().optional(),
  readingTime: z.number().int().min(1).max(60).default(5),
});

// ─────────────────────────────────────
// Client Testimonial Submission Schema
// ─────────────────────────────────────

export const testimonialSubmitSchema = z.object({
  quote: z.string().min(10, 'Tell us a bit more').max(1000),
  position: z.string().min(1, 'Your role/title is required').max(100),
  company: z.string().max(100).optional(),
  rating: z.number().int().min(1).max(5).default(5),
  image: z.string().optional(),
  projectId: z.string().optional(),
  serviceId: z.string().optional(),
  permissionToPublish: z.boolean().default(true),
});

// ─────────────────────────────────────
// Blog Comment Schema
// ─────────────────────────────────────

export const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  content: z.string().min(3, 'Comment is too short').max(2000, 'Comment is too long'),
  // Honeypot: a real visitor never sees or fills this field (hidden via
  // CSS in the form); a bot filling every field in a scraped form will.
  // Non-empty here means "silently accept but never persist" rather than
  // erroring, so the bot gets no signal that it was caught.
  website: z.string().max(0, 'Spam detected').optional(),
});

// ─────────────────────────────────────
// Project Schema
// ─────────────────────────────────────

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().max(200).optional(),
  category: z.string().min(1, 'Category is required'),
  overview: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  outcome: z.string().optional(),
  image: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).default('COMPLETED'),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
  projectUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  clientName: z.string().max(200).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

// ─────────────────────────────────────
// Types
// ─────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;