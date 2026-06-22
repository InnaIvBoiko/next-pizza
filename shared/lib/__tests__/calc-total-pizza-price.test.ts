import { describe, it, expect } from 'vitest';
import { calcTotalPizzaPrice } from '../calc-total-pizza-price';
import type { Ingredient, ProductItem } from '@/generated/prisma/client';

const makeItem = (type: number, size: number, price: number): ProductItem =>
    ({ pizzaType: type, size, price }) as ProductItem;

const makeIngredient = (id: number, price: number): Ingredient =>
    ({ id, price }) as Ingredient;

const items: ProductItem[] = [
    makeItem(1, 20, 599),
    makeItem(1, 30, 899),
    makeItem(2, 20, 649),
];

const ingredients: Ingredient[] = [
    makeIngredient(1, 59),
    makeIngredient(2, 79),
    makeIngredient(3, 99),
];

describe('calcTotalPizzaPrice', () => {
    it('returns base price when no ingredients are selected', () => {
        expect(calcTotalPizzaPrice(1, 20, items, ingredients, new Set())).toBe(599);
    });

    it('adds selected ingredient prices to base price', () => {
        expect(calcTotalPizzaPrice(1, 20, items, ingredients, new Set([1, 2]))).toBe(599 + 59 + 79);
    });

    it('uses correct base price for type and size combination', () => {
        expect(calcTotalPizzaPrice(1, 30, items, ingredients, new Set())).toBe(899);
        expect(calcTotalPizzaPrice(2, 20, items, ingredients, new Set())).toBe(649);
    });

    it('returns 0 base price when type/size combination does not exist', () => {
        expect(calcTotalPizzaPrice(2, 30, items, ingredients, new Set())).toBe(0);
    });

    it('ignores ingredients not in selectedIngredients', () => {
        expect(calcTotalPizzaPrice(1, 20, items, ingredients, new Set([3]))).toBe(599 + 99);
    });
});
