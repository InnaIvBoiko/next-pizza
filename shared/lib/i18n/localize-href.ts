import { isLocale, type Locale } from '@/shared/constants/i18n';

// Prefix an internal path with the active locale: localizeHref('it', '/menu')
// -> '/it/menu'. Pure anchors (#section), external URLs and paths that already
// carry a locale are returned unchanged so callers can use it indiscriminately.
export const localizeHref = (locale: Locale, href: string): string => {
    if (
        !href.startsWith('/') ||
        href.startsWith('//') ||
        href.startsWith('#')
    ) {
        return href;
    }

    const [firstSegment] = href.split('/').filter(Boolean);
    if (firstSegment && isLocale(firstSegment)) {
        return href;
    }

    return `/${locale}${href === '/' ? '' : href}`;
};
