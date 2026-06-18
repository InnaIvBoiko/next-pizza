import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { OrderStatus } from '@/generated/prisma/client';
import type { Dictionary } from '@/shared/lib/i18n/types';
import type { Locale } from '@/shared/constants/i18n';
import { format } from '@/shared/lib/i18n/format';
import { OrderStatusBadge } from './order-status-badge';

// Post-payment lifecycle shown in the stepper. PENDING (awaiting payment) sits
// before the first step, so the whole track stays dim until the order is paid.
const STEPS: OrderStatus[] = [
    'SUCCEEDED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
];

interface OrderLike {
    id: number;
    status: OrderStatus;
    createdAt: Date | string;
}

interface Props {
    order: OrderLike;
    lang: Locale;
    dict: Dictionary['orders'];
}

export const ActiveOrderCard: React.FC<Props> = ({ order, lang, dict }) => {
    const currentIndex = STEPS.indexOf(order.status);

    const dateStr = new Intl.DateTimeFormat(lang, {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(order.createdAt));

    return (
        <div className='glass rounded-2xl border border-primary/30 p-5'>
            <div className='flex items-start justify-between gap-3'>
                <div>
                    <div className='text-xs font-semibold tracking-wide text-primary uppercase'>
                        {dict.activeTitle}
                    </div>
                    <div className='mt-0.5 font-bold'>
                        {format(dict.orderNumber, { id: order.id })}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                        {dateStr}
                    </div>
                </div>
                <OrderStatusBadge
                    status={order.status}
                    label={dict.status[order.status]}
                />
            </div>

            <ol className='mt-5 flex items-center'>
                {STEPS.map((step, i) => (
                    <li
                        key={step}
                        className='flex flex-1 items-center last:flex-none'
                    >
                        <span
                            className={cn(
                                'size-3 shrink-0 rounded-full',
                                currentIndex >= i
                                    ? 'bg-primary'
                                    : 'bg-muted-foreground/25'
                            )}
                        />
                        {i < STEPS.length - 1 && (
                            <span
                                className={cn(
                                    'h-0.5 flex-1',
                                    currentIndex > i
                                        ? 'bg-primary'
                                        : 'bg-muted-foreground/20'
                                )}
                            />
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
};
