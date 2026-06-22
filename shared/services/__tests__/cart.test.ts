import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CartDTO } from '../dto/cart.dto';

const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPatch = vi.fn();
const mockDelete = vi.fn();

vi.mock('../instance', () => ({
    axiosInstance: {
        get: mockGet,
        post: mockPost,
        patch: mockPatch,
        delete: mockDelete,
    },
}));

// Import after mock is set up
const { getCart, addCartItem, updateItemQuantity, removeCartItem } = await import('../cart');

const fakeCart: CartDTO = { id: 1, totalAmount: 500, items: [] };

beforeEach(() => {
    vi.clearAllMocks();
});

describe('cart service', () => {
    it('getCart calls GET /api/cart and returns data', async () => {
        mockGet.mockResolvedValue({ data: fakeCart });
        const result = await getCart();
        expect(mockGet).toHaveBeenCalledWith('cart');
        expect(result).toEqual(fakeCart);
    });

    it('addCartItem calls POST cart with values and returns data', async () => {
        mockPost.mockResolvedValue({ data: fakeCart });
        const result = await addCartItem({ productItemId: 5, ingredients: [1, 2] });
        expect(mockPost).toHaveBeenCalledWith('cart', { productItemId: 5, ingredients: [1, 2] });
        expect(result).toEqual(fakeCart);
    });

    it('updateItemQuantity calls PATCH cart/:id with quantity and returns data', async () => {
        mockPatch.mockResolvedValue({ data: fakeCart });
        const result = await updateItemQuantity(10, 3);
        expect(mockPatch).toHaveBeenCalledWith('cart/10', { quantity: 3 });
        expect(result).toEqual(fakeCart);
    });

    it('removeCartItem calls DELETE cart/:id and returns data', async () => {
        mockDelete.mockResolvedValue({ data: fakeCart });
        const result = await removeCartItem(10);
        expect(mockDelete).toHaveBeenCalledWith('cart/10');
        expect(result).toEqual(fakeCart);
    });
});
