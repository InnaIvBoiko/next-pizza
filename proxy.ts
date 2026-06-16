import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { UserRole } from '@/generated/prisma/enums';

// Next.js 16 renamed the `middleware` convention to `proxy`. Proxy runs on the
// Node.js runtime, so we can read the NextAuth JWT here. These are optimistic
// checks (cookie-only, no DB) used to pre-filter unauthorized users; the secure
// checks still live next to the data (see `getAdminSession` and the route
// handlers under /api).

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Not signed in: send to the home page (where the auth modal lives) and
    // remember where they were headed.
    if (!token) {
        const url = new URL('/', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    // The dashboard is admin-only (RBAC).
    if (pathname.startsWith('/dashboard') && token.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Only run on the protected areas. API routes guard themselves so they can
    // return proper 401/403 JSON instead of a redirect.
    matcher: ['/dashboard/:path*', '/profile/:path*'],
};
