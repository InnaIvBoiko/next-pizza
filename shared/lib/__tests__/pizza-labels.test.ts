import { describe, it, expect } from 'vitest';
import { pizzaSizeName, pizzaTypeName, buildPizzaSizeVariants, buildPizzaTypeVariants } from '../pizza-labels';
import type { Dictionary } from '@/shared/lib/i18n/types';

const dict = {
    pizza: {
        sizes: { '20': 'Piccola', '30': 'Media', '40': 'Grande' },
        types: { '1': 'tradizionale', '2': 'sottile' },
    },
} as unknown as Dictionary;

describe('pizzaSizeName', () => {
    it('returns localized size name', () => {
        expect(pizzaSizeName(dict, 20)).toBe('Piccola');
        expect(pizzaSizeName(dict, 30)).toBe('Media');
        expect(pizzaSizeName(dict, 40)).toBe('Grande');
    });
});

describe('pizzaTypeName', () => {
    it('returns localized type name', () => {
        expect(pizzaTypeName(dict, 1)).toBe('tradizionale');
        expect(pizzaTypeName(dict, 2)).toBe('sottile');
    });
});

describe('buildPizzaSizeVariants', () => {
    it('returns a variant for each size with string value', () => {
        const variants = buildPizzaSizeVariants(dict);
        expect(variants).toHaveLength(3);
        expect(variants.map(v => v.value)).toEqual(['20', '30', '40']);
        expect(variants.map(v => v.name)).toEqual(['Piccola', 'Media', 'Grande']);
    });
});

describe('buildPizzaTypeVariants', () => {
    it('returns a variant for each type with string value', () => {
        const variants = buildPizzaTypeVariants(dict);
        expect(variants).toHaveLength(2);
        expect(variants.map(v => v.value)).toEqual(['1', '2']);
        expect(variants.map(v => v.name)).toEqual(['tradizionale', 'sottile']);
    });
});
