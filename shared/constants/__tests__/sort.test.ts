import { describe, it, expect } from 'vitest';
import { sortOptions, defaultSort, parseSort } from '../sort';

describe('sort constants', () => {
    it('sortOptions contains all expected keys', () => {
        expect(sortOptions).toContain('popular');
        expect(sortOptions).toContain('priceAsc');
        expect(sortOptions).toContain('priceDesc');
        expect(sortOptions).toContain('newest');
    });

    it('defaultSort is popular', () => {
        expect(defaultSort).toBe('popular');
    });
});

describe('parseSort', () => {
    it('returns a valid sort option unchanged', () => {
        expect(parseSort('priceAsc')).toBe('priceAsc');
        expect(parseSort('newest')).toBe('newest');
    });

    it('falls back to defaultSort for unknown values', () => {
        expect(parseSort('invalid')).toBe(defaultSort);
        expect(parseSort('')).toBe(defaultSort);
    });

    it('falls back to defaultSort for null or undefined', () => {
        expect(parseSort(null)).toBe(defaultSort);
        expect(parseSort(undefined)).toBe(defaultSort);
    });
});
