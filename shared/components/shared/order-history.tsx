import React from 'react';
import type { OrderStatus } from '@/generated/prisma/client';
import type { Dictionary } from '@/shared/lib/i18n/types';
import type { Locale } from '@/shared/constants/i18n';
import { format } from '@/shared/lib/i18n/format';
import { formatPrice } from '@/shared/lib';
import { OrderStatusBadge } from './order-status-badge';

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
}

// Orders store the cart snapshot as a JSON string; parse it defensively.
type ParsedItem = {
    quantity: number;
    productItem?: { product?: { name?: string } };
};

const parseItems = (raw: unknown): ParsedItem[] => {
    try {
        const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return Array.isArray(value) ? (value as ParsedItem[]) : [];
    } catch {
        return [];
    }
};

export const OrderHistory: React.FC<Props> = ({ orders, lang, dict }) => {
    if (orders.length === 0) {
        return <p className='text-muted-foreground'>{dict.empty}</p>;
    }

    const dateFormatter = new Intl.DateTimeFormat(lang, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <ul className='space-y-4'>
            {orders.map(order => {
                const items = parseItems(order.items);
                const summary = items
                    .map(
                        item =>
                            `${item.productItem?.product?.name ?? ''} × ${item.quantity}`
                    )
                    .filter(Boolean)
                    .join(' · ');

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

                        <div className='mt-3 text-sm font-semibold'>
                            {dict.total}: {formatPrice(order.totalAmount)}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};
