import { describe, it, expect } from 'vitest';
import { makeCheckoutFormSchema } from '../checkout-form-schema';
import type { Dictionary } from '@/shared/lib/i18n/types';

const v = {
    firstName: 'Nome troppo corto',
    lastName: 'Cognome troppo corto',
    email: 'Email non valida',
    phone: 'Telefono non valido',
    address: 'Indirizzo non valido',
} as Dictionary['checkoutValidation'];

const schema = makeCheckoutFormSchema(v);

const valid = {
    firstName: 'Mario',
    lastName: 'Rossi',
    email: 'mario@example.com',
    phone: '3331234567',
    address: 'Via Roma 1, 20100 Milano',
    comment: '',
};

describe('makeCheckoutFormSchema', () => {
    it('accepts a fully valid payload', () => {
        expect(schema.safeParse(valid).success).toBe(true);
    });

    it('accepts a payload without comment (optional)', () => {
        const { comment: _, ...noComment } = valid;
        expect(schema.safeParse(noComment).success).toBe(true);
    });

    it('rejects firstName shorter than 2 chars', () => {
        const result = schema.safeParse({ ...valid, firstName: 'A' });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(v.firstName);
    });

    it('rejects invalid email', () => {
        const result = schema.safeParse({ ...valid, email: 'not-an-email' });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(v.email);
    });

    it('rejects phone shorter than 10 chars', () => {
        const result = schema.safeParse({ ...valid, phone: '123' });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(v.phone);
    });

    it('rejects address shorter than 5 chars', () => {
        const result = schema.safeParse({ ...valid, address: 'Via' });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(v.address);
    });
});
