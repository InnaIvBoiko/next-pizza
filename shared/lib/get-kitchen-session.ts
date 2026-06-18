import { redirect } from 'next/navigation';

import { UserRole } from '@/generated/prisma/enums';
import { getUserSession } from './get-user-session';

/**
 * Server-side guard for the kitchen view. Allows kitchen staff and admins;
 * redirects everyone else to the home page. Secure check next to the data
 * (Proxy does the optimistic cookie-only pre-check).
 */
export const getKitchenSession = async () => {
    const user = await getUserSession();

    if (
        !user ||
        (user.role !== UserRole.ADMIN && user.role !== UserRole.KITCHEN)
    ) {
        redirect('/');
    }

    return user;
};
