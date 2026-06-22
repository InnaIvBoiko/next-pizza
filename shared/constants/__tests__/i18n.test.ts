import { describe, it, expect } from 'vitest';
import { locales, defaultLocale, localeNames, isLocale } from '../i18n';

describe('i18n constants', () => {
    it('locales contains it and en', () => {
        expect(locales).toContain('it');
        expect(locales).toContain('en');
    });

    it('defaultLocale is it', () => {
        expect(defaultLocale).toBe('it');
    });

    it('localeNames has display names for all locales', () => {
        expect(localeNames.it).toBe('Italiano');
        expect(localeNames.en).toBe('English');
    });
});

describe('isLocale', () => {
    it('returns true for valid locales', () => {
        expect(isLocale('it')).toBe(true);
        expect(isLocale('en')).toBe(true);
    });

    it('returns false for unknown strings', () => {
        expect(isLocale('fr')).toBe(false);
        expect(isLocale('')).toBe(false);
        expect(isLocale('IT')).toBe(false);
    });
});
