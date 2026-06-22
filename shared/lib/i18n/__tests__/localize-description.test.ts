import { describe, it, expect } from 'vitest';
import { localizeDescription } from '../localize-description';

describe('localizeDescription', () => {
    it('returns descriptionIt for Italian locale when available', () => {
        expect(localizeDescription({ description: 'Classic', descriptionIt: 'Classica' }, 'it')).toBe('Classica');
    });

    it('falls back to description when descriptionIt is null for Italian', () => {
        expect(localizeDescription({ description: 'Classic', descriptionIt: null }, 'it')).toBe('Classic');
    });

    it('returns null when both are null', () => {
        expect(localizeDescription({ description: null, descriptionIt: null }, 'it')).toBeNull();
    });

    it('returns null when both are undefined', () => {
        expect(localizeDescription({}, 'it')).toBeNull();
    });

    it('returns description for English locale', () => {
        expect(localizeDescription({ description: 'Classic', descriptionIt: 'Classica' }, 'en')).toBe('Classic');
    });

    it('returns null for English when description is absent', () => {
        expect(localizeDescription({ descriptionIt: 'Classica' }, 'en')).toBeNull();
    });
});
