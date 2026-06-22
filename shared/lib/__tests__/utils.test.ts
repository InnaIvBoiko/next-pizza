import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn', () => {
    it('joins class names', () => {
        expect(cn('a', 'b')).toBe('a b');
    });

    it('ignores falsy values', () => {
        expect(cn('a', false, undefined, null, 'b')).toBe('a b');
    });

    it('merges conflicting Tailwind classes (last wins)', () => {
        expect(cn('p-4', 'p-8')).toBe('p-8');
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('returns empty string for no arguments', () => {
        expect(cn()).toBe('');
    });

    it('handles conditional object syntax', () => {
        expect(cn({ 'font-bold': true, 'font-thin': false })).toBe('font-bold');
    });
});
