import { describe, it, expect } from 'vitest';
import { calcCartItemTotalPrice } from '../calc-cart-item-total-price';
import type { CartItemDTO } from '@/shared/services/dto/cart.dto';

const makeItem = (price: number, ingredients: number[], quantity: number): CartItemDTO =>
    ({
        productItem: { price } as CartItemDTO['productItem'],
        ingredients: ingredients.map(p => ({ price: p }) as CartItemDTO['ingredients'][number]),
        quantity,
    }) as CartItemDTO;

describe('calcCartItemTotalPrice', () => {
    it('calculates price with no ingredients', () => {
        expect(calcCartItemTotalPrice(makeItem(500, [], 1))).toBe(500);
    });

    it('multiplies by quantity', () => {
        expect(calcCartItemTotalPrice(makeItem(500, [], 3))).toBe(1500);
    });

    it('adds ingredient prices before multiplying by quantity', () => {
        expect(calcCartItemTotalPrice(makeItem(500, [50, 100], 2))).toBe((500 + 50 + 100) * 2);
    });
});
