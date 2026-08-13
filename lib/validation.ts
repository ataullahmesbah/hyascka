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
  slug: z.string().min(1, 'Slug is required').max(200),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  categoryId: z.string().optional(),
  readingTime: z.number().int().min(1).max(60).default(5),
});

// ─────────────────────────────────────
// Project Schema
// ─────────────────────────────────────

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  category: z.string().min(1, 'Category is required'),
  overview: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  outcome: z.string().optional(),
  image: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).default('COMPLETED'),
  featured: z.boolean().default(false),
});

// ─────────────────────────────────────
// Types
// ─────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;