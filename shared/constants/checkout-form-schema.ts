import { z } from 'zod';
import type { Dictionary } from '@/shared/lib/i18n/types';

type V = Dictionary['checkoutValidation'];

export const makeCheckoutFormSchema = (v: V) =>
    z.object({
        firstName: z.string().min(2, { message: v.firstName }),
        lastName: z.string().min(2, { message: v.lastName }),
        email: z.string().email({ message: v.email }),
        phone: z.string().min(10, { message: v.phone }),
        address: z.string().min(5, { message: v.address }),
        comment: z.string().optional(),
    });

export type CheckoutFormValues = z.infer<
    ReturnType<typeof makeCheckoutFormSchema>
>;
