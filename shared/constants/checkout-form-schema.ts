import { z } from 'zod';

export const checkoutFormSchema = z.object({
    firstName: z
        .string()
        .min(2, {
            message: 'The first name must be at least 2 characters long',
        }),
    lastName: z
        .string()
        .min(2, {
            message: 'The last name must be at least 2 characters long',
        }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
    address: z.string().min(5, { message: 'Please enter a valid address' }),
    comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
