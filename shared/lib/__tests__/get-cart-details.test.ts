import { describe, it, expect } from 'vitest';
import { getCartDetails } from '../get-cart-details';
import type { CartDTO } from '@/shared/services/dto/cart.dto';

const makeDTO = (overrides?: Partial<CartDTO>): CartDTO => ({
    id: 1,
    totalAmount: 1000,
    items: [
        {
            id: 10,
            quantity: 2,
            productItem: {
                id: 5,
                price: 400,
                size: 30,
                pizzaType: 1,
                product: { id: 1, name: 'Margherita', imageUrl: '/img.png' },
            },
            ingredients: [{ id: 1, name: 'Mozzarella', price: 50, imageUrl: '' }],
            removedIngredients: [{ id: 2, name: 'Basilico' }],
        },
    ],
    ...overrides,
});

describe('getCartDetails', () => {
    it('maps item fields correctly', () => {
        const { items } = getCartDetails(makeDTO());
        const item = items[0];

        expect(item.id).toBe(10);
        expect(item.quantity).toBe(2);
        expect(item.name).toBe('Margherita');
        expect(item.imageUrl).toBe('/img.png');
        expect(item.pizzaSize).toBe(30);
        expect(item.pizzaType).toBe(1);
        expect(item.disabled).toBe(false);
    });

    it('calculates price as (productItem.price + ingredients) * quantity', () => {
        const { items } = getCartDetails(makeDTO());
        // (400 + 50) * 2 = 900
        expect(items[0].price).toBe(900);
    });

    it('maps ingredients and removedIngredients', () => {
        const { items } = getCartDetails(makeDTO());

        expect(items[0].ingredients).toEqual([{ name: 'Mozzarella', price: 50 }]);
        expect(items[0].removedIngredients).toEqual([{ name: 'Basilico' }]);
    });

    it('passes totalAmount from DTO', () => {
        const { totalAmount } = getCartDetails(makeDTO({ totalAmount: 500 }));
        expect(totalAmount).toBe(500);
    });

    it('returns empty items array for empty cart', () => {
        const { items, totalAmount } = getCartDetails(makeDTO({ items: [], totalAmount: 0 }));
        expect(items).toHaveLength(0);
        expect(totalAmount).toBe(0);
    });
});
