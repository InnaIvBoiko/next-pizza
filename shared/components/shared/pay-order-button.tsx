'use client';

import React from 'react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { Button } from '../ui';
import { payOrder } from '@/app/actions';
import { logger } from '@/shared/lib/logger.client';
import { useDictionary } from './i18n/dictionary-provider';

interface Props {
    orderId: number;
    className?: string;
}

/** Resume payment for a PENDING order: gets a fresh Stripe URL and redirects. */
export const PayOrderButton: React.FC<Props> = ({ orderId, className }) => {
    const dict = useDictionary();
    const [loading, setLoading] = React.useState(false);

    const onClick = async () => {
        try {
            setLoading(true);
            const url = await payOrder(orderId);
            if (url) {
                window.location.href = url;
                return;
            }
            throw new Error('No payment URL');
        } catch (err) {
            logger.error({ err }, '[PayOrderButton] failed');
            toast.error(dict.orders.payError);
            setLoading(false);
        }
    };

    return (
        <Button
            type='button'
            size='sm'
            onClick={onClick}
            disabled={loading}
            className={cn('rounded-full', className)}
        >
            {dict.orders.payNow}
        </Button>
    );
};
