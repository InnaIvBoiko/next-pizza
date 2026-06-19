import { z } from 'zod';
import type { Dictionary } from '@/shared/lib/i18n/types';

type V = Dictionary['addressValidation'];

// Structured delivery-address form: street/number/city/postal code are entered
// separately, then composed into a single line (see `formatAddress`).
export const makeAddressFormSchema = (v: V) =>
    z.object({
        street: z.string().min(2, { message: v.street }),
        houseNumber: z.string().min(1, { message: v.houseNumber }),
        city: z.string().min(2, { message: v.city }),
        // Italian CAP: exactly five digits.
        postalCode: z.string().regex(/^\d{5}$/, { message: v.postalCode }),
        isDefault: z.boolean().optional(),
    });

export type AddressFormValues = z.infer<ReturnType<typeof makeAddressFormSchema>>;

/**
 * Compose the structured parts into the single line stored as `formatted` and
 * reused on the checkout `address` field / Order.address, e.g.
 * "Via Roma 1, 20100 Milano".
 */
export const formatAddress = (a: {
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
}): string =>
    `${a.street.trim()} ${a.houseNumber.trim()}, ${a.postalCode.trim()} ${a.city.trim()}`;
