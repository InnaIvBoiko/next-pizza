'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

interface Props {
    accountLabel: string;
    ordersLabel: string;
    /** Account form (server/client node). */
    account: React.ReactNode;
    /** Order history list. */
    orders: React.ReactNode;
    /** Highlighted active-order card, shown above the tabs when present. */
    activeOrder?: React.ReactNode;
}

/**
 * Splits the profile into two tabs (details / orders) so the panel stays light
 * instead of one long scroll. An active order, when present, is surfaced above
 * the tabs so its status is always visible.
 */
export const ProfilePanel: React.FC<Props> = ({
    accountLabel,
    ordersLabel,
    account,
    orders,
    activeOrder,
}) => {
    const [tab, setTab] = React.useState<'account' | 'orders'>('account');

    const tabClass = (active: boolean) =>
        cn(
            'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
            active
                ? 'bg-background text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
        );

    return (
        <div>
            {activeOrder && <div className='mb-6'>{activeOrder}</div>}

            <div className='inline-flex w-full gap-1 rounded-full bg-muted p-1'>
                <button
                    type='button'
                    className={tabClass(tab === 'account')}
                    onClick={() => setTab('account')}
                >
                    {accountLabel}
                </button>
                <button
                    type='button'
                    className={tabClass(tab === 'orders')}
                    onClick={() => setTab('orders')}
                >
                    {ordersLabel}
                </button>
            </div>

            <div className='mt-6'>{tab === 'account' ? account : orders}</div>
        </div>
    );
};
