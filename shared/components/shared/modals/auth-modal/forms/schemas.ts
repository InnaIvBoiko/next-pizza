import { z } from 'zod';

export const passwordSchema = z
    .string()
    .min(4, { message: 'Password non valida' });

export const formLoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: passwordSchema,
});

export const formRegisterSchema = formLoginSchema
    .merge(
        z.object({
            fullName: z.string().min(2, { message: 'Nome completo non valido' }),
            confirmPassword: passwordSchema,
        })
    )
    .refine(data => data.password === data.confirmPassword, {
        message: 'Le password non coincidono',
        path: ['confirmPassword'],
    });

// Profile update: name/email are required, but the password is optional —
// an empty password field means "keep the current password".
export const formProfileSchema = z
    .object({
        email: z.string().email({ message: 'Email non valida' }),
        fullName: z.string().min(2, { message: 'Invalid full name' }),
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
                message: 'Invalid password',
                path: ['password'],
            });
        }

        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                message: 'Le password non coincidono',
                path: ['confirmPassword'],
            });
        }
    });

export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;
export type TFormProfileValues = z.infer<typeof formProfileSchema>;
