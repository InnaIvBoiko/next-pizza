import type { Locale } from '@/shared/constants/i18n';

/**
 * Pick the locale-appropriate description. `description` holds the source/default
 * (English) value; `descriptionIt` the Italian translation. Falls back to the
 * default when the translation is missing.
 */
export const localizeDescription = (
    entity: { description?: string | null; descriptionIt?: string | null },
    locale: Locale
): string | null =>
    (locale === 'it'
        ? (entity.descriptionIt ?? entity.description)
        : entity.description) ?? null;
