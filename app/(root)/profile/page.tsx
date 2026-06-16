import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { ProfileForm } from '@/shared/components/shared/profile-form';
import { Container } from '@/shared/components/shared/container';
import { Title } from '@/shared/components/shared/title';

export const metadata: Metadata = {
    title: 'Next Pizza | Profile',
};

export default async function ProfilePage() {
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

    return (
        <Container className='my-10 w-96'>
            <Title text='My Profile' size='md' className='font-bold' />
            <div className='mt-10'>
                <ProfileForm data={user} />
            </div>
        </Container>
    );
}
