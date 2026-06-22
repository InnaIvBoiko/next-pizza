import { describe, it, expect } from 'vitest';
import { getPizzaDetails } from '../get-pizza-details';
import type { Ingredient, ProductItem } from '@/generated/prisma/client';
import type { Dictionary } from '@/shared/lib/i18n/types';

const dict = {
    pizza: {
        sizes: { '20': 'Piccola', '30': 'Media', '40': 'Grande' },
        types: { '1': 'tradizionale', '2': 'sottile' },
    },
    product: { detailsTemplate: '{size} cm, {type} pizza' },
} as unknown as Dictionary;

const items: ProductItem[] = [
    { pizzaType: 1, size: 30, price: 899 } as ProductItem,
    { pizzaType: 2, size: 20, price: 649 } as ProductItem,
];

const ingredients: Ingredient[] = [
    { id: 1, price: 59 } as Ingredient,
    { id: 2, price: 79 } as Ingredient,
];

describe('getPizzaDetails', () => {
    it('returns correct totalPrice with no selected ingredients', () => {
        const { totalPrice } = getPizzaDetails(1, 30, items, ingredients, new Set(), dict);
        expect(totalPrice).toBe(899);
    });

    it('returns correct totalPrice with selected ingredients', () => {
        const { totalPrice } = getPizzaDetails(1, 30, items, ingredients, new Set([1, 2]), dict);
        expect(totalPrice).toBe(899 + 59 + 79);
    });

    it('returns formatted textDetaills string', () => {
        const { textDetaills } = getPizzaDetails(1, 30, items, ingredients, new Set(), dict);
        expect(textDetaills).toBe('30 cm, tradizionale pizza');
    });

    it('uses correct type name in details for type 2', () => {
        const { textDetaills } = getPizzaDetails(2, 20, items, ingredients, new Set(), dict);
        expect(textDetaills).toBe('20 cm, sottile pizza');
    });
});
