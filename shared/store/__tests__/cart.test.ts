import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCartStore } from '../cart';
import type { CartDTO } from '@/shared/services/dto/cart.dto';

const { mockGetCart, mockAddCartItem, mockUpdateItemQuantity, mockRemoveCartItem } = vi.hoisted(() => ({
    mockGetCart: vi.fn(),
    mockAddCartItem: vi.fn(),
    mockUpdateItemQuantity: vi.fn(),
    mockRemoveCartItem: vi.fn(),
}));

vi.mock('@/shared/services/api-client', () => ({
    Api: {
        cart: {
            getCart: mockGetCart,
            addCartItem: mockAddCartItem,
            updateItemQuantity: mockUpdateItemQuantity,
            removeCartItem: mockRemoveCartItem,
        },
    },
}));

const emptyCart: CartDTO = { id: 1, totalAmount: 0, items: [] };

const cartWithItem: CartDTO = {
    id: 1,
    totalAmount: 900,
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
            removedIngredients: [],
        },
    ],
};

beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store to initial state between tests
    useCartStore.setState({ items: [], totalAmount: 0, error: false, loading: false });
});

describe('useCartStore', () => {
    describe('fetchCartItems', () => {
        it('populates items and totalAmount on success', async () => {
            mockGetCart.mockResolvedValue(cartWithItem);
            const { result } = renderHook(() => useCartStore());

            await act(() => result.current.fetchCartItems());

            expect(result.current.items).toHaveLength(1);
            expect(result.current.items[0].name).toBe('Margherita');
            expect(result.current.totalAmount).toBe(900);
            expect(result.current.loading).toBe(false);
        });

        it('sets error=true on failure', async () => {
            mockGetCart.mockRejectedValue(new Error('network'));
            const { result } = renderHook(() => useCartStore());

            await act(() => result.current.fetchCartItems());

            expect(result.current.error).toBe(true);
            expect(result.current.loading).toBe(false);
        });
    });

    describe('addCartItem', () => {
        it('updates cart after adding an item', async () => {
            mockAddCartItem.mockResolvedValue(cartWithItem);
            const { result } = renderHook(() => useCartStore());

            await act(() => result.current.addCartItem({ productItemId: 5 }));

            expect(mockAddCartItem).toHaveBeenCalledWith({ productItemId: 5 });
            expect(result.current.items).toHaveLength(1);
        });
    });

    describe('updateItemQuantity', () => {
        it('updates cart after quantity change', async () => {
            mockUpdateItemQuantity.mockResolvedValue(emptyCart);
            const { result } = renderHook(() => useCartStore());

            await act(() => result.current.updateItemQuantity(10, 3));

            expect(mockUpdateItemQuantity).toHaveBeenCalledWith(10, 3);
        });
    });

    describe('removeCartItem', () => {
        it('disables item optimistically before API call resolves', async () => {
            useCartStore.setState({
                items: [{ id: 10, name: 'Margherita', quantity: 1, price: 500,
                    imageUrl: '', ingredients: [], removedIngredients: [], disabled: false }],
                totalAmount: 500,
            });

            // Deferred promise: we control when the API "responds"
            let resolveRemove!: (v: CartDTO) => void;
            mockRemoveCartItem.mockReturnValue(
                new Promise<CartDTO>(res => { resolveRemove = res; })
            );

            const { result } = renderHook(() => useCartStore());

            // Start the action but don't await — the optimistic setState runs synchronously
            act(() => { result.current.removeCartItem(10); });

            // Optimistic disable has been applied; API hasn't responded yet
            expect(result.current.items[0].disabled).toBe(true);

            // Resolve the API call and wait for cleanup
            await act(async () => { resolveRemove(emptyCart); });

            expect(result.current.items).toHaveLength(0);
        });

        it('sets error=true on failure', async () => {
            useCartStore.setState({
                items: [{ id: 10, name: 'Margherita', quantity: 1, price: 500,
                    imageUrl: '', ingredients: [], removedIngredients: [], disabled: false }],
                totalAmount: 500,
            });
            mockRemoveCartItem.mockRejectedValue(new Error('network'));
            const { result } = renderHook(() => useCartStore());

            await act(() => result.current.removeCartItem(10));

            expect(result.current.error).toBe(true);
        });
    });
});
