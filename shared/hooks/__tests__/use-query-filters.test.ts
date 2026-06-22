import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQueryFilters } from '../use-query-filters';
import type { Filters } from '../use-filters';

const mockReplace = vi.fn();
const mockGet = vi.fn().mockReturnValue(null);

vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace: mockReplace }),
    useSearchParams: () => ({ get: mockGet }),
}));

const emptyFilters: Filters = {
    sizes: new Set(),
    pizzaTypes: new Set(),
    selectedIngredients: new Set(),
    prices: {},
};

beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(null);
});

describe('useQueryFilters', () => {
    it('does not call router.replace on first render (skips initial sync)', () => {
        renderHook(() => useQueryFilters(emptyFilters));
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('calls router.replace when filters change after mount', () => {
        const { rerender } = renderHook(
            ({ filters }) => useQueryFilters(filters),
            { initialProps: { filters: emptyFilters } }
        );

        const updated: Filters = {
            ...emptyFilters,
            sizes: new Set(['30']),
        };

        rerender({ filters: updated });

        expect(mockReplace).toHaveBeenCalledTimes(1);
        expect(mockReplace).toHaveBeenCalledWith('?sizes=30', { scroll: false });
    });

    it('builds URL with multiple filter groups', () => {
        const { rerender } = renderHook(
            ({ filters }) => useQueryFilters(filters),
            { initialProps: { filters: emptyFilters } }
        );

        rerender({
            filters: {
                sizes: new Set(['20', '30']),
                pizzaTypes: new Set(['1']),
                selectedIngredients: new Set(['5']),
                prices: { priceFrom: 10, priceTo: 40 },
            },
        });

        expect(mockReplace).toHaveBeenCalledTimes(1);
        const [url] = mockReplace.mock.calls[0];
        expect(url).toContain('sizes=20%2C30');
        expect(url).toContain('pizzaTypes=1');
        expect(url).toContain('ingredients=5');
        expect(url).toContain('priceFrom=10');
        expect(url).toContain('priceTo=40');
    });

    it('replaces with bare ? when all filters are empty after initial mount', () => {
        const { rerender } = renderHook(
            ({ filters }) => useQueryFilters(filters),
            { initialProps: { filters: { ...emptyFilters, sizes: new Set(['30']) } } }
        );

        rerender({ filters: emptyFilters });

        expect(mockReplace).toHaveBeenCalledWith('?', { scroll: false });
    });

    it('preserves existing sort param from URL', () => {
        mockGet.mockImplementation((key: string) => key === 'sort' ? 'priceAsc' : null);

        const { rerender } = renderHook(
            ({ filters }) => useQueryFilters(filters),
            { initialProps: { filters: emptyFilters } }
        );

        rerender({ filters: { ...emptyFilters, sizes: new Set(['30']) } });

        const [url] = mockReplace.mock.calls[0];
        expect(url).toContain('sort=priceAsc');
    });
});
