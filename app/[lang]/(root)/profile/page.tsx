import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { ProfileForm } from '@/shared/components/shared/profile-form';
import { ProfilePanel } from '@/shared/components/shared/profile-panel';
import { OrderHistory } from '@/shared/components/shared/order-history';
import { ActiveOrderCard } from '@/shared/components/shared/active-order-card';
import { splitActiveOrder } from '@/shared/lib/order-status';
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

    const userId = Number(session.id);

    const [user, orders] = await Promise.all([
        prisma.user.findFirst({ where: { id: userId } }),
        prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    if (!user) {
        return redirect(`/${lang}`);
    }

    const { activeOrder, pastOrders } = splitActiveOrder(orders);

    return (
        <section className='glow-warm'>
            <Container className='px-4 py-10'>
                <div className='mx-auto w-full max-w-xl'>
                    <Title
                        text={dict.profile.pageTitle}
                        size='lg'
                        className='font-extrabold'
                    />
                    <p className='mt-2 text-muted-foreground'>
                        {dict.profile.pageDescription}
                    </p>

                    <div className='mt-6'>
                        <ProfilePanel
                            accountLabel={dict.profile.tab}
                            ordersLabel={dict.orders.tab}
                            account={
                                <div className='glass rounded-3xl p-6 sm:p-8'>
                                    <ProfileForm data={user} />
                                </div>
                            }
                            orders={
                                <OrderHistory
                                    orders={pastOrders}
                                    lang={lang as Locale}
                                    dict={dict.orders}
                                    emptyLabel={
                                        activeOrder
                                            ? dict.orders.emptyPast
                                            : dict.orders.empty
                                    }
                                />
                            }
                            activeOrder={
                                activeOrder ? (
                                    <ActiveOrderCard
                                        order={activeOrder}
                                        lang={lang as Locale}
                                        dict={dict.orders}
                                    />
                                ) : undefined
                            }
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}
