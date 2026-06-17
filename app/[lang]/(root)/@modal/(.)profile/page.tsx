import { redirect } from 'next/navigation';

import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { ProfileModal } from '@/shared/components/shared/modals';

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function ProfileModalPage({ params }: Props) {
    const { lang } = await params;
    const session = await getUserSession();

    if (!session) {
        return redirect(`/${lang}`);
    }

    const user = await prisma.user.findFirst({
        where: { id: Number(session.id) },
    });

    if (!user) {
        return redirect(`/${lang}`);
    }

    return <ProfileModal user={user} />;
}
