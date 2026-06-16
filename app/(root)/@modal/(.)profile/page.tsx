import { redirect } from 'next/navigation';

import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { ProfileModal } from '@/shared/components/shared/modals';

export default async function ProfileModalPage() {
    const session = await getUserSession();

    if (!session) {
        return redirect('/');
    }

    const user = await prisma.user.findFirst({
        where: { id: Number(session.id) },
    });

    if (!user) {
        return redirect('/');
    }

    return <ProfileModal user={user} />;
}
