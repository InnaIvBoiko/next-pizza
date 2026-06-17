// Locale configuration shared across the app. Kept free of `server-only` and of
// any heavy imports so it can be used from the proxy (Edge/Node), Server
// Components, and Client Components alike.

export const locales = ['it', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'it';

export const localeNames: Record<Locale, string> = {
    it: 'Italiano',
    en: 'English',
};

export const isLocale = (value: string): value is Locale =>
    (locales as readonly string[]).includes(value);
