import type { Locale } from '@/shared/constants/i18n';

/**
 * Pick the locale-appropriate name for a DB entity. `name` holds the
 * source/default (English) value; `nameIt` the Italian translation. Falls back
 * to `name` when the translation is missing.
 */
export const localizeName = (
    entity: { name: string; nameIt?: string | null },
    locale: Locale
): string => (locale === 'it' ? (entity.nameIt ?? entity.name) : entity.name);
