import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { UserRole } from '@/generated/prisma/enums';
import { defaultLocale, isLocale } from '@/shared/constants/i18n';

// Next.js 16 renamed the `middleware` convention to `proxy`. Proxy runs on the
// Node.js runtime, so we can read the NextAuth JWT here. These are optimistic
// checks (cookie-only, no DB) used to pre-filter unauthorized users; the secure
// checks still live next to the data (see `getAdminSession` and the route
// handlers under /api).
//
// The proxy also owns locale routing: every page lives under `/[lang]`, so a
// request without a locale prefix is redirected to the user's best-match
// locale (cookie > Accept-Language > default).

const LOCALE_COOKIE = 'NEXT_LOCALE';

function getPreferredLocale(request: NextRequest) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (cookieLocale && isLocale(cookieLocale)) {
        return cookieLocale;
    }

    // Lightweight Accept-Language negotiation: first supported tag wins.
    const accept = request.headers.get('accept-language') ?? '';
    for (const part of accept.split(',')) {
        const tag = part.split(';')[0].trim().slice(0, 2).toLowerCase();
        if (isLocale(tag)) {
            return tag;
        }
    }

    return defaultLocale;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Detect the locale segment, e.g. `/it/menu` -> `it`.
    const segments = pathname.split('/');
    const maybeLocale = segments[1];
    const pathLocale = isLocale(maybeLocale) ? maybeLocale : null;

    // No locale prefix: redirect to the preferred locale, preserving the path
    // and query string.
    if (!pathLocale) {
        const locale = getPreferredLocale(request);
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
        return NextResponse.redirect(url);
    }

    // Path relative to the locale, e.g. `/it/dashboard/x` -> `/dashboard/x`.
    const rest = pathname.slice(`/${pathLocale}`.length) || '/';
    const isProtected =
        rest.startsWith('/dashboard') || rest.startsWith('/profile');

    if (!isProtected) {
        return NextResponse.next();
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Not signed in: send to the locale home (where the auth modal lives) and
    // remember where they were headed.
    if (!token) {
        const url = new URL(`/${pathLocale}`, request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    // The dashboard is admin-only (RBAC).
    if (rest.startsWith('/dashboard') && token.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL(`/${pathLocale}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Run on everything except API routes, Next internals, and static files
    // (anything with a file extension). Both locale routing and the auth
    // pre-checks are handled inside `proxy`.
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
