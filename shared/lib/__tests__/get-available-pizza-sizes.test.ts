import { describe, it, expect } from 'vitest';
import { getAvailablePizzaSizes } from '../get-available-pizza-sizes';
import type { ProductItem } from '@/generated/prisma/client';
import type { Dictionary } from '@/shared/lib/i18n/types';

const dict = {
    pizza: {
        sizes: { '20': 'Piccola', '30': 'Media', '40': 'Grande' },
        types: { '1': 'tradizionale', '2': 'sottile' },
    },
} as unknown as Dictionary;

const makeItem = (pizzaType: number, size: number): ProductItem =>
    ({ pizzaType, size }) as ProductItem;

describe('getAvailablePizzaSizes', () => {
    it('marks sizes as enabled when items for that type exist', () => {
        const items = [makeItem(1, 20), makeItem(1, 30)];
        const result = getAvailablePizzaSizes(1, items, dict);

        expect(result.find(v => v.value === '20')?.disabled).toBe(false);
        expect(result.find(v => v.value === '30')?.disabled).toBe(false);
        expect(result.find(v => v.value === '40')?.disabled).toBe(true);
    });

    it('disables all sizes when no items exist for the type', () => {
        const result = getAvailablePizzaSizes(2, [], dict);
        expect(result.every(v => v.disabled)).toBe(true);
    });

    it('returns all three size variants', () => {
        const result = getAvailablePizzaSizes(1, [], dict);
        expect(result.map(v => v.value)).toEqual(['20', '30', '40']);
    });

    it('uses localized names from dictionary', () => {
        const result = getAvailablePizzaSizes(1, [], dict);
        expect(result[0].name).toBe('Piccola');
        expect(result[1].name).toBe('Media');
        expect(result[2].name).toBe('Grande');
    });
});
