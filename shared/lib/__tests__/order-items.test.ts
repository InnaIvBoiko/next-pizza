import { describe, it, expect } from 'vitest';
import { orderItemsSummary } from '../order-items';

const item = (name: string, qty: number) => ({
    quantity: qty,
    productItem: { product: { name } },
});

describe('orderItemsSummary', () => {
    it('formats a single item', () => {
        expect(orderItemsSummary([item('Margherita', 1)])).toBe('Margherita × 1');
    });

    it('joins multiple items with ·', () => {
        expect(orderItemsSummary([item('Margherita', 2), item('Diavola', 1)]))
            .toBe('Margherita × 2 · Diavola × 1');
    });

    it('parses a JSON string input', () => {
        const json = JSON.stringify([item('Margherita', 3)]);
        expect(orderItemsSummary(json)).toBe('Margherita × 3');
    });

    it('returns empty string for an empty array', () => {
        expect(orderItemsSummary([])).toBe('');
    });

    it('returns empty string for invalid JSON', () => {
        expect(orderItemsSummary('not valid json {')).toBe('');
    });

    it('skips items without a product name', () => {
        const items = [item('Margherita', 1), { quantity: 1, productItem: {} }];
        expect(orderItemsSummary(items)).toBe('Margherita × 1');
    });

    it('returns empty string for null input', () => {
        expect(orderItemsSummary(null)).toBe('');
    });
});
