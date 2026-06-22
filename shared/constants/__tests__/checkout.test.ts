import { describe, it, expect } from 'vitest';
import { VAT, DELIVERY_PRICE, FREE_DELIVERY_THRESHOLD, getDeliveryPrice } from '../checkout';

describe('checkout constants', () => {
    it('VAT is 10%', () => {
        expect(VAT).toBe(10);
    });

    it('DELIVERY_PRICE is 3.5', () => {
        expect(DELIVERY_PRICE).toBe(3.5);
    });

    it('FREE_DELIVERY_THRESHOLD is 25', () => {
        expect(FREE_DELIVERY_THRESHOLD).toBe(25);
    });
});

describe('getDeliveryPrice', () => {
    it('returns DELIVERY_PRICE below threshold', () => {
        expect(getDeliveryPrice(0)).toBe(DELIVERY_PRICE);
        expect(getDeliveryPrice(24.99)).toBe(DELIVERY_PRICE);
    });

    it('returns 0 at exactly the threshold', () => {
        expect(getDeliveryPrice(25)).toBe(0);
    });

    it('returns 0 above threshold', () => {
        expect(getDeliveryPrice(100)).toBe(0);
    });
});
