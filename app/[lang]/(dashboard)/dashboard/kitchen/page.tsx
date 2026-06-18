import { prisma } from '@/prisma/prisma-client';
import { getStaffSession } from '@/shared/lib/get-staff-session';
import { Container } from '@/shared/components/shared/container';
import { KitchenAdvanceButton } from '@/shared/components/shared/kitchen-advance-button';
import { AutoRefresh } from '@/shared/components/shared/auto-refresh';
import { format } from '@/shared/lib/i18n/format';
import { RESTAURANT_TIME_ZONE } from '@/shared/constants/restaurant';
import type { Locale } from '@/shared/constants/i18n';
import type { Dictionary } from '@/shared/lib/i18n/types';
import { OrderStatus } from '@/generated/prisma/client';
import { getDictionary } from '../../../dictionaries';

export const dynamic = 'force-dynamic';

// The kitchen pipeline: each column shows orders in a status and the action to
// move them forward.
const COLUMNS = [
    {
        status: 'SUCCEEDED',
        titleKey: 'toPrepare',
        next: 'PREPARING',
        actionKey: 'start',
    },
    {
        status: 'PREPARING',
        titleKey: 'preparing',
        next: 'READY',
        actionKey: 'markReady',
    },
    {
        status: 'READY',
        titleKey: 'ready',
        next: 'OUT_FOR_DELIVERY',
        actionKey: 'handOff',
    },
] as const satisfies ReadonlyArray<{
    status: OrderStatus;
    titleKey: keyof Dictionary['kitchen'];
    next: OrderStatus;
    actionKey: keyof Dictionary['kitchen'];
}>;

type RawItem = {
    quantity?: number;
    productItem?: {
        product?: { name?: string };
        size?: number | null;
        pizzaType?: number | null;
    };
    ingredients?: { name?: string }[];
    removedIngredients?: { name?: string }[];
};

const parseItems = (raw: unknown): RawItem[] => {
    try {
        const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return Array.isArray(value) ? (value as RawItem[]) : [];
    } catch {
        return [];
    }
};

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function KitchenPage({ params }: Props) {
    await getStaffSession();

    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    const orders = await prisma.order.findMany({
        where: { status: { in: ['SUCCEEDED', 'PREPARING', 'READY'] } },
        orderBy: { createdAt: 'asc' }, // oldest first — FIFO queue
    });

    const timeFormatter = new Intl.DateTimeFormat(lang, {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: RESTAURANT_TIME_ZONE,
    });

    const kitchenItems = (raw: unknown) =>
        parseItems(raw)
            .map(item => {
                const size = item.productItem?.size;
                const type = item.productItem?.pizzaType;
                const variant = [
                    size ? `${size} cm` : '',
                    type ? dict.pizza.types[String(type) as '1' | '2'] : '',
                ]
                    .filter(Boolean)
                    .join(' ');
                return {
                    name: item.productItem?.product?.name ?? '',
                    variant,
                    quantity: item.quantity ?? 1,
                    extras: (item.ingredients ?? [])
                        .map(i => i.name)
                        .filter(Boolean) as string[],
                    removed: (item.removedIngredients ?? [])
                        .map(i => i.name)
                        .filter(Boolean) as string[],
                };
            })
            .filter(item => item.name);

    return (
        <Container className='px-4'>
            <AutoRefresh />
            <h1 className='text-3xl font-extrabold'>{dict.kitchen.title}</h1>

            <div className='mt-6 grid gap-6 lg:grid-cols-3'>
                {COLUMNS.map(col => {
                    const colOrders = orders.filter(o => o.status === col.status);
                    return (
                        <section key={col.status}>
                            <div className='mb-3 flex items-center gap-2'>
                                <h2 className='font-bold'>
                                    {dict.kitchen[col.titleKey]}
                                </h2>
                                <span className='rounded-full bg-muted px-2.5 py-0.5 text-sm font-semibold text-muted-foreground'>
                                    {colOrders.length}
                                </span>
                            </div>

                            <div className='space-y-3'>
                                {colOrders.length === 0 ? (
                                    <p className='text-sm text-muted-foreground'>
                                        {dict.kitchen.empty}
                                    </p>
                                ) : (
                                    colOrders.map(order => (
                                        <article
                                            key={order.id}
                                            className='glass rounded-2xl p-4'
                                        >
                                            <div className='flex items-center justify-between gap-2'>
                                                <span className='font-bold'>
                                                    {format(
                                                        dict.orders.orderNumber,
                                                        { id: order.id }
                                                    )}
                                                </span>
                                                <span className='text-sm text-muted-foreground'>
                                                    {timeFormatter.format(
                                                        new Date(order.createdAt)
                                                    )}
                                                </span>
                                            </div>

                                            <ul className='mt-2 space-y-1.5 text-sm'>
                                                {kitchenItems(order.items).map(
                                                    (item, i) => (
                                                        <li key={i}>
                                                            <span className='font-medium'>
                                                                {item.name}
                                                            </span>
                                                            {item.variant && (
                                                                <span className='text-muted-foreground'>
                                                                    {' · '}
                                                                    {item.variant}
                                                                </span>
                                                            )}
                                                            <span className='font-semibold'>
                                                                {' × '}
                                                                {item.quantity}
                                                            </span>
                                                            {item.extras.length >
                                                                0 && (
                                                                <span className='block text-xs text-muted-foreground'>
                                                                    {
                                                                        dict
                                                                            .kitchen
                                                                            .extras
                                                                    }
                                                                    :{' '}
                                                                    {item.extras.join(
                                                                        ', '
                                                                    )}
                                                                </span>
                                                            )}
                                                            {item.removed.length >
                                                                0 && (
                                                                <span className='block text-xs font-medium text-destructive'>
                                                                    {item.removed
                                                                        .map(
                                                                            r =>
                                                                                `${dict.product.without} ${r}`
                                                                        )
                                                                        .join(
                                                                            ', '
                                                                        )}
                                                                </span>
                                                            )}
                                                        </li>
                                                    )
                                                )}
                                            </ul>

                                            <KitchenAdvanceButton
                                                orderId={order.id}
                                                to={col.next}
                                                label={dict.kitchen[col.actionKey]}
                                                className='mt-3'
                                            />
                                        </article>
                                    ))
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </Container>
    );
}
