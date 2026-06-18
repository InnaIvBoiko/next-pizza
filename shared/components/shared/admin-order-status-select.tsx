'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { OrderStatus } from '@/generated/prisma/client';
import { updateOrderStatus } from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { useDictionary } from './i18n/dictionary-provider';

const STATUSES: OrderStatus[] = [
    'PENDING',
    'SUCCEEDED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
];

interface Props {
    orderId: number;
    status: OrderStatus;
}

export const AdminOrderStatusSelect: React.FC<Props> = ({
    orderId,
    status,
}) => {
    const dict = useDictionary();
    const router = useRouter();
    const [pending, setPending] = React.useState(false);

    const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const next = e.target.value as OrderStatus;
        try {
            setPending(true);
            await updateOrderStatus(orderId, next);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[AdminOrderStatusSelect] failed');
            toast.error(dict.admin.updateError);
        } finally {
            setPending(false);
        }
    };

    return (
        <select
            value={status}
            onChange={onChange}
            disabled={pending}
            className='rounded-full border border-input bg-background px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'
        >
            {STATUSES.map(s => (
                <option key={s} value={s}>
                    {dict.orders.status[s]}
                </option>
            ))}
        </select>
    );
};
