import 'server-only';

import { defaultLocale, type Locale } from '@/shared/constants/i18n';
import type { Dictionary } from '@/shared/lib/i18n/types';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
    it: () => import('./dictionaries/it.json').then((m) => m.default),
    en: () => import('./dictionaries/en.json').then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
    (dictionaries[locale] ?? dictionaries[defaultLocale])();
