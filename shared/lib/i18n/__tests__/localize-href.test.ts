import { describe, it, expect } from 'vitest';
import { localizeHref } from '../localize-href';

describe('localizeHref', () => {
    it('prefixes an internal path with locale', () => {
        expect(localizeHref('it', '/menu')).toBe('/it/menu');
        expect(localizeHref('en', '/menu')).toBe('/en/menu');
    });

    it('handles root path without double slash', () => {
        expect(localizeHref('it', '/')).toBe('/it');
    });

    it('does not double-prefix an already-localized path', () => {
        expect(localizeHref('it', '/it/menu')).toBe('/it/menu');
        expect(localizeHref('en', '/en/product/5')).toBe('/en/product/5');
    });

    it('returns external URLs unchanged', () => {
        expect(localizeHref('it', 'https://example.com')).toBe('https://example.com');
    });

    it('returns protocol-relative URLs unchanged', () => {
        expect(localizeHref('it', '//cdn.example.com/img.png')).toBe('//cdn.example.com/img.png');
    });

    it('returns anchor links unchanged', () => {
        expect(localizeHref('it', '#section')).toBe('#section');
    });
});
