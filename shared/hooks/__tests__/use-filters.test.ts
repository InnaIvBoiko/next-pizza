import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilters } from '../use-filters';

const mockGet = vi.fn().mockReturnValue(null);

vi.mock('next/navigation', () => ({
    useSearchParams: () => ({ get: mockGet }),
}));

beforeEach(() => {
    mockGet.mockReturnValue(null);
});

describe('useFilters', () => {
    it('initializes with empty sets and no price bounds', () => {
        const { result } = renderHook(() => useFilters());

        expect(result.current.sizes.size).toBe(0);
        expect(result.current.pizzaTypes.size).toBe(0);
        expect(result.current.selectedIngredients.size).toBe(0);
        expect(result.current.prices.priceFrom).toBeUndefined();
        expect(result.current.prices.priceTo).toBeUndefined();
    });

    it('seeds sizes from URL params', () => {
        mockGet.mockImplementation((key: string) =>
            key === 'sizes' ? '20,30' : null
        );
        const { result } = renderHook(() => useFilters());

        expect(result.current.sizes).toEqual(new Set(['20', '30']));
    });

    it('seeds prices from URL params', () => {
        mockGet.mockImplementation((key: string) => {
            if (key === 'priceFrom') return '5';
            if (key === 'priceTo') return '20';
            return null;
        });
        const { result } = renderHook(() => useFilters());

        expect(result.current.prices.priceFrom).toBe(5);
        expect(result.current.prices.priceTo).toBe(20);
    });

    it('setSizes toggles a size on and off', () => {
        const { result } = renderHook(() => useFilters());

        act(() => result.current.setSizes('30'));
        expect(result.current.sizes.has('30')).toBe(true);

        act(() => result.current.setSizes('30'));
        expect(result.current.sizes.has('30')).toBe(false);
    });

    it('setPizzaTypes toggles a pizza type', () => {
        const { result } = renderHook(() => useFilters());

        act(() => result.current.setPizzaTypes('2'));
        expect(result.current.pizzaTypes.has('2')).toBe(true);
    });

    it('setPrices updates individual price bounds independently', () => {
        const { result } = renderHook(() => useFilters());

        act(() => result.current.setPrices('priceFrom', 10));
        act(() => result.current.setPrices('priceTo', 50));

        expect(result.current.prices.priceFrom).toBe(10);
        expect(result.current.prices.priceTo).toBe(50);
    });

    it('setPrices with undefined clears a bound', () => {
        mockGet.mockImplementation((key: string) =>
            key === 'priceFrom' ? '10' : null
        );
        const { result } = renderHook(() => useFilters());

        act(() => result.current.setPrices('priceFrom', undefined));
        expect(result.current.prices.priceFrom).toBeUndefined();
    });
});
