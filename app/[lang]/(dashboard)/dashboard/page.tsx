import { redirect } from 'next/navigation';

import { getStaffSession } from '@/shared/lib/get-staff-session';
import { localizeHref } from '@/shared/lib/i18n/localize-href';
import type { Locale } from '@/shared/constants/i18n';

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function Dashboard({ params }: Props) {
    const user = await getStaffSession();
    const { lang } = await params;

    // Kitchen staff land on the kitchen board; admins on the orders list.
    const target =
        user.role === 'KITCHEN' ? '/dashboard/kitchen' : '/dashboard/orders';
    redirect(localizeHref(lang as Locale, target));
}
