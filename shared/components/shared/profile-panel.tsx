'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

interface Tab {
    key: string;
    label: string;
    content: React.ReactNode;
}

interface Props {
    tabs: Tab[];
    /** Highlighted active-order card, shown above the tabs when present. */
    activeOrder?: React.ReactNode;
}

/**
 * Splits the profile into tabs (details / addresses / orders) so the panel
 * stays light instead of one long scroll. An active order, when present, is
 * surfaced above the tabs so its status is always visible.
 */
export const ProfilePanel: React.FC<Props> = ({ tabs, activeOrder }) => {
    const [activeKey, setActiveKey] = React.useState(tabs[0]?.key);

    const tabClass = (active: boolean) =>
        cn(
            'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
            active
                ? 'bg-background text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
        );

    const active = tabs.find(tab => tab.key === activeKey) ?? tabs[0];

    return (
        <div>
            {activeOrder && <div className='mb-6'>{activeOrder}</div>}

            <div className='inline-flex w-full gap-1 rounded-full bg-muted p-1'>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        type='button'
                        className={tabClass(tab.key === active?.key)}
                        onClick={() => setActiveKey(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className='mt-6'>{active?.content}</div>
        </div>
    );
};
