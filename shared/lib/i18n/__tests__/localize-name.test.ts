import { describe, it, expect } from 'vitest';
import { localizeName } from '../localize-name';

describe('localizeName', () => {
    it('returns nameIt for Italian locale when available', () => {
        expect(localizeName({ name: 'Margherita', nameIt: 'Margherita IT' }, 'it')).toBe('Margherita IT');
    });

    it('falls back to name when nameIt is null', () => {
        expect(localizeName({ name: 'Margherita', nameIt: null }, 'it')).toBe('Margherita');
    });

    it('falls back to name when nameIt is undefined', () => {
        expect(localizeName({ name: 'Margherita' }, 'it')).toBe('Margherita');
    });

    it('always returns name for English locale', () => {
        expect(localizeName({ name: 'Margherita', nameIt: 'Margherita IT' }, 'en')).toBe('Margherita');
    });
});
