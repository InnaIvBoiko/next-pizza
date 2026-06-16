import { redirect } from 'next/navigation';

import { UserRole } from '@/generated/prisma/enums';
import { getUserSession } from './get-user-session';

/**
 * Server-side guard for admin-only pages. Redirects to the home page when the
 * visitor is not authenticated or is not an ADMIN, otherwise returns the user.
 *
 * This is the secure, close-to-the-data check. The root `proxy.ts` performs the
 * same check optimistically on every request, but layouts/pages must still
 * verify because Proxy is not meant to be the only line of defense.
 */
export const getAdminSession = async () => {
    const user = await getUserSession();

    if (!user || user.role !== UserRole.ADMIN) {
        redirect('/');
    }

    return user;
};
