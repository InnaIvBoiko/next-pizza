import { describe, it, expect } from 'vitest';
import { getCartItemDetails } from '../get-cart-item-details';
import type { Dictionary } from '@/shared/lib/i18n/types';

const dict = {
    pizza: {
        sizes: { '20': 'Piccola', '30': 'Media', '40': 'Grande' },
        types: { '1': 'tradizionale', '2': 'sottile' },
    },
    cart: { itemDetailsTemplate: '{type} {size} cm' },
    product: { without: 'senza' },
} as unknown as Dictionary;

describe('getCartItemDetails', () => {
    it('formats pizza type and size', () => {
        expect(getCartItemDetails(dict, [], [], 1, 30)).toBe('tradizionale 30 cm');
    });

    it('appends ingredient names', () => {
        const result = getCartItemDetails(dict, [{ name: 'Mozzarella', price: 50 }], [], 1, 30);
        expect(result).toBe('tradizionale 30 cm, Mozzarella');
    });

    it('prefixes removed ingredients with "senza"', () => {
        const result = getCartItemDetails(dict, [], [{ name: 'Basilico' }], 1, 30);
        expect(result).toBe('tradizionale 30 cm, senza Basilico');
    });

    it('combines pizza info, removed, and added ingredients', () => {
        const result = getCartItemDetails(
            dict,
            [{ name: 'Mozzarella', price: 50 }],
            [{ name: 'Basilico' }],
            1, 30
        );
        expect(result).toBe('tradizionale 30 cm, senza Basilico, Mozzarella');
    });

    it('returns just ingredient names when no pizza size/type provided', () => {
        const result = getCartItemDetails(dict, [{ name: 'Mozzarella', price: 50 }], []);
        expect(result).toBe('Mozzarella');
    });

    it('returns empty string for a non-pizza product with no ingredients', () => {
        expect(getCartItemDetails(dict, [], [])).toBe('');
    });
});
