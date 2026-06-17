'use client';

import React from 'react';
import type { Locale } from '@/shared/constants/i18n';
import type { Dictionary } from '@/shared/lib/i18n/types';
import { localizeHref } from '@/shared/lib/i18n/localize-href';

interface I18nContextValue {
    dict: Dictionary;
    lang: Locale;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export const DictionaryProvider: React.FC<
    React.PropsWithChildren<I18nContextValue>
> = ({ dict, lang, children }) => {
    const value = React.useMemo(() => ({ dict, lang }), [dict, lang]);
    return <I18nContext value={value}>{children}</I18nContext>;
};

const useI18n = (): I18nContextValue => {
    const ctx = React.use(I18nContext);
    if (!ctx) {
        throw new Error('useI18n must be used within a DictionaryProvider');
    }
    return ctx;
};

/** Full translation dictionary for the active locale. */
export const useDictionary = (): Dictionary => useI18n().dict;

/** Active locale code, e.g. 'it' | 'en'. */
export const useLocale = (): Locale => useI18n().lang;

/** Returns a memoized helper that prefixes internal hrefs with the locale. */
export const useLocalizeHref = (): ((href: string) => string) => {
    const { lang } = useI18n();
    return React.useCallback((href: string) => localizeHref(lang, href), [lang]);
};
