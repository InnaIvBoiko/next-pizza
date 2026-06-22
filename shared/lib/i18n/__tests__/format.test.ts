import { describe, it, expect } from 'vitest';
import { format } from '../format';

describe('format', () => {
    it('replaces a single placeholder', () => {
        expect(format('Ciao {name}', { name: 'Mario' })).toBe('Ciao Mario');
    });

    it('replaces multiple placeholders', () => {
        expect(format('{size} cm, {type} pizza', { size: 30, type: 'tradizionale' }))
            .toBe('30 cm, tradizionale pizza');
    });

    it('coerces numbers to string', () => {
        expect(format('{count} items', { count: 5 })).toBe('5 items');
    });

    it('leaves unknown placeholders untouched', () => {
        expect(format('Hello {unknown}', {})).toBe('Hello {unknown}');
    });

    it('returns template unchanged when no vars provided', () => {
        expect(format('No placeholders')).toBe('No placeholders');
    });

    it('handles empty template', () => {
        expect(format('', { name: 'x' })).toBe('');
    });
});
