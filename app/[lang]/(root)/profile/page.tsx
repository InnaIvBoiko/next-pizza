import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { ProfileForm } from '@/shared/components/shared/profile-form';
import { Container } from '@/shared/components/shared/container';
import { Title } from '@/shared/components/shared/title';
import type { Locale } from '@/shared/constants/i18n';
import { getDictionary } from '../../dictionaries';

export const metadata: Metadata = {
    title: 'Next Pizza | Profile',
};

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function ProfilePage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);
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

    return (
        <section className='glow-warm'>
            <Container className='px-4 py-10'>
                <div className='mx-auto w-full max-w-md'>
                    <Title
                        text={dict.profile.pageTitle}
                        size='lg'
                        className='font-extrabold'
                    />
                    <p className='mt-2 text-muted-foreground'>
                        {dict.profile.pageDescription}
                    </p>
                    <div className='glass mt-6 rounded-3xl p-6 sm:p-8'>
                        <ProfileForm data={user} />
                    </div>
                </div>
            </Container>
        </section>
    );
}
