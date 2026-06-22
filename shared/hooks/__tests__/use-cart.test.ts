import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCart } from '../use-cart';
import { useCartStore } from '@/shared/store/cart';

// Mock the store so we control its output and can observe fetchCartItems calls
const mockFetchCartItems = vi.fn().mockResolvedValue(undefined);

vi.mock('@/shared/store/cart', () => ({
    useCartStore: vi.fn(),
}));

const mockState = {
    items: [],
    totalAmount: 0,
    loading: false,
    error: false,
    fetchCartItems: mockFetchCartItems,
    addCartItem: vi.fn(),
    updateItemQuantity: vi.fn(),
    removeCartItem: vi.fn(),
};

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCartStore).mockImplementation((selector?: (s: typeof mockState) => unknown) =>
        selector ? selector(mockState) : mockState
    );
});

describe('useCart', () => {
    it('calls fetchCartItems on mount', () => {
        renderHook(() => useCart());
        expect(mockFetchCartItems).toHaveBeenCalledTimes(1);
    });

    it('does not call fetchCartItems again on re-render', () => {
        const { rerender } = renderHook(() => useCart());
        rerender();
        expect(mockFetchCartItems).toHaveBeenCalledTimes(1);
    });

    it('returns all cart state fields', () => {
        const { result } = renderHook(() => useCart());

        expect(result.current.items).toEqual([]);
        expect(result.current.totalAmount).toBe(0);
        expect(result.current.loading).toBe(false);
        expect(typeof result.current.addCartItem).toBe('function');
        expect(typeof result.current.removeCartItem).toBe('function');
        expect(typeof result.current.updateItemQuantity).toBe('function');
    });
});
