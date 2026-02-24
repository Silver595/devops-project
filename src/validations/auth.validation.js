import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password must be less than 128 characters'),
  role: z
    .enum(['user', 'admin'], { message: 'Role must be either user or admin' })
    .default('user'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .trim(),
});
