import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { usePizzaOptions } from '../use-pizza-options';
import { DictionaryProvider } from '@/shared/components/shared/i18n/dictionary-provider';
import type { Dictionary } from '@/shared/lib/i18n/types';
import type { ProductItem } from '@/generated/prisma/client';

const dict = {
    pizza: {
        sizes: { '20': 'Piccola', '30': 'Media', '40': 'Grande' },
        types: { '1': 'tradizionale', '2': 'sottile' },
    },
} as unknown as Dictionary;

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DictionaryProvider dict={dict} lang='it'>
        {children}
    </DictionaryProvider>
);

const makeItem = (id: number, pizzaType: number, size: number): ProductItem =>
    ({ id, pizzaType, size, price: 500 }) as ProductItem;

describe('usePizzaOptions', () => {
    it('initializes with size=20 and type=1', () => {
        const { result } = renderHook(() => usePizzaOptions([makeItem(1, 1, 20)]), { wrapper });
        expect(result.current.size).toBe(20);
        expect(result.current.type).toBe(1);
    });

    it('setSize updates the size', () => {
        const items = [makeItem(1, 1, 20), makeItem(2, 1, 30)];
        const { result } = renderHook(() => usePizzaOptions(items), { wrapper });

        act(() => result.current.setSize(30));

        expect(result.current.size).toBe(30);
    });

    it('setType updates the type', () => {
        const items = [makeItem(1, 1, 20), makeItem(2, 2, 20)];
        const { result } = renderHook(() => usePizzaOptions(items), { wrapper });

        act(() => result.current.setType(2));

        expect(result.current.type).toBe(2);
    });

    it('addIngredient toggles ingredient selection', () => {
        const { result } = renderHook(() => usePizzaOptions([makeItem(1, 1, 20)]), { wrapper });

        act(() => result.current.addIngredient(5));
        expect(result.current.selectedIngredients.has(5)).toBe(true);

        act(() => result.current.addIngredient(5));
        expect(result.current.selectedIngredients.has(5)).toBe(false);
    });

    it('currentItemId matches the selected type+size combination', () => {
        const items = [makeItem(42, 1, 20), makeItem(99, 1, 30)];
        const { result } = renderHook(() => usePizzaOptions(items), { wrapper });

        expect(result.current.currentItemId).toBe(42);

        act(() => result.current.setSize(30));
        expect(result.current.currentItemId).toBe(99);
    });

    it('auto-selects first available size when current size is disabled for new type', async () => {
        // type=2 only has size=30; when switching to type=2, size should update from 20 to 30
        const items = [makeItem(1, 1, 20), makeItem(2, 2, 30)];
        const { result } = renderHook(() => usePizzaOptions(items), { wrapper });

        act(() => result.current.setType(2));

        // the auto-select runs in a microtask (Promise.resolve) inside the effect
        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.size).toBe(30);
    });
});
