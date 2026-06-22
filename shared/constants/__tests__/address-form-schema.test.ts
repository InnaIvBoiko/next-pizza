import { describe, it, expect } from 'vitest';
import { makeAddressFormSchema, formatAddress } from '../address-form-schema';
import type { Dictionary } from '@/shared/lib/i18n/types';

const v = {
    street: 'Via non valida',
    houseNumber: 'Civico non valido',
    city: 'Città non valida',
    postalCode: 'CAP non valido',
} as Dictionary['addressValidation'];

const schema = makeAddressFormSchema(v);

const valid = {
    street: 'Via Roma',
    houseNumber: '1',
    city: 'Milano',
    postalCode: '20100',
};

describe('makeAddressFormSchema', () => {
    it('accepts a valid address', () => {
        expect(schema.safeParse(valid).success).toBe(true);
    });

    it('accepts optional isDefault field', () => {
        expect(schema.safeParse({ ...valid, isDefault: true }).success).toBe(true);
    });

    it('rejects street shorter than 2 chars', () => {
        const result = schema.safeParse({ ...valid, street: 'A' });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(v.street);
    });

    it('rejects empty houseNumber', () => {
        const result = schema.safeParse({ ...valid, houseNumber: '' });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(v.houseNumber);
    });

    it('rejects non-5-digit postal code', () => {
        const result = schema.safeParse({ ...valid, postalCode: '1234' });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(v.postalCode);
    });

    it('rejects postal code with letters', () => {
        const result = schema.safeParse({ ...valid, postalCode: '2010X' });
        expect(result.success).toBe(false);
    });
});

describe('formatAddress', () => {
    it('composes fields into a single line', () => {
        expect(formatAddress({ street: 'Via Roma', houseNumber: '1', city: 'Milano', postalCode: '20100' }))
            .toBe('Via Roma 1, 20100 Milano');
    });

    it('trims whitespace from each field', () => {
        expect(formatAddress({ street: '  Via Roma  ', houseNumber: ' 1 ', city: ' Milano ', postalCode: ' 20100 ' }))
            .toBe('Via Roma 1, 20100 Milano');
    });
});
