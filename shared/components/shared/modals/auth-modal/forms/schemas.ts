import { z } from 'zod';
import type { Dictionary } from '@/shared/lib/i18n/types';

type V = Dictionary['validation'];

export const makeLoginSchema = (v: V) =>
    z.object({
        email: z.string().email({ message: v.email }),
        password: z.string().min(4, { message: v.password }),
    });

export const makeRegisterSchema = (v: V) =>
    makeLoginSchema(v)
        .merge(
            z.object({
                fullName: z.string().min(2, { message: v.fullName }),
                confirmPassword: z.string().min(4, { message: v.password }),
            })
        )
        .refine(data => data.password === data.confirmPassword, {
            message: v.passwordMismatch,
            path: ['confirmPassword'],
        });

// Profile update: name/email are required, but the password is optional —
// an empty password field means "keep the current password".
export const makeProfileSchema = (v: V) =>
    z
        .object({
            email: z.string().email({ message: v.email }),
            fullName: z.string().min(2, { message: v.fullName }),
            password: z.string().optional(),
            confirmPassword: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            if (!data.password) {
                return;
            }

            if (data.password.length < 4) {
                ctx.addIssue({
                    code: 'custom',
                    message: v.password,
                    path: ['password'],
                });
            }

            if (data.password !== data.confirmPassword) {
                ctx.addIssue({
                    code: 'custom',
                    message: v.passwordMismatch,
                    path: ['confirmPassword'],
                });
            }
        });

export type TFormLoginValues = z.infer<ReturnType<typeof makeLoginSchema>>;
export type TFormRegisterValues = z.infer<ReturnType<typeof makeRegisterSchema>>;
export type TFormProfileValues = z.infer<ReturnType<typeof makeProfileSchema>>;
