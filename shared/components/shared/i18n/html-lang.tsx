'use client';

import { useEffect } from 'react';
import type { Locale } from '@/shared/constants/i18n';

// Keeps the <html lang> attribute in sync with the active locale. The root
// layout (above `[lang]`) renders a static lang, so this corrects it on the
// client after a locale switch — without remounting the theme provider.
export const HtmlLang = ({ lang }: { lang: Locale }) => {
    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    return null;
};
