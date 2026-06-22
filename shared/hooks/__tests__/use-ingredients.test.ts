import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useIngredients } from '../use-ingredients';
import type { Ingredient } from '@/generated/prisma/client';

const { mockGetAll } = vi.hoisted(() => ({ mockGetAll: vi.fn() }));

vi.mock('@/shared/services/api-client', () => ({
    Api: { ingredients: { getAll: mockGetAll } },
}));

const fakeIngredients: Partial<Ingredient>[] = [
    { id: 1, name: 'Mozzarella', price: 59 },
    { id: 2, name: 'Basilico', price: 39 },
];

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useIngredients', () => {
    it('starts in loading state', () => {
        mockGetAll.mockReturnValue(new Promise(() => {})); // never resolves
        const { result } = renderHook(() => useIngredients());
        expect(result.current.loading).toBe(true);
        expect(result.current.ingredients).toHaveLength(0);
    });

    it('populates ingredients and stops loading on success', async () => {
        mockGetAll.mockResolvedValue(fakeIngredients);
        const { result } = renderHook(() => useIngredients());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.ingredients).toEqual(fakeIngredients);
    });

    it('stops loading even on API failure', async () => {
        mockGetAll.mockRejectedValue(new Error('network'));
        const { result } = renderHook(() => useIngredients());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.ingredients).toHaveLength(0);
    });

    it('calls Api.ingredients.getAll exactly once', async () => {
        mockGetAll.mockResolvedValue([]);
        const { rerender } = renderHook(() => useIngredients());

        await waitFor(() => expect(mockGetAll).toHaveBeenCalledTimes(1));

        rerender();
        expect(mockGetAll).toHaveBeenCalledTimes(1);
    });
});
