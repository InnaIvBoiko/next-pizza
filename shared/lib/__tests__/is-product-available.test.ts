import { describe, it, expect } from 'vitest';
import { isProductAvailable } from '../is-product-available';

describe('isProductAvailable', () => {
    it('returns true when product and all ingredients are available', () => {
        expect(isProductAvailable({
            available: true,
            ingredients: [{ available: true }, { available: true }],
        })).toBe(true);
    });

    it('returns false when product itself is marked unavailable', () => {
        expect(isProductAvailable({
            available: false,
            ingredients: [{ available: true }],
        })).toBe(false);
    });

    it('returns false when any ingredient is unavailable', () => {
        expect(isProductAvailable({
            available: true,
            ingredients: [{ available: true }, { available: false }],
        })).toBe(false);
    });

    it('returns true when ingredient list is empty (e.g. a drink)', () => {
        expect(isProductAvailable({ available: true, ingredients: [] })).toBe(true);
    });
});
