import { redirect } from 'next/navigation';

import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { ProfileModal } from '@/shared/components/shared/modals';
import { AddressList } from '@/shared/components/shared/addresses';
import { OrderHistory } from '@/shared/components/shared/order-history';
import { ActiveOrderCard } from '@/shared/components/shared/active-order-card';
import { splitActiveOrder } from '@/shared/lib/order-status';
import type { Locale } from '@/shared/constants/i18n';
import { getDictionary } from '../../../dictionaries';

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function ProfileModalPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);
    const session = await getUserSession();

    if (!session) {
        return redirect(`/${lang}`);
    }

    const userId = Number(session.id);

    const [user, orders, addresses] = await Promise.all([
        prisma.user.findFirst({ where: { id: userId } }),
        prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        }),
    ]);

    if (!user) {
        return redirect(`/${lang}`);
    }

    const { activeOrder, pastOrders } = splitActiveOrder(orders);

    return (
        <ProfileModal
            user={user}
            title={dict.profile.pageTitle}
            accountLabel={dict.profile.tab}
            addressesLabel={dict.addresses.tab}
            ordersLabel={dict.orders.tab}
            addresses={<AddressList addresses={addresses} />}
            activeOrder={
                activeOrder ? (
                    <ActiveOrderCard
                        order={activeOrder}
                        lang={lang as Locale}
                        dict={dict.orders}
                    />
                ) : undefined
            }
            orders={
                <OrderHistory
                    orders={pastOrders}
                    lang={lang as Locale}
                    dict={dict.orders}
                    emptyLabel={
                        activeOrder ? dict.orders.emptyPast : dict.orders.empty
                    }
                />
            }
        />
    );
}
