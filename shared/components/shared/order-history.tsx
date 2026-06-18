import React from 'react';
import type { OrderStatus } from '@/generated/prisma/client';
import type { Dictionary } from '@/shared/lib/i18n/types';
import type { Locale } from '@/shared/constants/i18n';
import { format } from '@/shared/lib/i18n/format';
import { formatPrice } from '@/shared/lib';
import { orderItemsSummary } from '@/shared/lib/order-items';
import { RESTAURANT_TIME_ZONE } from '@/shared/constants/restaurant';
import { OrderStatusBadge } from './order-status-badge';
import { PayOrderButton } from './pay-order-button';
import { CancelOrderButton } from './cancel-order-button';

interface OrderLike {
    id: number;
    status: OrderStatus;
    totalAmount: number;
    items: unknown;
    createdAt: Date | string;
}

interface Props {
    orders: OrderLike[];
    lang: Locale;
    dict: Dictionary['orders'];
    /** Override the empty message (e.g. "no past orders" when one is active). */
    emptyLabel?: string;
}

export const OrderHistory: React.FC<Props> = ({
    orders,
    lang,
    dict,
    emptyLabel,
}) => {
    if (orders.length === 0) {
        return (
            <p className='text-muted-foreground'>{emptyLabel ?? dict.empty}</p>
        );
    }

    const dateFormatter = new Intl.DateTimeFormat(lang, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: RESTAURANT_TIME_ZONE,
    });

    return (
        <ul className='space-y-4'>
            {orders.map(order => {
                const summary = orderItemsSummary(order.items);

                return (
                    <li key={order.id} className='glass rounded-2xl p-4 sm:p-5'>
                        <div className='flex items-start justify-between gap-3'>
                            <div>
                                <div className='font-bold'>
                                    {format(dict.orderNumber, { id: order.id })}
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    {dateFormatter.format(
                                        new Date(order.createdAt)
                                    )}
                                </div>
                            </div>
                            <OrderStatusBadge
                                status={order.status}
                                label={dict.status[order.status]}
                            />
                        </div>

                        {summary && (
                            <p className='mt-3 line-clamp-2 text-sm text-muted-foreground'>
                                {summary}
                            </p>
                        )}

                        <div className='mt-3 flex items-center justify-between gap-3'>
                            <span className='text-sm font-semibold'>
                                {dict.total}: {formatPrice(order.totalAmount)}
                            </span>
                            {order.status === 'PENDING' && (
                                <div className='flex gap-2'>
                                    <PayOrderButton orderId={order.id} />
                                    <CancelOrderButton orderId={order.id} />
                                </div>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};
