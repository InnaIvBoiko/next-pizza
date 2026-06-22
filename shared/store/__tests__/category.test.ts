import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCategoryStore } from '../category';

beforeEach(() => {
    useCategoryStore.setState({ activeId: 0 });
});

describe('useCategoryStore', () => {
    it('initializes with activeId 0', () => {
        const { result } = renderHook(() => useCategoryStore());
        expect(result.current.activeId).toBe(0);
    });

    it('setActiveId updates activeId', () => {
        const { result } = renderHook(() => useCategoryStore());

        act(() => result.current.setActiveId(3));

        expect(result.current.activeId).toBe(3);
    });

    it('setActiveId replaces previous value', () => {
        const { result } = renderHook(() => useCategoryStore());

        act(() => result.current.setActiveId(3));
        act(() => result.current.setActiveId(7));

        expect(result.current.activeId).toBe(7);
    });
});
