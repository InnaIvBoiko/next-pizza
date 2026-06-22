import { describe, it, expect } from 'vitest';
import { formatPrice } from '../format-price';

describe('formatPrice', () => {
    it('formats whole numbers with two decimals', () => {
        expect(formatPrice(12)).toBe('€ 12,00');
    });

    it('uses comma as decimal separator', () => {
        expect(formatPrice(9.5)).toBe('€ 9,50');
    });

    it('rounds to two decimal places', () => {
        expect(formatPrice(1.999)).toBe('€ 2,00');
    });

    it('formats zero', () => {
        expect(formatPrice(0)).toBe('€ 0,00');
    });
});
