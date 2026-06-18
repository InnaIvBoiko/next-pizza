import { redirect } from 'next/navigation';

import { UserRole } from '@/generated/prisma/enums';
import { getUserSession } from './get-user-session';

/**
 * Server-side guard for the dashboard area. Allows admins and kitchen staff;
 * redirects everyone else home. Individual pages still narrow access further
 * (admin-only pages use `getAdminSession`).
 */
export const getStaffSession = async () => {
    const user = await getUserSession();

    if (
        !user ||
        (user.role !== UserRole.ADMIN && user.role !== UserRole.KITCHEN)
    ) {
        redirect('/');
    }

    return user;
};
