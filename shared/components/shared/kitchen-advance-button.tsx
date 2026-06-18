'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { Button } from '../ui';
import type { OrderStatus } from '@/generated/prisma/enums';
import { advanceKitchenOrder } from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { useDictionary } from './i18n/dictionary-provider';

interface Props {
    orderId: number;
    to: OrderStatus;
    label: string;
    className?: string;
}

/** Move an order to the next kitchen status, then refresh the board. */
export const KitchenAdvanceButton: React.FC<Props> = ({
    orderId,
    to,
    label,
    className,
}) => {
    const dict = useDictionary();
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const onClick = async () => {
        try {
            setLoading(true);
            await advanceKitchenOrder(orderId, to);
            router.refresh();
        } catch (err) {
            logger.error({ err }, '[KitchenAdvanceButton] failed');
            toast.error(dict.kitchen.updateError);
            setLoading(false);
        }
    };

    return (
        <Button
            type='button'
            size='sm'
            onClick={onClick}
            disabled={loading}
            className={cn('w-full rounded-full', className)}
        >
            {label}
        </Button>
    );
};
