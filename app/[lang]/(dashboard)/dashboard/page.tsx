import { redirect } from 'next/navigation';

import { getAdminSession } from '@/shared/lib/get-admin-session';
import { localizeHref } from '@/shared/lib/i18n/localize-href';
import type { Locale } from '@/shared/constants/i18n';

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function Dashboard({ params }: Props) {
    await getAdminSession();
    const { lang } = await params;
    redirect(localizeHref(lang as Locale, '/dashboard/orders'));
}
